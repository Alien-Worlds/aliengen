import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { DataSourceOutputBuilder } from "./data-source.output-builder";

export class DataSourceUnitTestOutputBuilder extends DataSourceOutputBuilder {
  constructor() {
    super(ComponentType.DataSourceUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.Prop)
      .registerPartialTemplate(PartialName.Arg)
      .registerPartialTemplate(PartialName.Method)
      .registerPartialTemplate(PartialName.MethodProp)
      .registerComponentTemplate(ComponentType.DataSourceUnitTest);
  }
}
