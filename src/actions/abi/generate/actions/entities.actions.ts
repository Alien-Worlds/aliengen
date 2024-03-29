import { Abi, Action } from "../../types/abi.types";
import {
  ArtifactType,
  GeneratedOutput,
  ParsedAbiComponent,
  ParsedType,
} from "../generate.types";
import { camelCase, paramCase, pascalCase } from "change-case";
import {
  generateCustomTypeName,
  getMappedType,
} from "../../types/mapping.types";

import Logger from "../../../../logger";
import TemplateEngine from "../template-engine/template-engine";
import Templates from "../templates";
import path from "path";

const logger = Logger.getLogger();

export const generateActionEntities = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const entities: Map<string, string> = new Map();

  abi.actions.forEach((action: Action) => {
    const parsedAction = parseAbiAction(abi, action);

    const entityContent = generateEntityContent(parsedAction);

    entities.set(action.name, entityContent);
  });

  const collectiveTypeContent = generateCollectiveEntityType(entities);

  const exportsContent = generateExportsContent([
    getCollectiveDataTypeFilename(contract),
    ...Array.from(entities.keys()),
  ]);

  return createOutput(
    contract,
    entities,
    collectiveTypeContent,
    exportsContent,
    baseDir
  );
};

function parseAbiAction(abi: Abi, action: Action): ParsedAbiComponent {
  const { name, type } = action;

  let result: ParsedAbiComponent = {
    name,
    types: [],
  };

  const actionType = abi.structs.find((st) => st.name == type);

  result.types = parseAbiStruct(abi, actionType.name);

  return result;
}

const generateEntityContent = (parsedAction: ParsedAbiComponent): string => {
  const { name, types } = parsedAction;
  const imports: Map<string, Set<string>> = new Map();

  types.forEach((tp) => {
    tp.props.forEach((prop) => {
      if (prop.type.requiresImport) {
        const deps = (
          imports.get(prop.type.importRef) ?? new Set<string>()
        ).add(prop.type.mappedName);
        imports.set(prop.type.importRef, deps);
      }
    });
  });

  const templateData = {
    name: pascalCase(name),
    documents: types,
    imports: Object.fromEntries(imports),
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.entitiesTemplate,
    templateData
  );
};

const generateCollectiveEntityType = (entities: Map<string, string>) => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.collectiveEntityTemplate,
    {
      entities: Array.from(entities.keys()),
    }
  );
};

const generateExportsContent = (entityNames: string[]) => {
  return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
    exports: entityNames.map((entityName) => `./${entityName}`),
  });
};

const createOutput = (
  contract: string,
  entities: Map<string, string>,
  collectiveEntityOutput: string,
  exportsOutput: string,
  outputBaseDir: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  // write to file e.g. src/contracts/index-worlds/actions/domain/entities/set-status.ts
  const outDir = path.join(outputBaseDir, "domain", "entities");

  entities.forEach((content, name) => {
    output.push({
      filePath: path.join(outDir, `${name}.ts`),
      content,
    });
  });

  output.push({
    filePath: path.join(outDir, getCollectiveDataTypeFilename(contract, true)),
    content: collectiveEntityOutput,
  });

  output.push({
    filePath: path.join(outDir, "index.ts"),
    content: exportsOutput,
  });

  return output;
};

function parseAbiStruct(abi: Abi, structName: string): ParsedType[] {
  let collectiveTypes: Map<string, ParsedType> = new Map();
  let poolOfTypesToGen: string[] = [structName];

  let parsedType: ParsedType;
  do {
    const typeToGen = poolOfTypesToGen.splice(
      poolOfTypesToGen.length - 1,
      1
    )[0];

    parsedType = parseAbiStructWorker(abi, typeToGen);
    collectiveTypes.set(typeToGen, parsedType);

    const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);

    if (subTypesToGen.length) {
      poolOfTypesToGen = poolOfTypesToGen.concat(
        subTypesToGen.map((st) => st.type.sourceName)
      );
    }
  } while (poolOfTypesToGen.length);

  return Array.from(collectiveTypes.values());
}

function parseAbiStructWorker(abi: Abi, structName: string): ParsedType {
  let output: ParsedType = {
    name: pascalCase(structName),
    props: [],
  };

  const struct = abi.structs.find((st) => st.name == structName);
  if (!struct) {
    logger.error(`struct ${structName} not found in ABI`);
    return output;
  }

  struct?.fields?.forEach((field) => {
    output.props.push({
      key: camelCase(field.name),
      type:
        getMappedType(field.type, ArtifactType.Entity) ||
        generateCustomTypeName(field.type),
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

function getCollectiveDataTypeFilename(
  contract: string,
  includeExtension: boolean = false
): string {
  return `${paramCase(contract)}-action${includeExtension ? ".ts" : ""}`;
}
