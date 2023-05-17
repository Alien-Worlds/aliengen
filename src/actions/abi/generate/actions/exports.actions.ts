import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import path from "path";

export const generateActionExports = (
    contract: string,
    baseDir: string,
): GeneratedOutput[] => {
    const exportsContent = generateActionExportsContent();

    return createOutput(baseDir, contract, exportsContent);
};

const generateActionExportsContent = () => {
    const templateData = {
        exports: [
            { exportAs: 'DataSources', path: './data/data-sources' },
            { exportAs: 'Types', path: './data/dtos' },
            { exportAs: 'Mappers', path: './data/mappers' },
            { exportAs: 'Repositories', path: './domain/repositories' },
            { exportAs: 'Entities', path: './domain/entities' },
            { exportAs: 'Ioc', path: './ioc' },
            './domain/enums',
        ],
    }

    return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, templateData);
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
