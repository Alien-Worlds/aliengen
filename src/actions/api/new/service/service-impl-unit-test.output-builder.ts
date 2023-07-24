import { ServiceComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { ServiceImplOutputBuilder } from "./service-impl.output-builder";

export class ServiceImplUnitTestOutputBuilder extends ServiceImplOutputBuilder {
  constructor() {
    super(ComponentType.ServiceImplUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.ServiceImplUnitTest);
  }

  public async buildTemplateModels(): Promise<ServiceComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}ServiceImpl`],
        path: this.fileStructure.generatePath(ComponentType.ServiceImpl, name)
          .path,
      });
    }

    return models;
  }
}
