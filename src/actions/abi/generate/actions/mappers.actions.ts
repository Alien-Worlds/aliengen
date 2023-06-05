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
  action: ParsedAbiComponent
) => {
  const tmplData = {
    contract,
    name: action.name,
    mappers: action.types.map((type) => {
      return {
        name: type.isParent ? action.name : type.name,
        documentName: `${type.isParent ? action.name : type.name}${
          type.artifactType
        }`,
        props: type.props.map((prop) => {
          if (!prop.type.defaultValue) {
            prop.type.defaultValue = "undefined";
          }

          return prop;
        }),
      };
    }),
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

function parseAbiAction(abi: Abi, action: Action): ParsedAbiComponent {
  const { name, type } = action;

  let result: ParsedAbiComponent = {
    name,
    types: [],
  };

  const actionType = abi.structs.find((st) => st.name == type);

  result.types = parseAbiStruct(abi, actionType.name, ArtifactType.MongoModel);

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
    isParent?: boolean;
  }[] = [
    {
      typename: structName,
      artifactType,
      isParent: true,
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
            artifactType:
              typeToGen.artifactType == ArtifactType.MongoModel
                ? ArtifactType.MongoModel
                : ArtifactType.Model,
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
