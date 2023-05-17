import { Abi, Action } from "../../types/abi.types";

import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionEnums = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const actions: string[] = abi.actions.map((action: Action) => action.name)

    const enumsContent = TemplateEngine.GenerateTemplateOutput(Templates.Actions.enumsTemplate, {
        contract,
        actions,
    });

    return createOutput(contract, enumsContent, baseDir);
};

const createOutput = (contract: string, enumsOutput: string, outputBaseDir: string): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to file e.g. src/contracts/index-worlds/actions/domain/enums.ts
    const outDir = path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/domain/enums.ts`);

    output.push({
        filePath: path.format(outDir),
        content: enumsOutput,
    })

    return output;
};
