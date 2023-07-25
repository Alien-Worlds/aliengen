import { OutputBuilder } from "../../../../core";
import { NewRouteOptions, RouteComponentModel } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class RouteOutputBuilder extends OutputBuilder<
  NewRouteOptions,
  RouteComponentModel
> {
  constructor(type = ComponentType.Route) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Route)
      .registerComponentTemplate(ComponentType.Route);
  }

  public async buildTemplateModels(): Promise<RouteComponentModel[]> {
    const { options, config } = this;
    const { name, json, type, path } = options;
    const pascalCaseName = pascalCase(name);

    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.route?.[type]?.props)) {
      config.source.defaults.route[type].props.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const imports = new Set<Import>();
    const defaultImports =
      config.source?.defaults?.route?.[type]?.imports || [];

    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<RouteComponentModel>(json);
      if (config.imports) {
        config.imports.forEach((i) => imports.add(i));
      }
    }

    let authorization;
    if (options.auth) {
      authorization = {
        name,
        type: options.auth,
      };
    }

    let validators;
    if (options.validators) {
      validators = {};
      options.validators.forEach((v) => {
        validators[v] = true;
      });
    }

    let hooks;
    if (options.hooks) {
      hooks = {};
      options.hooks.forEach((h) => {
        validators[h] = { name };
      });
    }

    return [
      {
        authorization,
        validators,
        hooks,
        name: pascalCaseName,
        path,
        type,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
