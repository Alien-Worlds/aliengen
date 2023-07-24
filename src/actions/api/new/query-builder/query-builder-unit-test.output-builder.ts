import { QueryBuilderComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { pascalCase } from "change-case";
import { QueryBuilderOutputBuilder } from "./query-builder.output-builder";

export class QueryBuilderUnitTestOutputBuilder extends QueryBuilderOutputBuilder {
  constructor() {
    super(ComponentType.QueryBuilderUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerComponentTemplate(ComponentType.QueryBuilderUnitTest);
  }

  public async buildTemplateModels(): Promise<QueryBuilderComponentModel[]> {
    const models = await super.buildTemplateModels();

    const { options } = this;
    const { name, type } = options;
    const pascalCaseName = pascalCase(name);

    for (const model of models) {
      model.imports.push({
        list: [`${pascalCaseName}${pascalCase(type)}QueryBuilder`],
        path: this.fileStructure.generatePath(ComponentType.QueryBuilder, name)
          .path,
      });
    }

    return models;
  }
}
