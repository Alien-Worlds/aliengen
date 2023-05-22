import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateIocConfig = (
    contract: string,
    baseDir: string,
    actionOrDelta: string,
): GeneratedOutput[] => {
    const dataSourceContent = TemplateEngine.GenerateTemplateOutput(Templates.iocConfigTemplate, {
        contract,
        actionOrDelta,
    });

    const exportsContent = generateExportsContent([contract], actionOrDelta);

    return createOutput(baseDir, actionOrDelta, contract, dataSourceContent, exportsContent);
};

const generateExportsContent = (contractNames: string[] = [], actionOrDelta: string) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(contract => `./${getIocConfigFilename(contract, actionOrDelta, true)}`)
    });
}

const createOutput = (
    outputBaseDir: string,
    actionOrDelta: string,
    contract: string,
    dataSourceOutput: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/ioc
    const outDir = path.join(outputBaseDir, 'ioc');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/ioc/dao-worlds-action.ioc.config.ts
        filePath: path.join(outDir, `${getIocConfigFilename(contract, actionOrDelta, true, true)}`),
        content: dataSourceOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};

function getIocConfigFilename(
    contract: string,
    actionOrDelta: string,
    includeSuffix: boolean = false,
    includeExtension: boolean = false
): string {
    return `${paramCase(contract)}-${actionOrDelta}${includeSuffix ? '.ioc.config' : ''}${includeExtension ? '.ts' : ''}`;
}
