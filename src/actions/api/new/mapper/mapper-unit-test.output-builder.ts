import { MapperComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { MapperOutputBuilder } from "./mapper.output-builder";

export class MapperUnitTestOutputBuilder extends MapperOutputBuilder {
  constructor() {
    super(ComponentType.MapperUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerComponentTemplate(ComponentType.MapperUnitTest);
  }

  public async buildTemplateModels(): Promise<MapperComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name, type } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}${pascalCase(type)}Mapper`],
        path: this.fileStructure.generatePath(ComponentType.Mapper, name).path,
      });
    }

    return models;
  }
}
