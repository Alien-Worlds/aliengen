import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionMappers = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const mappersContent = generateActionMappersContent(contract);
    const exportsContent = generateExportsContent([contract]);

    return createOutput(baseDir, contract, mappersContent, exportsContent);
};

const generateActionMappersContent = (contract: string) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.Actions.mappersTemplate, {
        contract,
    });
}

const generateExportsContent = (contractNames: string[] = []) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(contract => `./${paramCase(contract)}-action.mapper`),
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    mappersOutput: string,
    exportsOutput: string,
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/data/mappers
    const outDir = path.join(outputBaseDir, 'data', 'mappers');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/data/mappers/dao-worlds-action.mapper.ts
        filePath: path.join(outDir, `${paramCase(contract)}-action.mapper.ts`),
        content: mappersOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};
