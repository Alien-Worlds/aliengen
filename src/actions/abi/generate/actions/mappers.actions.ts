import { Abi, AbiComponent, Action } from "../../types/abi.types";
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

export const generateActionMappers = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const actionMappers: Map<string, string> = new Map();

  abi.actions.forEach((action) => {
    const parsedAction = parseAbiAction(abi, action);

    const actionMapperContent = generateActionMapperContent(
      contract,
      parsedAction
    );

    actionMappers.set(action.name, actionMapperContent);
  });

  const mappersContent = generateContractActionsMapperContent(
    contract,
    Array.from(actionMappers.keys())
  );

  const exportsContent = generateExportsContent([contract]);

  return createOutput(
    baseDir,
    contract,
    actionMappers,
    mappersContent,
    exportsContent
  );
};

const generateActionMapperContent = (
  contract: string,
  action: ParsedComponentMapper
) => {
  const imports: Map<string, Set<string>> = new Map();

  action.typescript.forEach((tp) => {
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

  action.typescript.forEach((e, entityIndex) => {
    e.props = e.props.map((p: any, propIndex) => {
      return {
        ...p,
        mongo: action.mongo[entityIndex].props[propIndex].type,
      };
    });
  });

  const tmplData = {
    contract,
    name: action.name,
    imports: Object.fromEntries(imports),
    entities: action.typescript,
    mongoModels: action.mongo,
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.mapperTemplate,
    tmplData
  );
};

const generateContractActionsMapperContent = (
  contract: string,
  actions: string[]
) => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.Actions.contractActionMappersTemplate,
    {
      contract,
      actions,
    }
  );
};

const generateExportsContent = (contractNames: string[] = []) => {
  return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
    exports: contractNames.map(
      (contract) => `./${paramCase(contract)}-action.mapper`
    ),
  });
};

const createOutput = (
  outputBaseDir: string,
  contract: string,
  actionMappers: Map<string, string>,
  mappersOutput: string,
  exportsOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  // write to dir e.g. src/contracts/dao-worlds/actions/data/mappers
  const outDir = path.join(outputBaseDir, "data", "mappers");

  actionMappers.forEach((content, actionName) => {
    output.push({
      // write to file e.g. src/contracts/dao-worlds/actions/data/mappers/appointcust.mapper.ts
      filePath: path.join(outDir, `${paramCase(actionName)}.mapper.ts`),
      content,
    });
  });

  output.push({
    // write to file e.g. src/contracts/dao-worlds/actions/data/mappers/dao-worlds-action.mapper.ts
    filePath: path.join(outDir, `${paramCase(contract)}-action.mapper.ts`),
    content: mappersOutput,
  });

  output.push({
    filePath: path.join(outDir, "index.ts"),
    content: exportsOutput,
  });

  return output;
};

function parseAbiAction(abi: Abi, action: Action): ParsedComponentMapper {
  const { name, type } = action;

  let result: ParsedComponentMapper = {
    name,
    component: AbiComponent.Action,
  };

  const actionType = abi.structs.find((st) => st.name == type);

  result.mongo = parseAbiStruct(abi, actionType.name, Technology.Mongo);
  result.typescript = parseAbiStruct(
    abi,
    actionType.name,
    Technology.Typescript
  );

  return result;
}

function parseAbiStruct(
  abi: Abi,
  structName: string,
  tech: Technology
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
      name: generateStructName(typeToGen.typename, tech),
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
