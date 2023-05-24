import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateDeltaMappers = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const mappersContent = generateDeltaMappersContent(contract);
    const exportsContent = generateExportsContent([contract]);

    return createOutput(baseDir, contract, mappersContent, exportsContent);
};

const generateDeltaMappersContent = (contract: string) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.Deltas.mappersTemplate, {
        contract,
    });
}

const generateExportsContent = (contractNames: string[] = []) => {
    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
        exports: contractNames.map(contract => `./${paramCase(contract)}-delta.mapper`),
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    mappersOutput: string,
    exportsOutput: string,
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/deltas/data/mappers
    const outDir = path.join(outputBaseDir, 'data', 'mappers');

    output.push({
        // write to file e.g. src/contracts/dao-worlds/deltas/data/mappers/dao-worlds-action.mapper.ts
        filePath: path.join(outDir, `${paramCase(contract)}-delta.mapper.ts`),
        content: mappersOutput,
    });

    output.push({
        filePath: path.join(outDir, 'index.ts'),
        content: exportsOutput,
    });

    return output;
};
