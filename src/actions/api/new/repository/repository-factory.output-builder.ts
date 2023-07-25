import { pascalCase } from "change-case";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { RepositoryOutputBuilder } from "./repository.output-builder";
import { RepositoryComponentModel } from "./types";
import { Import } from "../../../../types";

export class RepositoryFactoryOutputBuilder extends RepositoryOutputBuilder {
  constructor(type = ComponentType.RepositoryFactory) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.RepositoryFactory)
      .registerComponentTemplate(ComponentType.RepositoryFactory);
  }

  public async buildTemplateModels(): Promise<RepositoryComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options, config } = this;
    const { name, database } = options;
    const pascalCaseName = pascalCase(name);

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.repository_factory?.[database]?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    for (const model of models) {
      model.imports = [...imports];
      model.imports.push({
        list: [`${pascalCaseName}Repository`],
        path: this.fileStructure.generatePath(ComponentType.Repository, name)
          .path,
      });
      if (model.requireImpl) {
        model.imports.push({
          list: [`${pascalCaseName}RepositoryImpl`],
          path: this.fileStructure.generatePath(
            ComponentType.RepositoryImpl,
            name
          ).path,
        });
      }
    }

    return models;
  }
}
