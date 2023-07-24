import { RepositoryComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { RepositoryImplOutputBuilder } from "./repository-impl.output-builder";

export class RepositoryImplUnitTestOutputBuilder extends RepositoryImplOutputBuilder {
  constructor() {
    super(ComponentType.RepositoryImplUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.RepositoryImplUnitTest);
  }

  public async buildTemplateModels(): Promise<RepositoryComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}Repository`],
        path: this.fileStructure.generatePath(ComponentType.Repository, name)
          .path,
      });
    }

    return models;
  }
}
