import { Abi, Action } from "../../types/abi.types";
import { GeneratedOutput, ParsedAbiType, ParsedAction } from "../generate.types";
import { TargetTech, generateCustomTypeName, getMappedType } from "../../types/mapping.types";
import { camelCase, paramCase, pascalCase } from "change-case";
import { entityTemplate, exportsTemplate } from '../templates';

import Logger from "../../../../logger";
import TemplateEngine from "../template-engine";
import path from "path";

const logger = Logger.getLogger();

export const generateActionEntities = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const entities: Map<string, string> = new Map();

    abi.actions.forEach((action: Action) => {
        const parsedAction = parseAbiAction(abi, action);

        const entityContent = generateEntityContent(parsedAction);

        entities.set(action.name, entityContent);
    })

    const exportsContent = generateExportsContent(entities);

    return createOutput(contract, entities, exportsContent, baseDir);
};

function parseAbiAction(abi: Abi, action: Action): ParsedAction {
    const { name, type } = action;

    let result: ParsedAction = {
        name,
        types: [],
    };

    const actionType = abi.structs.find((st) => (st.name == type));

    result.types = parseAbiStruct(abi, actionType.name);

    return result;
}

const generateEntityContent = (parsedAction: ParsedAction): string => {
    const { name, types } = parsedAction;
    const imports: Map<string, Set<string>> = new Map();

    types.forEach(tp => {
        tp.props.forEach(prop => {
            if (prop.type.requiresImport) {
                const deps = (imports.get(prop.type.importRef) ?? new Set<string>()).add(prop.type.name);
                imports.set(prop.type.importRef, deps);
            }
        })
    })

    const templateData = {
        name: pascalCase(name),
        documents: types,
        imports: Object.fromEntries(imports),
    };

    return TemplateEngine.GenerateTemplateOutput(entityTemplate, templateData);
}

const generateExportsContent = (files: Map<string, string>) => {
    return TemplateEngine.GenerateTemplateOutput(exportsTemplate, {
        exports: Array.from(files.keys()),
    });
}

const createOutput = (contract: string, entities: Map<string, string>, exportsOutput: string, outputBaseDir: string): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to file e.g. src/contracts/index-worlds/actions/domain/entities/set-status.ts
    const outDir = path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/domain/entities`)

    entities.forEach((content, name) => {
        output.push({
            filePath: path.join(path.format(outDir), `${name}.ts`),
            content,
        })
    })

    output.push({
        filePath: path.join(path.format(outDir), 'index.ts'),
        content: exportsOutput,
    })

    return output;
}



function parseAbiStruct(abi: Abi, structName: string): ParsedAbiType[] {
    let collectiveTypes: Map<string, ParsedAbiType> = new Map();
    let poolOfTypesToGen: string[] = [structName];

    let parsedType: ParsedAbiType;
    do {
        const typeToGen = poolOfTypesToGen.splice(poolOfTypesToGen.length - 1, 1)[0];

        parsedType = parseAbiStructWorker(abi, typeToGen);
        collectiveTypes.set(typeToGen, parsedType);

        const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);

        if (subTypesToGen.length) {
            poolOfTypesToGen = poolOfTypesToGen.concat(subTypesToGen.map(st => st.type.sourceName))
        }
    }
    while (poolOfTypesToGen.length);

    return Array.from(collectiveTypes.values());
}

function parseAbiStructWorker(abi: Abi, structName: string): ParsedAbiType {
    let output: ParsedAbiType = {
        name: pascalCase(structName),
        props: [],
    };

    const struct = abi.structs.find(st => st.name == structName);
    if (!struct) {
        logger.error(`struct ${structName} not found in ABI`);
        return output;
    }

    struct?.fields?.forEach(field => {
        output.props.push({
            key: camelCase(field.name),
            type: getMappedType(field.type, TargetTech.Typescript) || generateCustomTypeName(field.type),
        })
    })

    return output;
}

function getSubTypesToGen(subType: ParsedAbiType, availableTypes: Map<string, ParsedAbiType>) {
    return subType.props
        .filter((prop) => prop.type.requiresCodeGen)
        .filter((prop) => !availableTypes.has(prop.type.sourceName))
        .reverse();
}
