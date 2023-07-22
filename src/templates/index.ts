import path from "path";
import { ComponentType } from "../enums";

export enum PartialName {
  Arg = "arg",
  ConstructorProp = "constructor_prop",
  MethodProp = "method_prop",
  JsdocParam = "jsdoc_param",
  Imports = "imports",
  Import = "import",
  Model = "model",
  Entity = "entity",
  UnitTest = "unit_test",
  UnitTestGroup = "unit_test_group",
  Prop = "prop",
}

export class PartialTemplatePaths {
  private static paths = new Map<string, string>([
    [
      PartialName.UnitTest,
      path.join(__dirname, "common", "unit_test.partial.hbs"),
    ],
    [
      PartialName.UnitTestGroup,
      path.join(__dirname, "common", "unit_test_group.partial.hbs"),
    ],
    [
      PartialName.Imports,
      path.join(__dirname, "imports", "imports.partial.hbs"),
    ],
    [PartialName.Import, path.join(__dirname, "imports", "import.partial.hbs")],
    [PartialName.Model, path.join(__dirname, "model", "model.partial.hbs")],
    [PartialName.Entity, path.join(__dirname, "entity", "entity.partial.hbs")],
    [PartialName.Arg, path.join(__dirname, "common", "arg.partial.hbs")],
    [
      PartialName.ConstructorProp,
      path.join(__dirname, "common", "constructor_prop.partial.hbs"),
    ],
    [
      PartialName.JsdocParam,
      path.join(__dirname, "common", "jsdoc_param.partial.hbs"),
    ],
    [
      PartialName.MethodProp,
      path.join(__dirname, "common", "method_prop.partial.hbs"),
    ],
    [PartialName.Prop, path.join(__dirname, "common", "prop.partial.hbs")],
  ]);

  public static getPath(label: PartialName): string {
    return this.paths.get(label) || "";
  }
}

export class ComponentTemplatePaths {
  private static paths = new Map<string, string>([
    [ComponentType.Model, path.join(__dirname, "model", "model.hbs")],
    [ComponentType.Entity, path.join(__dirname, "entity", "entity.hbs")],
    [
      ComponentType.EntityUnitTest,
      path.join(__dirname, "entity", "entity_unit_test.hbs"),
    ],
    [
      ComponentType.Controller,
      path.join(__dirname, "controller", "controller.hbs"),
    ],
    [
      ComponentType.DataSource,
      path.join(__dirname, "data-source", "data-source.hbs"),
    ],
    [ComponentType.Enum, path.join(__dirname, "enum", "enum.hbs")],
    [ComponentType.Input, path.join(__dirname, "input", "input.hbs")],
    [ComponentType.Ioc, path.join(__dirname, "ioc", "ioc.hbs")],
    [ComponentType.Mapper, path.join(__dirname, "mapper", "mapper.hbs")],
    [ComponentType.Output, path.join(__dirname, "output", "output.hbs")],
    [
      ComponentType.QueryBuilder,
      path.join(__dirname, "query-builder", "query-builder.hbs"),
    ],
    [
      ComponentType.Repository,
      path.join(__dirname, "repository", "repository.hbs"),
    ],
    [
      ComponentType.RepositoryImpl,
      path.join(__dirname, "repository", "repository-impl.hbs"),
    ],
    [ComponentType.Route, path.join(__dirname, "route", "route.hbs")],
    [ComponentType.Schema, path.join(__dirname, "schema", "schema.hbs")],
    [ComponentType.Service, path.join(__dirname, "service", "service.hbs")],
    [
      ComponentType.ServiceImpl,
      path.join(__dirname, "service", "service-impl.hbs"),
    ],
    [ComponentType.UseCase, path.join(__dirname, "use-case", "use-case.hbs")],
    [ComponentType.Util, path.join(__dirname, "util", "util.hbs")],
  ]);

  public static getPath(label: ComponentType): string {
    return this.paths.get(label) || "";
  }
}
