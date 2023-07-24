import { ServiceComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { ServiceFactoryOutputBuilder } from "./service-factory.output-builder";

export class ServiceFactoryUnitTestOutputBuilder extends ServiceFactoryOutputBuilder {
  constructor() {
    super(ComponentType.ServiceFactoryUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.MockImport)
      .registerComponentTemplate(ComponentType.ServiceFactoryUnitTest);
  }

  public async buildTemplateModels(): Promise<ServiceComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}ServiceFactory`],
        path: this.fileStructure.generatePath(
          ComponentType.ServiceFactory,
          name
        ).path,
      });
    }

    return models;
  }
}
