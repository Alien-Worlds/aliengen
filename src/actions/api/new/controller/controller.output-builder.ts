import { OutputBuilder } from "../../../../core";
import { ControllerComponentModel, NewControllerOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Injection, Method, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class ControllerOutputBuilder extends OutputBuilder<
  NewControllerOptions,
  ControllerComponentModel
> {
  constructor(type = ComponentType.Controller) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.MethodProp)
      .registerPartialTemplate(PartialName.Inject)
      .registerPartialTemplate(PartialName.EndpointMethod)
      .registerPartialTemplate(PartialName.Controller)
      .registerComponentTemplate(ComponentType.Controller);
  }

  public async buildTemplateModels(): Promise<ControllerComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.controller?.props)) {
      config.source.defaults.controller.props.forEach((p) => props.add(p));
    }

    /*
     * Methods
     */
    const methods = new Set<Method>();

    if (Array.isArray(config.source?.defaults?.controller?.methods)) {
      config.source.defaults.controller.methods.forEach((m) => methods.add(m));
    }

    /*
     * Injections
     */
    const injections = new Set<Injection>();

    if (Array.isArray(config.source?.defaults?.controller?.injections)) {
      config.source.defaults.controller.injections.forEach((i) =>
        injections.add(i)
      );
    }

    if (options.inject) {
      options.inject.forEach((name) => {
        injections.add({
          name,
          type: "unknown",
        });
      });
    }

    /*
     * Imports
     */
    const imports = new Set<Import>();
    const defaultImports = config.source?.defaults?.controller?.imports || [];

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<ControllerComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.props) {
        config.props.forEach((p) => props.add(p));
      }

      if (config.methods) {
        config.methods.forEach((m) => methods.add(m));
      }

      if (config.injections) {
        config.injections.forEach((i) => injections.add(i));
      }
    }

    if (options.methods) {
      options.methods.forEach((name) => {
        methods.add({
          name,
          access: "public",
          async: true,
        });
      });
    }

    return [
      {
        ...this.buildConfigOutput(),
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
        methods: Array.from(methods),
        injections: Array.from(injections),
      },
    ];
  }
}
