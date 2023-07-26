import { OutputBuilder } from "../../../../core";
import { QueryBuilderComponentModel, NewQueryBuilderOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class QueryBuilderOutputBuilder extends OutputBuilder<
  NewQueryBuilderOptions,
  QueryBuilderComponentModel
> {
  constructor(type = ComponentType.QueryBuilder) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.QueryBuilder)
      .registerComponentTemplate(ComponentType.QueryBuilder);
  }

  public async buildTemplateModels(): Promise<QueryBuilderComponentModel[]> {
    const { options, config } = this;
    const { name, json, type } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.query_builder?.[type]?.props)) {
      config.source.defaults.query_builder[type].props.forEach((p) =>
        props.add(p)
      );
    }

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.query_builder?.[type]?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<QueryBuilderComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.props) {
        config.props.forEach((p) => props.add(p));
      }
    }

    return [
      {
        ...this.buildConfigOutput(),
        name: pascalCaseName,
        imports: Array.from(imports),
        type,
        props: Array.from(props),
      },
    ];
  }
}
