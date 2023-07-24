import { RepositoryComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { RepositoryOutputBuilder } from "./repository.output-builder";
import { pascalCase } from "change-case";

export class RepositoryImplOutputBuilder extends RepositoryOutputBuilder {
  constructor(type = ComponentType.RepositoryImpl) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.Inject)
      .registerPartialTemplate(PartialName.Method)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.RepositoryImpl)
      .registerComponentTemplate(ComponentType.RepositoryImpl);
  }

  public async buildTemplateModels(): Promise<RepositoryComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    if (options.impl) {
      for (const model of models) {
        model.imports.push({
          list: [`${pascalCaseName}Repository`],
          path: this.fileStructure.generatePath(ComponentType.Repository, name)
            .path,
        });
      }
    }
    return models;
  }
}
