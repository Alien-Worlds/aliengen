import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine";
import Templates from "../templates";
import path from "path";

export const generateIocConfig = (
  contract: string,
  baseDir: string
): GeneratedOutput[] => {
  const dataSourceContent = TemplateEngine.GenerateTemplateOutput(
    Templates.iocConfigTemplate,
    {
      contract,
    }
  );

  return createOutput(baseDir, dataSourceContent);
};

const createOutput = (
  outputBaseDir: string,
  dataSourceOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  output.push({
    // write to file e.g. src/contracts/dao-worlds/ioc.config.ts
    filePath: path.join(outputBaseDir, `${getIocConfigFilename(true)}`),
    content: dataSourceOutput,
  });

  return output;
};

function getIocConfigFilename(includeExtension: boolean = false): string {
  return `ioc.config${includeExtension ? ".ts" : ""}`;
}
