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

    // write to file e.g. src/contracts/token-worlds/actions/index.ts
    const filePath = path.join(outputBaseDir, 'index.ts');

    output.push({
        filePath,
        content: exportsOutput,
    });

    return output;
};
