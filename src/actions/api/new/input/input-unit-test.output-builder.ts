import { InputComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { InputOutputBuilder } from "./input.output-builder";

export class InputUnitTestOutputBuilder extends InputOutputBuilder {
  constructor() {
    super(ComponentType.InputUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.InputUnitTest);
  }

  public async buildTemplateModels(): Promise<InputComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}Input`],
        path: this.fileStructure.generatePath(ComponentType.Input, name).path,
      });
    }

    return models;
  }
}
