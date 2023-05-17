import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionRepository = (
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const dataSourceContent = TemplateEngine.GenerateTemplateOutput(Templates.Actions.repositoryTemplate, {
        contract,
    });

    const exportsContent = generateExportsContent([contract]);

    return createOutput(baseDir, contract, dataSourceContent, exportsContent);
};

const generateExportsContent = (contractNames: string[] = []) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(contract => `./${paramCase(contract)}-action.repository`),
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    dataSourceOutput: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/domain/repositories
    const outDir = path.join(outputBaseDir, 'domain', 'repositories');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/domain/repositories/dao-worlds-action.repository.ts
        filePath: path.join(outDir, `${paramCase(contract)}-action.repository.ts`),
        content: dataSourceOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};
