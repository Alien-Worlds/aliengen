import { RepositoryComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { RepositoryFactoryOutputBuilder } from "./repository-factory.output-builder";

export class RepositoryFactoryUnitTestOutputBuilder extends RepositoryFactoryOutputBuilder {
  constructor() {
    super(ComponentType.RepositoryFactoryUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.MockImport)
      .registerComponentTemplate(ComponentType.RepositoryFactoryUnitTest);
  }

  public async buildTemplateModels(): Promise<RepositoryComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}RepositoryFactory`],
        path: this.fileStructure.generatePath(
          ComponentType.RepositoryFactory,
          name
        ).path,
      });
    }

    return models;
  }
}
