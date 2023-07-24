import { pascalCase } from "change-case";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { ServiceOutputBuilder } from "./service.output-builder";
import { ServiceComponentModel } from "./types";
import { Import } from "../../../../types";

export class ServiceFactoryOutputBuilder extends ServiceOutputBuilder {
  constructor(type = ComponentType.ServiceFactory) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.ServiceFactory)
      .registerComponentTemplate(ComponentType.ServiceFactory);
  }

  public async buildTemplateModels(): Promise<ServiceComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options, config } = this;
    const { name } = options;
    const pascalCaseName = pascalCase(name);

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.service_factory?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    for (const model of models) {
      model.imports = [...imports];
      model.imports.push({
        list: [`${pascalCaseName}Service`],
        path: this.fileStructure.generatePath(ComponentType.Service, name).path,
      });
      model.imports.push({
        list: [`${pascalCaseName}ServiceImpl`],
        path: this.fileStructure.generatePath(ComponentType.ServiceImpl, name)
          .path,
      });
    }

    return models;
  }
}
