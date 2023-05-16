import { dataSourceTemplate, exportsTemplate } from "../templates";

import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import { paramCase } from "change-case";
import path from "path";

export const generateActionDataSource = (
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const dataSourceContent = TemplateEngine.GenerateTemplateOutput(dataSourceTemplate, {
        contract,
    });

    const exportsContent = generateExportsContent([contract]);

    return createOutput(baseDir, contract, dataSourceContent, exportsContent);
};

const generateExportsContent = (contractNames: string[] = []) => {
    return TemplateEngine.GenerateTemplateOutput(exportsTemplate, {
        exports: contractNames.map(c => `${paramCase(c)}-action`),
        suffix: '.mongo.source',
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    dataSourceOutput: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/data/data-sources
    const outDir = path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/data/data-sources`);

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/data/data-sources/dao-worlds-action.mongo.source.ts
        filePath: path.join(path.format(outDir), `${paramCase(contract)}-action.mongo.source.ts`),
        content: dataSourceOutput,
    })

    output.push({
        filePath: path.join(path.format(outDir), 'index.ts'),
        content: exportsOutput,
    })

    return output;
};
