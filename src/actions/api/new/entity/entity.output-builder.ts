import { OutputBuilder } from "../../../../core";
import { EntityComponentModel, NewEntityOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";

export class EntityOutputBuilder extends OutputBuilder<
  NewEntityOptions,
  EntityComponentModel
> {
  constructor() {
    super(ComponentType.Entity);
  }

  protected registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.ConstructorProp)
      .registerPartialTemplate(PartialName.MethodProp)
      .registerPartialTemplate(PartialName.Entity)
      .registerComponentTemplate(ComponentType.Entity);
  }

  public async buildTemplateModels(): Promise<EntityComponentModel[]> {
    const { options, config } = this;
    const { name, json } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.props?.entity)) {
      config.source.props.entity.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const defaultImports = config.source?.imports?.entity?.default || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    imports.add({
      list: [`${pascalCaseName}JsonModel`],
      path: this.fileStructure.generatePath(ComponentType.Model, name).path,
    });

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<EntityComponentModel>(json);
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
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
