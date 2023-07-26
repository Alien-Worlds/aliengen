import { OutputBuilder } from "../../../../core";
import { NewServiceOptions, ServiceComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Injection, Method, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class ServiceOutputBuilder extends OutputBuilder<
  NewServiceOptions,
  ServiceComponentModel
> {
  constructor(type = ComponentType.Service) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.Inject)
      .registerPartialTemplate(PartialName.AbstractMethod)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.Service)
      .registerComponentTemplate(ComponentType.Service);
  }

  public async buildTemplateModels(): Promise<ServiceComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.service?.props)) {
      config.source.defaults.service.props.forEach((p) => props.add(p));
    }

    /*
     * Methods
     */
    const methods = new Set<Method>();

    if (Array.isArray(config.source?.defaults?.service?.methods)) {
      config.source.defaults.service.methods.forEach((m) => methods.add(m));
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.defaults?.service?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<ServiceComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.props) {
        config.props.forEach((p) => props.add(p));
      }

      if (config.methods) {
        config.methods.forEach((m) => methods.add(m));
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
        injectable: true,
        name: pascalCaseName,
        methods: Array.from(methods),
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
