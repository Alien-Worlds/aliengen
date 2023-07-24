import { OutputBuilder } from "../../../../core";
import { NewDataSourceOptions, DataSourceComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Method, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class DataSourceOutputBuilder extends OutputBuilder<
  NewDataSourceOptions,
  DataSourceComponentModel
> {
  constructor(type = ComponentType.DataSource) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.Method)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.DataSource)
      .registerComponentTemplate(ComponentType.DataSource);
  }

  public async buildTemplateModels(): Promise<DataSourceComponentModel[]> {
    const { options, config } = this;
    const { name, json, model, type } = options;
    const pascalCaseName = pascalCase(name);

    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.data_source?.[type]?.props)) {
      config.source.defaults.data_source[type].props.forEach((p) =>
        props.add(p)
      );
    }

    /*
     * Methods
     */
    const methods = new Set<Method>();

    if (Array.isArray(config.source?.defaults?.data_source?.[type]?.methods)) {
      config.source.defaults.data_source[type].methods.forEach((m) =>
        methods.add(m)
      );
    }

    /*
     * Imports
     */
    const imports = new Set<Import>();
    const defaultImports =
      config.source?.defaults?.data_source?.[type]?.imports || [];

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<DataSourceComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.methods) {
        config.methods.forEach((m) => methods.add(m));
      }
    }

    if (options.methods) {
      options.methods.forEach((name) => {
        methods.add({
          name,
        });
      });
    }

    return [
      {
        name: pascalCaseName,
        model,
        type,
        imports: Array.from(imports),
        methods: Array.from(methods),
        props: Array.from(props),
      },
    ];
  }
}
