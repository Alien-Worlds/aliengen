import { GeneratedOutput } from "../generate.types";
import TemplateEngine from "../template-engine/template-engine";
import Templates from "../templates";
import path from "path";

export const generateExports = (baseDir: string): GeneratedOutput[] => {
  const exportsContent = generateExportsContent();

  return createOutput(baseDir, exportsContent);
};

const generateExportsContent = () => {
  const templateData = {
    exports: [
      "./data/data-sources",
      { exportAs: "Types", path: "./data/dtos" },
      { exportAs: "Mappers", path: "./data/mappers" },
      "./domain/repositories",
      { exportAs: "Entities", path: "./domain/entities" },
      "./domain/enums",
    ],
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.exportsTemplate,
    templateData
  );
};

export const generateRootLevelExports = (
  baseDir: string
): GeneratedOutput[] => {
  const exportsContent = generateRootLevelExportsContent();

  // write to file e.g. src/contracts/token-worlds/index.ts
  return createOutput(baseDir, exportsContent);
};

const generateRootLevelExportsContent = () => {
  const templateData = {
    exports: [
      { exportAs: "Actions", path: "./actions" },
      { exportAs: "Deltas", path: "./deltas" },
      { exportAs: "Services", path: "./services" },
      "./ioc.config",
    ],
  };

  return TemplateEngine.GenerateTemplateOutput(
    Templates.exportsTemplate,
    templateData
  );
};

const createOutput = (
  outputBaseDir: string,
  exportsOutput: string
): GeneratedOutput[] => {
  const output: GeneratedOutput[] = [];

  // write to file e.g. src/contracts/token-worlds/actions/index.ts
  const filePath = path.join(outputBaseDir, "index.ts");

  output.push({
    filePath,
    content: exportsOutput,
  });

  return output;
};
