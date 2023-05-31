import { Abi, Table } from "../../types/abi.types";
import {
  ArtifactType,
  GeneratedOutput,
  ParsedAbiComponent,
  ParsedType,
} from "../generate.types";
import {
  TargetTech,
  generateCustomTypeName,
  getMappedType,
} from "../../types/mapping.types";
import { paramCase, pascalCase } from "change-case";

import Logger from "../../../../logger";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { getDefault } from "../common/mappers";
import path from "path";

const logger = Logger.getLogger();

export const generateDeltaMappers = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const deltaMappers: Map<string, string> = new Map();

  abi.tables.forEach((table) => {
    const parsedDelta = parseAbiDelta(abi, table);

    const deltaMapperContent = generateDeltaMapperContent(
      contract,
      parsedDelta
    );

    deltaMappers.set(table.name, deltaMapperContent);
  });

  const mappersContent = generateContractDeltasMapperContent(
    contract,
    Array.from(deltaMappers.keys())
  );

  const exportsContent = generateExportsContent([contract]);

  return createOutput(
    baseDir,
    contract,
    deltaMappers,
    mappersContent,
    exportsContent
  );
};

const generateDeltaMapperContent = (
  contract: string,
  delta: ParsedAbiComponent
) => {
  const tmplData = {
    contract,
    delta: delta.name,
    mappers: delta.types.map((type) => {
      const isChild = type.artifactType != ArtifactType.Document;
      return {
        isChild,
        name: isChild ? type.name : delta.name,
        documentName: `${isChild ? type.name : delta.name}${type.artifactType}`,
        props: type.props.map((prop) => {
          let isArrayType: boolean = false;
          if (prop.type.name.endsWith("[]")) {
            isArrayType = true;
          }

          return {
            ...prop,
            isArrayType,
            defaultValue: getDefault(prop.type.name),
          };
        }),
      };
    }),
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.Deltas.mapperTemplate,
    tmplData
  );
};

const generateContractDeltasMapperContent = (
  contract: string,
  deltas: string[]
) => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.Deltas.contractDeltasMappersTemplate,
    {
      contract,
      deltas,
    }
  );
};

const generateExportsContent = (contractNames: string[] = []) => {
  return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
    exports: contractNames.map(
      (contract) => `./${paramCase(contract)}-delta.mapper`
    ),
  });
};

const createOutput = (
  outputBaseDir: string,
  contract: string,
  deltaMappers: Map<string, string>,
  mappersOutput: string,
  exportsOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  // write to dir e.g. src/contracts/dao-worlds/deltas/data/mappers
  const outDir = path.join(outputBaseDir, "data", "mappers");

  deltaMappers.forEach((content, deltaName) => {
    output.push({
      // write to file e.g. src/contracts/dao-worlds/deltas/data/mappers/candidates.mapper.ts
      filePath: path.join(outDir, `${paramCase(deltaName)}.mapper.ts`),
      content,
    });
  });

  output.push({
    // write to file e.g. src/contracts/dao-worlds/deltas/data/mappers/dao-worlds-delta.mapper.ts
    filePath: path.join(outDir, `${paramCase(contract)}-delta.mapper.ts`),
    content: mappersOutput,
  });

  output.push({
    filePath: path.join(outDir, "index.ts"),
    content: exportsOutput,
  });

  return output;
};

function parseAbiDelta(abi: Abi, table: Table): ParsedAbiComponent {
  const { name: tableName, type } = table;

  let result: ParsedAbiComponent = {
    name: tableName,
    types: [],
  };

  const tableType = abi.structs.find((st) => st.name == type);

  result.types = parseAbiStruct(abi, tableType.name, ArtifactType.Document);

  result.types.forEach((dto) => {
    if (dto.name == pascalCase(tableType.name)) {
      dto.name = pascalCase(tableName);
    }
  });

  return result;
}

function parseAbiStruct(
  abi: Abi,
  structName: string,
  artifactType: ArtifactType
): ParsedType[] {
  let collectiveTypes: Map<string, ParsedType> = new Map();
  let poolOfTypesToGen: {
    typename: string;
    artifactType: ArtifactType;
  }[] = [
    {
      typename: structName,
      artifactType,
    },
  ];

  let parsedType: ParsedType;
  do {
    const typeToGen = poolOfTypesToGen.splice(
      poolOfTypesToGen.length - 1,
      1
    )[0];

    parsedType = parseAbiStructWorker(
      abi,
      typeToGen.typename,
      typeToGen.artifactType
    );
    collectiveTypes.set(typeToGen.typename, parsedType);

    const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);

    if (subTypesToGen.length) {
      poolOfTypesToGen = poolOfTypesToGen.concat(
        subTypesToGen.map((st) => {
          return {
            typename: st.type.sourceName,
            artifactType: [
              ArtifactType.Document,
              ArtifactType.SubDocument,
            ].includes(typeToGen.artifactType)
              ? ArtifactType.SubDocument
              : ArtifactType.SubStruct,
          };
        })
      );
    }
  } while (poolOfTypesToGen.length);

  return Array.from(collectiveTypes.values());
}

function parseAbiStructWorker(
  abi: Abi,
  structName: string,
  artifactType: ArtifactType
): ParsedType {
  const output: ParsedType = {
    artifactType,
    name: pascalCase(structName),
    props: [],
  };

  const struct = abi.structs.find((st) => st.name == structName);
  if (!struct) {
    logger.error(`struct ${structName} not found in ABI`);
    return output;
  }

  struct?.fields?.forEach((field) => {
    const mappedType =
      getMappedType(
        field.type,
        [ArtifactType.Document, ArtifactType.SubDocument].includes(artifactType)
          ? TargetTech.Typescript
          : TargetTech.Mongo
      ) || generateCustomTypeName(field.type, artifactType);

    output.props.push({
      key: field.name,
      type: mappedType,
    });
  });

  return output;
}

function getSubTypesToGen(
  subType: ParsedType,
  availableTypes: Map<string, ParsedType>
) {
  return subType.props
    .filter((prop) => prop.type.requiresCodeGen)
    .filter((prop) => !availableTypes.has(prop.type.sourceName))
    .reverse();
}
