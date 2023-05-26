import { Abi, Table } from "../../types/abi.types";

import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import { paramCase } from "change-case";
import path from "path";

export const generateServiceImplementation = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const deltasKeys: Map<string, string> = new Map();

  abi.tables.forEach((table: Table) => {
    deltasKeys.set(table.name, getTableKey(abi, table));
  });

  const serviceImplContent = generateServiceImplementationContent(
    contract,
    deltasKeys
  );

  return createOutput(baseDir, contract, serviceImplContent);
};

const getTableKey = (abi: Abi, table: Table): string => {
  const tableStruct = abi.structs.find((st) => st.name == table.type);

  return tableStruct.fields[0].name;
};

const generateServiceImplementationContent = (
  contract: string,
  deltasKeys: Map<string, string>
): string => {
  return TemplateEngine.GenerateTemplateOutput(
    Templates.Services.implementationTemplate,
    {
      contract,
      deltas: Object.fromEntries(deltasKeys),
    }
  );
};

const createOutput = (
  outputBaseDir: string,
  contract: string,
  definitionOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  output.push({
    // write to file e.g. src/contracts/dao-worlds/services/dao-worlds-contract.service.ts
    filePath: path.join(
      outputBaseDir,
      `${paramCase(contract)}-contract.service-impl.ts`
    ),
    content: definitionOutput,
  });

  return output;
};
