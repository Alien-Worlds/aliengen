import { Abi, Action } from "../../types/abi.types";
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
import path from "path";

const logger = Logger.getLogger();

export const generateActionDtos = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const dtos: Map<string, string> = new Map();

  abi.actions.forEach((action: Action) => {
    const parsedAction = parseAbiAction(abi, action);

    const dtoContent = generateDtoContent(parsedAction);
    dtos.set(action.name, dtoContent);
  });

  const collectiveTypeContent = generateCollectiveDataType(dtos);

  const exportsContent = generateExportsContent([
    getCollectiveDataTypeFilename(contract),
    ...Array.from(dtos.keys()),
  ]);

  return createOutput(
    contract,
    dtos,
    collectiveTypeContent,
    exportsContent,
    baseDir
  );
};

const generateDtoContent = (parsedAction: ParsedAbiComponent) => {
  const { types } = parsedAction;

  const imports: Map<string, Set<string>> = new Map();

  types.forEach((type) => {
    type.props.forEach((prop) => {
      if (prop.type.requiresImport) {
        const deps = (
          imports.get(prop.type.importRef) ?? new Set<string>()
        ).add(prop.type.name);
        imports.set(prop.type.importRef, deps);
      }
    });
  });

  const templateData = {
    documents: types.filter((tp) => tp.artifactType == ArtifactType.MongoModel),
    structs: types.filter((tp) => tp.artifactType == ArtifactType.Model),
    imports: Object.fromEntries(imports),
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.dtosTemplate,
    templateData
  );
};

const generateCollectiveDataType = (dtos: Map<string, string>) => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.collectiveDataTypeTemplate,
    {
      dtos: Array.from(dtos.keys()),
      suffix: ".dto",
    }
  );
};

const generateExportsContent = (dtoNames: string[]) => {
  return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
    exports: dtoNames.map((dtoName) => `./${dtoName}.dto`),
  });
};

const createOutput = (
  contract: string,
  dtos: Map<string, string>,
  collectiveDtoOutput: string,
  exportsOutput: string,
  outputBaseDir: string
) => {
  const output: GeneratedOutput[] = [];

  // write to file e.g. src/contracts/index-worlds/actions/data/dtos/setstatus.dto.ts
  const dtosPath = path.join(outputBaseDir, "data", "dtos");

  dtos.forEach((content, name) => {
    output.push({
      filePath: path.join(dtosPath, `${name}.dto.ts`),
      content,
    });
  });

  output.push({
    filePath: path.join(
      dtosPath,
      getCollectiveDataTypeFilename(contract, true, true)
    ),
    content: collectiveDtoOutput,
  });

  output.push({
    filePath: path.join(dtosPath, "index.ts"),
    content: exportsOutput,
  });

  return output;
};

function parseAbiAction(abi: Abi, action: Action): ParsedAbiComponent {
  const { name, type } = action;

  let result: ParsedAbiComponent = {
    name,
    types: [],
  };

  const actionType = abi.structs.find((st) => st.name == type);

  result.types = parseAbiStruct(
    abi,
    actionType.name,
    ArtifactType.MongoModel
  ).concat(parseAbiStruct(abi, actionType.name, ArtifactType.Model));

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
            artifactType: typeToGen.artifactType,
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
    name: generateTypeName(structName, artifactType),
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
        artifactType == ArtifactType.MongoModel
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

function generateTypeName(structName: string, artifactType: ArtifactType) {
  return `${pascalCase(structName)}${pascalCase(artifactType)}`;
}

function getCollectiveDataTypeFilename(
  contract: string,
  includeSuffix: boolean = false,
  includeExtension: boolean = false
): string {
  return `${paramCase(contract)}-action${includeSuffix ? ".dto" : ""}${
    includeExtension ? ".ts" : ""
  }`;
}
