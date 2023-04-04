import { Abi, Action, Field } from "../types/abi.types";
import { paramCase, pascalCase } from "change-case";

import { FileTransport } from "./transport/file.transport";
import { ParsedAction } from "./generate.types";
import TemplateEngine from "./template-engine";
import { getMappedType } from "../types/mapping.types";
import path from "path";

export const generateContractActions = (
    abi: Abi,
    contract: string,
    baseDir: string,
    force: boolean,
): void => {
    const dtosTemplateFile = 'dtos.hbs';
    const parsedActions: Map<string, ParsedAction> = new Map<string, ParsedAction>();

    const generatedOutput: Map<string, string> = new Map<string, string>();


    abi.actions.forEach((action: Action) => {
        parsedActions.set(action.name, parseAbiAction(abi, action));
    })

    parsedActions.forEach((action: ParsedAction) => {
        const imports: Map<string, Set<string>> = new Map<string, Set<string>>();
        const { props, name } = action;

        props.forEach(prop => {
            const { entityType, structType } = prop;

            if (entityType.requiresImport) {
                imports.set(entityType.importRef, (imports.get(entityType.importRef) || new Set<string>()).add(entityType.name))
            }

            if (structType.requiresImport) {
                imports.set(structType.importRef, (imports.get(structType.importRef) || new Set<string>()).add(structType.name))
            }
        })

        let tmplOutput: string = TemplateEngine.GenerateTemplateOutput(dtosTemplateFile, {
            actionName: pascalCase(name),
            props,
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

    let props = [];

    const typeOfStruct = abi.structs.find((st) => (st.name == type));
    typeOfStruct?.fields.forEach((field: Field) => {
        const structType = getMappedType(field.type, "mongo");
        const entityType = getMappedType(field.type, "typescript");

        props.push({
            key: field.name,
            structType,
            entityType,
        })
    })

    return {
        name,
        props,
    }
}

