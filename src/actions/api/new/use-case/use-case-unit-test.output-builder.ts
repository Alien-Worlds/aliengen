import { UseCaseComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { UseCaseOutputBuilder } from "./use-case.output-builder";

export class UseCaseUnitTestOutputBuilder extends UseCaseOutputBuilder {
  constructor() {
    super(ComponentType.UseCaseUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.UseCaseUnitTest);
  }

  public async buildTemplateModels(): Promise<UseCaseComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}UseCase`],
        path: this.fileStructure.generatePath(ComponentType.UseCase, name).path,
      });
      model.injectable = false;
    }

    return models;
  }
}
