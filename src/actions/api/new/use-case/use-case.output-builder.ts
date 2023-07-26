import { OutputBuilder } from "../../../../core";
import { NewUseCaseOptions, UseCaseComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Injection, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class UseCaseOutputBuilder extends OutputBuilder<
  NewUseCaseOptions,
  UseCaseComponentModel
> {
  constructor(type = ComponentType.UseCase) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.Inject)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.UseCase)
      .registerComponentTemplate(ComponentType.UseCase);
  }

  public async buildTemplateModels(): Promise<UseCaseComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.use_case?.props)) {
      config.source.defaults.use_case.props.forEach((p) => props.add(p));
    }

    /**
     * Injections
     */
    const injections = new Set<Injection>();

    if (Array.isArray(config.source?.defaults?.use_case?.injections)) {
      config.source.defaults.use_case.injections.forEach((i) =>
        injections.add(i)
      );
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.defaults?.use_case?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<UseCaseComponentModel>(json);
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

    return [
      {
        ...this.buildConfigOutput(),
        injections: Array.from(injections),
        injectable: true,
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
