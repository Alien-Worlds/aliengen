import { AbiComponent } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateRepository = (
    contract: string,
    actionOrDelta: AbiComponent,
    baseDir: string,
): GeneratedOutput[] => {
    const dataSourceContent = TemplateEngine.GenerateTemplateOutput(Templates.repositoryTemplate, {
        contract,
        actionOrDelta,
    });

    const exportsContent = generateExportsContent([contract], actionOrDelta);

    return createOutput(baseDir, contract, actionOrDelta, dataSourceContent, exportsContent);
};

const generateExportsContent = (contractNames: string[] = [], actionOrDelta: AbiComponent) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(contract => `./${paramCase(contract)}-${actionOrDelta}.repository`),
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    actionOrDelta: AbiComponent,
    dataSourceOutput: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/domain/repositories
    const outDir = path.join(outputBaseDir, 'domain', 'repositories');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/domain/repositories/dao-worlds-action.repository.ts
        filePath: path.join(outDir, `${paramCase(contract)}-${actionOrDelta}.repository.ts`),
        content: dataSourceOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};
