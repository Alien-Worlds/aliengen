import { OutputBuilder } from "../../../../core";
import { MapperComponentModel, NewMapperOptions } from "./types";
import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { Import, Prop } from "../../../../types";
import { fetchData } from "../../../../utils/files";
import { pascalCase } from "change-case";
import { getDefaultByType } from "../../../config";

export class MapperOutputBuilder extends OutputBuilder<
  NewMapperOptions,
  MapperComponentModel
> {
  constructor(type = ComponentType.Mapper) {
    super(type);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.JsdocParam)
      .registerPartialTemplate(PartialName.MappingFromEntity)
      .registerPartialTemplate(PartialName.Mapper)
      .registerComponentTemplate(ComponentType.Mapper);
  }

  public async buildTemplateModels(): Promise<MapperComponentModel[]> {
    const { options, config } = this;
    const { name, json, type } = options;
    const pascalCaseName = pascalCase(name);
    /*
     * Props
     */
    const props = new Set<Prop>();

    if (Array.isArray(config.source?.defaults?.mapper?.[type]?.props)) {
      config.source.defaults.mapper[type].props.forEach((p) => props.add(p));
    }

    /*
     * Imports
     */
    const defaultImports =
      config.source?.defaults?.mapper?.[type]?.imports || [];
    const imports = new Set<Import>();

    defaultImports.forEach((i) => imports.add(i));

    imports.add({
      list: [`${pascalCaseName}${pascalCase(type)}`],
      path: this.fileStructure.generatePath(ComponentType.Entity, name).path,
    }).add({
      list: [`${pascalCaseName}${pascalCase(type)}Model`],
      path: this.fileStructure.generatePath(ComponentType.Model, name).path,
    });

    /**
     * Config
     */
    if (json) {
      const config = await fetchData<MapperComponentModel>(json);
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
          default: getDefaultByType(type),
        });
      });
    }

    return [
      {
        ...this.buildConfigOutput(),
        type,
        name: pascalCaseName,
        imports: Array.from(imports),
        props: Array.from(props),
      },
    ];
  }
}
