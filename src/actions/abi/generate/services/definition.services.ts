import { Abi, Table } from "../../types/abi.types";

import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateServicesDefinition = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const deltas: string[] = abi.tables.map((table: Table) => table.name);

  const serviceDefinitionContent = generateServiceDefinitionContent(
    contract,
    deltas
  );
  const exportsContent = generateExportsContent([contract]);

  return createOutput(
    baseDir,
    contract,
    serviceDefinitionContent,
    exportsContent
  );
};

const generateServiceDefinitionContent = (
  contract: string,
  deltas: string[]
) => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.Services.definitionTemplate,
    {
      contract,
      deltas,
    }
  );
};

const generateExportsContent = (contractNames: string[] = []) => {
  return TemplateEngine.GenerateTemplateOutput(Templates.exportsTemplate, {
    exports: contractNames.map(
      (contract) => `./${paramCase(contract)}-contract.service`
    ),
  });
};

const createOutput = (
  outputBaseDir: string,
  contract: string,
  definitionOutput: string,
  exportsOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  output.push({
    // write to file e.g. src/contracts/dao-worlds/services/dao-worlds-contract.service.ts
    filePath: path.join(
      outputBaseDir,
      `${paramCase(contract)}-contract.service.ts`
    ),
    content: definitionOutput,
  });

  output.push({
    filePath: path.join(outputBaseDir, "index.ts"),
    content: exportsOutput,
  });

  return output;
};
