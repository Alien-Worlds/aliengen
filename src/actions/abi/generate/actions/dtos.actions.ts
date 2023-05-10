import { Abi, Action } from "../../types/abi.types";
import { ArtifactType, ParsedAbiType, ParsedAction } from "../generate.types";
import { paramCase, pascalCase } from "change-case";

import { FileTransport } from "../../../../transport/file.transport";
import Logger from "../../../../logger";
import TemplateEngine from "../template-engine";
import { getMappedType } from "../../types/mapping.types";
import path from "path";

const logger = Logger.getLogger();

export const generateActionDtos = (
    abi: Abi,
    contract: string,
    baseDir: string,
    force: boolean,
): void => {
    const dtosTemplateFile = 'dtos.hbs';

    const generatedOutput: Map<string, string> = new Map();

    abi.actions.forEach((action: Action) => {
        const parsedAction = parseAbiAction(abi, action);

        const { name, types } = parsedAction;
        const imports: Map<string, Set<string>> = new Map();

        types.forEach(tp => {
            tp.props.forEach(prop => {
                if (prop.type.requiresImport) {
                    imports.set(prop.type.importRef, (imports.get(prop.type.importRef) || new Set<string>()).add(prop.type.name))
                }
            })
        })

        let tmplOutput: string = TemplateEngine.GenerateTemplateOutput(dtosTemplateFile, {
            actionName: pascalCase(name),
            documents: types.filter(tp => [ArtifactType.Document].includes(tp.artifactType)),
            structs: types.filter(tp => [
                ArtifactType.SubDocument,
                ArtifactType.Struct,
                ArtifactType.SubStruct
            ].includes(tp.artifactType)),
            imports: Object.fromEntries(imports),
        })

        generatedOutput.set(name, tmplOutput);
    })


    // write to file e.g. src/contracts/index-worlds/actions/data/dtos/setstatus.dto.ts
    const dtosDir = path.parse(`${baseDir}/contracts/${paramCase(contract)}/actions/data/dtos`)

    const ft = new FileTransport();
    generatedOutput.forEach((out, name) => {
        const outputPath = path.join(path.format(dtosDir), `${name}.dto.ts`);
        ft.writeOutput(out, { outputPath, overwrite: force })
    })
};

function parseAbiAction(abi: Abi, action: Action): ParsedAction {
    const { name, type } = action;

    let result: ParsedAction = {
        name,
        types: [],
    };

    const actionType = abi.structs.find((st) => (st.name == type));

    result.types = parseAbiStruct(abi, actionType.name, ArtifactType.Document);
    result.types = result.types.concat(parseAbiStruct(abi, actionType.name, ArtifactType.Struct));

    return result;
}

function parseAbiStruct(abi: Abi, structName: string, artifactType: ArtifactType): ParsedAbiType[] {
    let collectiveTypes: Map<string, ParsedAbiType> = new Map();
    let poolOfTypesToGen: string[] = [structName];

    let parsedType: ParsedAbiType;
    do {
        parsedType = parseAbiStructWorker(abi, poolOfTypesToGen[poolOfTypesToGen.length - 1], artifactType);

        collectiveTypes.set(poolOfTypesToGen[poolOfTypesToGen.length - 1], parsedType);
        poolOfTypesToGen = poolOfTypesToGen.slice(0, poolOfTypesToGen.length - 1)

        const subTypesToGen = getSubTypesToGen(parsedType, collectiveTypes);
        if (subTypesToGen.length) {
            poolOfTypesToGen.push(...subTypesToGen.map(st => st.type.sourceName))
        }
    }
    while (poolOfTypesToGen.length);

    return Array.from(collectiveTypes.values());
}

function parseAbiStructWorker(abi: Abi, structName: string, artifactType: ArtifactType): ParsedAbiType {
    let output: ParsedAbiType = {
        artifactType,
        name: generateTypeName(structName, artifactType),
        props: [],
    };

    const struct = abi.structs.find(st => st.name == structName);
    if (!struct) {
        logger.error(`struct ${structName} not found in ABI`)
    }

    struct?.fields.forEach(field => {
        const mappedType = getMappedType(field.type,
            [ArtifactType.Document, ArtifactType.SubDocument].includes(artifactType) ?
                'typescript' :
                'mongo'
        );

        output.props.push({
            key: field.name,
            type: mappedType,
        })
    })

    return output;
}

function getSubTypesToGen(subType: ParsedAbiType, availableTypes: Map<string, ParsedAbiType>) {
    return subType.props.filter(prop => prop.type.requiresCodeGen).filter(prop => !availableTypes.has(prop.type.sourceName)).reverse()
}

function generateTypeName(structName: string, artifiactType: ArtifactType) {
    let output = pascalCase(structName);

    switch (artifiactType) {
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
