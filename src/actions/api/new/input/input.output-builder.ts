import { OutputBuilder } from "../../../../core";
import { InputComponentModel, NewInputOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class InputOutputBuilder extends OutputBuilder<
  NewInputOptions,
  InputComponentModel
> {
  constructor(type = ComponentType.Input) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.Input)
      .registerComponentTemplate(ComponentType.Input);
  }

  public async buildTemplateModels(): Promise<InputComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.input?.props)) {
      config.source.defaults.input.props.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.defaults?.input?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<InputComponentModel>(json);
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
        ...this.buildConfigOutput(),
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
        requestBody: [],
        requestParams: [],
        requestQuery: [],
      },
    ];
  }
}
