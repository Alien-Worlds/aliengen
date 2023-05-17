import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import { actionMappersTemplate } from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateActionMappers = (
    abi: Abi,
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const exportsContent = generateActionMappersContent(contract);

    return createOutput(baseDir, contract, exportsContent);
};

const generateActionMappersContent = (contract: string) => {
    return TemplateEngine.GenerateTemplateOutput(actionMappersTemplate, {
        contract,
    });
}

const createOutput = (
    outputBaseDir: string,
    contract: string,
    exportsOutput: string
): GeneratedOutput[] => {
    const output: GeneratedOutput[] = [];

    // write to dir e.g. src/contracts/dao-worlds/actions/data/mappers
    const outDir = path.parse(`${outputBaseDir}/contracts/${paramCase(contract)}/actions/data/mappers`);

    output.push({
        // write to file e.g. src/contracts/dao-worlds/actions/data/mappers/dao-worlds-action.mapper.ts
        filePath: path.join(path.format(outDir), `${paramCase(contract)}-action.mapper.ts`),
        content: exportsOutput,
    });

    return output;
};
