import { Abi, Table } from "../../types/abi.types";

import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine/template-engine";
import Templates from "../templates";
import path from "path";

export const generateDeltaEnums = (
  abi: Abi,
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const deltas: string[] = abi.tables.map((table: Table) => table.name);

  const enumsContent = TemplateEngine.GenerateTemplateOutput(
    Templates.Deltas.enumsTemplate,
    {
      contract,
      deltas,
    }
  );

  return createOutput(enumsContent, baseDir);
};

const createOutput = (
  enumsOutput: string,
  outputBaseDir: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  // write to file e.g. src/contracts/index-worlds/deltas/domain/enums.ts
  const filePath = path.join(outputBaseDir, "domain/enums.ts");

  output.push({
    filePath,
    content: enumsOutput,
  });

  return output;
};
