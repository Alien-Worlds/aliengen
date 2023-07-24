import { OutputBuilder } from "../../../../core";
import { NewRepositoryOptions, RepositoryComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Injection, Method, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class RepositoryOutputBuilder extends OutputBuilder<
  NewRepositoryOptions,
  RepositoryComponentModel
> {
  constructor(type = ComponentType.Repository) {
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
      .registerPartialTemplate(PartialName.Repository)
      .registerComponentTemplate(ComponentType.Repository);
  }

  public async buildTemplateModels(): Promise<RepositoryComponentModel[]> {
    const { options, config } = this;
    const { name, json, impl, model, database } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.repository?.props)) {
      config.source.defaults.repository.props.forEach((p) => props.add(p));
    }

    /*
     * Methods
     */
    const methods = new Set<Method>();

    if (Array.isArray(config.source?.defaults?.repository?.methods)) {
      config.source.defaults.repository.methods.forEach((m) => methods.add(m));
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.defaults?.repository?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Entity
     */
    let entity = config.source?.defaults?.repository?.entity;

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<RepositoryComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }

      if (config.props) {
        config.props.forEach((p) => props.add(p));
      }

      if (config.methods) {
        config.methods.forEach((m) => methods.add(m));
      }

      if (config.entity) {
        entity = config.entity;
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
        injectable: true,
        requireImpl: impl,
        model,
        entity,
        database,
        name: pascalCaseName,
        methods: Array.from(methods),
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
