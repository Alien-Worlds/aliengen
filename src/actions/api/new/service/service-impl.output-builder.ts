import { ServiceComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { ServiceOutputBuilder } from "./service.output-builder";
import { pascalCase } from "change-case";

export class ServiceImplOutputBuilder extends ServiceOutputBuilder {
  constructor(type = ComponentType.ServiceImpl) {
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
      .registerPartialTemplate(PartialName.ServiceImpl)
      .registerComponentTemplate(ComponentType.ServiceImpl);
  }

  public async buildTemplateModels(): Promise<ServiceComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports = [
        {
          list: [`${pascalCaseName}Service`],
          path: this.fileStructure.generatePath(ComponentType.Service, name)
            .path,
        },
      ];
    }

    return models;
  }
}
