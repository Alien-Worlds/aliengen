import { Abi, Action } from "../../types/abi.types";
import { ArtifactType, GeneratedOutput, ParsedAbiType, ParsedAction } from "../generate.types";
import { TargetTech, generateCustomTypeName, getMappedType } from "../../types/mapping.types";
import { dtosTemplate, exportsTemplate } from '../templates';
import { paramCase, pascalCase } from "change-case";

import Logger from "../../../../logger";
import TemplateEngine from "../template-engine";
import path from "path";

const logger = Logger.getLogger();

export const generateActionDtos = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const dtos: Map<string, string> = new Map();

    abi.actions.forEach((action: Action) => {
        const parsedAction = parseAbiAction(abi, action);

        const dtoContent = generateDtoContent(parsedAction);
        dtos.set(action.name, dtoContent);
    })

    const exportsContent = generateExportsContent(dtos);

    return createOutput(contract, dtos, exportsContent, baseDir);
};

const generateDtoContent = (parsedAction: ParsedAction) => {
    const { name: actionName, types } = parsedAction;

    const imports: Map<string, Set<string>> = new Map();

    types.forEach(type => {
        type.props.forEach(prop => {
            if (prop.type.requiresImport) {
                const deps = (imports.get(prop.type.importRef) ?? new Set<string>()).add(prop.type.name);
                imports.set(prop.type.importRef, deps);
            }
        })
    })

    const templateData = {
        actionName: pascalCase(actionName),
        documents: types.filter(tp => tp.artifactType == ArtifactType.Document),
        structs: types.filter(tp => [
            ArtifactType.SubDocument,
            ArtifactType.Struct,
            ArtifactType.SubStruct
        ].includes(tp.artifactType)),
        imports: Object.fromEntries(imports),
    };

    return TemplateEngine.GenerateTemplateOutput(dtosTemplate, templateData);
}

const generateExportsContent = (dtos: Map<string, string>) => {
    return TemplateEngine.GenerateTemplateOutput(exportsTemplate, {
        exports: Array.from(dtos.keys()),
        suffix: '.dto',
    });
}

const createOutput = (contract: string, dtos: Map<string, string>, exportsOutput: string, outputBaseDir: string) => {
    const output: GeneratedOutput[] = [];

    // write to file e.g. src/contracts/index-worlds/actions/data/dtos/setstatus.dto.ts
    const dtosPath = path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/data/dtos`);

    dtos.forEach((content, name) => {
        output.push({
            filePath: path.join(path.format(dtosPath), `${name}.dto.ts`),
            content,
        })
    })

    output.push({
        filePath: path.join(path.format(dtosPath), 'index.ts'),
        content: exportsOutput,
    })

    return output;
}

function parseAbiAction(abi: Abi, action: Action): ParsedAction {
    const { name, type } = action;

    let result: ParsedAction = {
        name,
        types: [],
    };

    const actionType = abi.structs.find((st) => (st.name == type));

    result.types = parseAbiStruct(abi, actionType.name, ArtifactType.Document)
        .concat(parseAbiStruct(abi, actionType.name, ArtifactType.Struct));

    return result;
}

function parseAbiStruct(abi: Abi, structName: string, artifactType: ArtifactType): ParsedAbiType[] {
    let collectiveTypes: Map<string, ParsedAbiType> = new Map();
    let poolOfTypesToGen: {
        typename: string,
        artifactType: ArtifactType,
    }[] = [{
        typename: structName,
        artifactType,
    }];

    let parsedType: ParsedAbiType;
    do {
        const typeToGen = poolOfTypesToGen.splice(poolOfTypesToGen.length - 1, 1)[0];

        parsedType = parseAbiStructWorker(abi, typeToGen.typename, typeToGen.artifactType);
        collectiveTypes.set(typeToGen.typename, parsedType);

        const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);

        if (subTypesToGen.length) {
            poolOfTypesToGen = poolOfTypesToGen.concat(
                subTypesToGen.map(st => {
                    return {
                        typename: st.type.sourceName,
                        artifactType: [ArtifactType.Document, ArtifactType.SubDocument].includes(typeToGen.artifactType) ?
                            ArtifactType.SubDocument :
                            ArtifactType.SubStruct,
                    }
                })
            )
        }
    }
    while (poolOfTypesToGen.length);

    return Array.from(collectiveTypes.values());
}

function parseAbiStructWorker(abi: Abi, structName: string, artifactType: ArtifactType): ParsedAbiType {
    const output: ParsedAbiType = {
        artifactType,
        name: generateTypeName(structName, artifactType),
        props: [],
    };

    const struct = abi.structs.find(st => st.name == structName);
    if (!struct) {
        logger.error(`struct ${structName} not found in ABI`)
        return output;
    }

    struct?.fields?.forEach((field) => {
        const mappedType = getMappedType(
            field.type,
            [ArtifactType.Document, ArtifactType.SubDocument].includes(artifactType)
                ? TargetTech.Typescript
                : TargetTech.Mongo
        ) || generateCustomTypeName(field.type, artifactType);

        output.props.push({
            key: field.name,
            type: mappedType,
        });
    })

    return output;
}

function getSubTypesToGen(subType: ParsedAbiType, availableTypes: Map<string, ParsedAbiType>) {
    return subType.props
        .filter((prop) => prop.type.requiresCodeGen)
        .filter((prop) => !availableTypes.has(prop.type.sourceName))
        .reverse();
}

function generateTypeName(structName: string, artifactType: ArtifactType) {
    let output = pascalCase(structName);

    switch (artifactType) {
        case ArtifactType.Document:
            output += 'Document';
            break;
        case ArtifactType.SubDocument:
            output += 'SubDocument';
            break;
        case ArtifactType.Struct:
            output += 'Struct';
            break;
        case ArtifactType.SubStruct:
            output += 'SubStruct';
            break;
    }

    return output;
}