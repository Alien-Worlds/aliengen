import { EntityComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { EntityOutputBuilder } from "./entity.output-builder";

export class EntityUnitTestOutputBuilder extends EntityOutputBuilder {
  constructor() {
    super(ComponentType.EntityUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.EntityUnitTest);
  }

  public async buildTemplateModels(): Promise<EntityComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [pascalCaseName],
        path: this.fileStructure.generatePath(ComponentType.Entity, name).path,
      });
    }

    return models;
  }
}
