import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { RouteOutputBuilder } from "./route.output-builder";

export class RouteUnitTestOutputBuilder extends RouteOutputBuilder {
  constructor() {
    super(ComponentType.RouteUnitTest);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.MockImport)
      .registerComponentTemplate(ComponentType.DataSourceUnitTest);
  }
}
