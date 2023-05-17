import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionExports = (
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const exportsContent = generateActionExportsContent();

    return createOutput(baseDir, contract, exportsContent);
};

const generateActionExportsContent = () => {
    return TemplateEngine.GenerateTemplateOutput(Templates.Actions.exportsTemplate, {
        exports,
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    output.push({
        // write to file e.g. src/contracts/token-worlds/actions/index.ts
        filePath: path.format(path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/index.ts`)),
        content: exportsOutput,
    });

    return output;
};
