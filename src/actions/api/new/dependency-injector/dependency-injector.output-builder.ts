import { OutputBuilder } from "../../../../core";
import {
  DependencyInjectorComponentModel,
  NewDependencyInjectorOptions,
} from "./types";
import { ComponentType } from "../../../../enums";
import { Import, Prop } from "../../../../types";
import { PartialName } from "../../../../templates";
import { fetchData } from "../../../../utils/files";

export class DependencyInjectorOutputBuilder extends OutputBuilder<
  NewDependencyInjectorOptions,
  DependencyInjectorComponentModel
> {
  constructor(type = ComponentType.DependencyInjector) {
    super(type);
  }

  public async buildTemplateModels(): Promise<
    DependencyInjectorComponentModel[]
  > {
    const { options, config } = this;
    const { name, json } = options;
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.dependency_injector?.props)) {
      config.source.defaults.dependency_injector.props.forEach((p) =>
        props.add(p)
      );
    }

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.dependency_injector?.imports || [];

    const imports = new Set<Import>();
    defaultImports.forEach((i) => imports.add(i));

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<DependencyInjectorComponentModel>(json);
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
        name,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.DependencyInjector)
      .registerComponentTemplate(ComponentType.DependencyInjector);
  }
}
