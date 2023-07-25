import { ControllerComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { ControllerOutputBuilder } from "./controller.output-builder";

export class ControllerUnitTestOutputBuilder extends ControllerOutputBuilder {
  constructor() {
    super(ComponentType.ControllerUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.MockImport)
      .registerComponentTemplate(ComponentType.ControllerUnitTest);
  }

  public async buildTemplateModels(): Promise<ControllerComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}Controller`],
        path: this.fileStructure.generatePath(ComponentType.Controller, name)
          .path,
      });
    }

    return models;
  }
}
