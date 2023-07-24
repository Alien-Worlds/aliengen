import { OutputComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { OutputOutputBuilder } from "./output.output-builder";

export class OutputUnitTestOutputBuilder extends OutputOutputBuilder {
  constructor() {
    super(ComponentType.OutputUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerComponentTemplate(ComponentType.OutputUnitTest);
  }

  public async buildTemplateModels(): Promise<OutputComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}Output`],
        path: this.fileStructure.generatePath(ComponentType.Output, name).path,
      });
    }

    return models;
  }
}
