import { OutputBuilder } from "../../../../core";
import { ModelComponentModel, NewModelOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { Import, Prop } from "../../../../types";
import { PartialName } from "../../../../templates";
import { fetchData } from "../../../../utils/files";

export class ModelOutputBuilder extends OutputBuilder<
  NewModelOptions,
  ModelComponentModel
> {
  constructor() {
    super(ComponentType.Model);
  }

  protected async buildModelDataByType(type: string) {
    const { options, config } = this;
    const { name, json } = options;
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.model?.[type]?.props)) {
      config.source.defaults.model[type].props.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.model?.[type]?.imports || [];

    const imports = new Set<Import>();
    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<ModelComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.props) {
        config.props.forEach((p) => props.add(p));
      }
    }

    if (options.props) {
      options.props.forEach((prop) => {
        const [name, type] = prop.split(":");

        props.add({
          name,
          type,
          optional: true,
        });
      });
    }

    return {
      name,
      type,
      imports: Array.from(imports),
      props: Array.from(props),
    };
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.Model)
      .registerComponentTemplate(ComponentType.Model);
  }

  public async buildTemplateModels(): Promise<ModelComponentModel[]> {
    const { options } = this;
    const list = [];
    const types = options.type || ["json"];

    types.forEach(async (type) => {
      const data = await this.buildModelDataByType(type);
      list.push(data);
    });

    return list;
  }
}
