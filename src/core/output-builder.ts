import { Config } from "../actions/config";
import { ComponentType, WriteMethod } from "../enums";
import { FileStructure } from "./file-structure";
import { TemplateEngine } from "./template-engine";
import {
  ComponentTemplateModel,
  DefaultOptions,
  GeneratedOutput,
  RelativeImport,
} from "../types";
import { existsSync } from "fs";
import { ComponentTemplatePaths } from "../templates";

export abstract class OutputBuilder<
  OptionsType extends DefaultOptions = DefaultOptions,
  TemplateModelType extends ComponentTemplateModel = ComponentTemplateModel
> {
  protected config: Config;
  protected options: OptionsType;
  protected templateEngine: TemplateEngine;
  protected fileStructure: FileStructure;

  constructor(protected type: ComponentType) {}

  protected abstract buildTemplateModels(): Promise<TemplateModelType[]>;
  public abstract registerTemplates(): void;

  protected combineImports(models: TemplateModelType[], relativeTo: string) {
    const imports = new Set<RelativeImport>();
    for (const model of models) {
      for (const i of model.imports) {
        imports.add({ ...i, relativeTo });
      }
    }
    return Array.from(imports);
  }

  public inititalize(
    config: Config,
    options: OptionsType,
    templateEngine: TemplateEngine,
    fileStructure: FileStructure
  ) {
    this.config = config;
    this.options = options;
    this.templateEngine = templateEngine;
    this.fileStructure = fileStructure;
  }

  public async build(): Promise<GeneratedOutput[]> {
    try {
      const { options, type, fileStructure, templateEngine } = this;
      const { name, here, patch, force } = options;
      const outputs: GeneratedOutput[] = [];

      if (fileStructure.has(type)) {
        const { path, marker } = fileStructure.generatePath(type, name, here);
        const fileExists = existsSync(path);
        const models = await this.buildTemplateModels();
        const writeMethod =
          fileExists && patch
            ? WriteMethod.Patch
            : fileExists && !force && !patch
            ? WriteMethod.Skip
            : WriteMethod.Overwrite;

        outputs.push({
          name,
          type,
          content: templateEngine.generateOutput(
            ComponentTemplatePaths.getPath(type),
            {
              imports: this.combineImports(models, path),
              models,
              path,
            },
            writeMethod,
            path,
            marker
          ),
          path,
          overwrite: writeMethod !== WriteMethod.Skip,
        });
      } else {
        console.warn(
          `> The path pattern for the component "${type}" was not found.`
        );
      }
      return outputs;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
