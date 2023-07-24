import { OutputBuilder } from "../../../../core";
import { OutputComponentModel, NewOutputOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class OutputOutputBuilder extends OutputBuilder<
  NewOutputOptions,
  OutputComponentModel
> {
  constructor(type = ComponentType.Output) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.MethodProp)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.Output)
      .registerComponentTemplate(ComponentType.Output);
  }

  public async buildTemplateModels(): Promise<OutputComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.output?.props)) {
      config.source.defaults.output.props.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.defaults?.output?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<OutputComponentModel>(json);
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
          optional: false,
        });
      });
    }

    return [
      {
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
