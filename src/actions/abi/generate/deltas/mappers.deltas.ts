import { Abi, AbiComponent, Table } from "../../types/abi.types";
import {
  GeneratedOutput,
  ParsedComponentMapper,
  ParsedType,
  ParsedTypeMapper,
  Property,
} from "../generate.types";
import {
  Technology,
  generateCustomTypeName,
  generateStructName,
  getArtifactType,
  getMappedType,
} from "../../types/mapping.types";

import Logger from "../../../../logger";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
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
  delta: ParsedComponentMapper
) => {
  const imports: Map<string, Set<string>> = new Map();

  delta.typescript.forEach((tp) => {
    tp.props.forEach((prop) => {
      if (prop.type.requiresImport) {
        const deps = (imports.get(prop.type.importRef) ?? new Set<string>())
          .add(prop.type.name)
          .add(`${prop.type.name}MongoMapper`)
          .add(`${prop.type.name}RawMapper`);

        imports.set(prop.type.importRef, deps);
      }
    });
  });

  delta.typescript.forEach((e, entityIndex) => {
    e.props = e.props.map((p: any, propIndex) => {
      return {
        ...p,
        mongo: delta.mongo[entityIndex].props[propIndex].type,
      };
    });
  });

  const tmplData = {
    contract,
    name: delta.name,
    imports: Object.fromEntries(imports),
    entities: delta.typescript,
    mongoModels: delta.mongo,
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.mapperTemplate,
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

function parseAbiDelta(abi: Abi, table: Table): ParsedComponentMapper {
  const { name: tableName, type } = table;

  let result: ParsedComponentMapper = {
    name: tableName,
    component: AbiComponent.Action,
  };

  const tableType = abi.structs.find((st) => st.name == type);

  result.mongo = parseAbiStruct(
    abi,
    tableType.name,
    Technology.Mongo,
    tableName
  );
  result.typescript = parseAbiStruct(
    abi,
    tableType.name,
    Technology.Typescript,
    tableName
  );

  return result;
}

function parseAbiStruct(
  abi: Abi,
  structName: string,
  tech: Technology,
  tableName: string
): ParsedTypeMapper[] {
  let result: ParsedTypeMapper[] = [];

  let collectiveTypes: Map<string, ParsedType> = new Map();

  let poolOfTypesToGen: {
    typename: string;
    isParent?: boolean;
  }[] = [
    {
      typename: structName,
      isParent: true,
    },
  ];

  do {
    const typeToGen = poolOfTypesToGen.splice(
      poolOfTypesToGen.length - 1,
      1
    )[0];

    let parsedType: ParsedType = {
      artifactType: getArtifactType(tech),
      name: generateStructName(
        typeToGen.isParent ? tableName : typeToGen.typename,
        tech
      ),
      isParent: typeToGen.isParent,
      props: [],
    };

    parsedType.props = parseAbiStructWorker(abi, typeToGen.typename, tech);
    collectiveTypes.set(typeToGen.typename, parsedType);

    const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);

    if (subTypesToGen.length) {
      poolOfTypesToGen = poolOfTypesToGen.concat(
        subTypesToGen.map((st) => {
          return {
            typename: st.type.sourceName,
            artifactType: parsedType.artifactType,
          };
        })
      );
    }
  } while (poolOfTypesToGen.length);

  result = Array.from(collectiveTypes.values());

  return result;
}

function parseAbiStructWorker(
  abi: Abi,
  structName: string,
  tech: Technology
): Property[] {
  const output: Property[] = [];

  const struct = abi.structs.find((st) => st.name == structName);
  if (!struct) {
    logger.error(`struct ${structName} not found in ABI`);
    return output;
  }

  struct?.fields?.forEach((field) => {
    const mappedType =
      getMappedType(field.type, getArtifactType(tech)) ||
      generateCustomTypeName(field.type, getArtifactType(tech));

    if (!mappedType.defaultValue) {
      mappedType.defaultValue = "undefined";
    }

    output.push({
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
