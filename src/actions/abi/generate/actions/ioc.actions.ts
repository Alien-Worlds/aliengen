import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionIocConfig = (
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const dataSourceContent = TemplateEngine.GenerateTemplateOutput(Templates.Actions.iocConfigTemplate, {
        contract,
    });

    const exportsContent = generateExportsContent([contract]);

    return createOutput(baseDir, contract, dataSourceContent, exportsContent);
};

const generateExportsContent = (contractNames: string[] = []) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(c => `${getActionIocConfigFilename(c)}`),
        suffix: '.ioc.config',
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    dataSourceOutput: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/ioc
    const outDir = path.join(outputBaseDir, 'ioc');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/ioc/dao-worlds-action.ioc.config.ts
        filePath: path.join(outDir, `${getActionIocConfigFilename(contract, true, true)}`),
        content: dataSourceOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};

function getActionIocConfigFilename(
    contract: string,
    includeSuffix: boolean = false,
    includeExtension: boolean = false
): string {
    return `${paramCase(contract)}-action${includeSuffix ? '.ioc.config' : ''}${includeExtension ? '.ts' : ''}`;
}
