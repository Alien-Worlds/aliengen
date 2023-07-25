import path from "path";
import { ComponentType } from "../enums";

export enum PartialName {
  Arg = "arg",
  MockImport = "mock_import",
  ConstructorProp = "constructor_prop",
  Inject = "inject",
  MethodProp = "method_prop",
  AbstractMethod = "abstract_method",
  Method = "method",
  JsdocParam = "jsdoc_param",
  Imports = "imports",
  Import = "import",
  Model = "model",
  Input = "input",
  Output = "output",
  QueryBuilder = "query_builder",
  Entity = "entity",
  UseCase = "use_case",
  Controller = "controller",
  EndpointMethod = "endpoint_method",
  Repository = "repository",
  RepositoryImpl = "repository_impl",
  RepositoryFactory = "repository_factory",
  Service = "service",
  ServiceImpl = "service_impl",
  ServiceFactory = "service_factory",
  DataSource = "data_source",
  UnitTest = "unit_test",
  UnitTestGroup = "unit_test_group",
  Prop = "prop",
  Route = "route",
  RouteValidators = "route_validators",
  RouteHooks = "route_hooks",
  RouteAuth = "route_auth",
}

export class PartialTemplatePaths {
  private static paths = new Map<string, string>([
    [
      PartialName.MockImport,
      path.join(__dirname, "common", "mock_import.partial.hbs"),
    ],
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
      path.join(__dirname, "common", "imports.partial.hbs"),
    ],
    [PartialName.Import, path.join(__dirname, "common", "import.partial.hbs")],
    [PartialName.Model, path.join(__dirname, "model", "model.partial.hbs")],
    [PartialName.Input, path.join(__dirname, "input", "input.partial.hbs")],
    [PartialName.Output, path.join(__dirname, "output", "output.partial.hbs")],
    [PartialName.Entity, path.join(__dirname, "entity", "entity.partial.hbs")],
    [
      PartialName.QueryBuilder,
      path.join(__dirname, "query-builder", "query_builder.partial.hbs"),
    ],
    [
      PartialName.Repository,
      path.join(__dirname, "repository", "repository.partial.hbs"),
    ],
    [
      PartialName.RepositoryImpl,
      path.join(__dirname, "repository", "repository_impl.partial.hbs"),
    ],
    [
      PartialName.RepositoryFactory,
      path.join(__dirname, "repository", "repository_factory.partial.hbs"),
    ],
    [
      PartialName.Service,
      path.join(__dirname, "service", "service.partial.hbs"),
    ],
    [
      PartialName.ServiceImpl,
      path.join(__dirname, "service", "service_impl.partial.hbs"),
    ],
    [
      PartialName.ServiceFactory,
      path.join(__dirname, "service", "service_factory.partial.hbs"),
    ],
    [
      PartialName.DataSource,
      path.join(__dirname, "data-source", "data_source.partial.hbs"),
    ],
    [
      PartialName.UseCase,
      path.join(__dirname, "use-case", "use_case.partial.hbs"),
    ],
    [
      PartialName.Controller,
      path.join(__dirname, "controller", "controller.partial.hbs"),
    ],
    [
      PartialName.EndpointMethod,
      path.join(__dirname, "controller", "endpoint_method.partial.hbs"),
    ],
    [PartialName.Arg, path.join(__dirname, "common", "arg.partial.hbs")],
    [
      PartialName.ConstructorProp,
      path.join(__dirname, "common", "constructor_prop.partial.hbs"),
    ],
    [PartialName.Inject, path.join(__dirname, "common", "inject.partial.hbs")],
    [
      PartialName.JsdocParam,
      path.join(__dirname, "common", "jsdoc_param.partial.hbs"),
    ],
    [
      PartialName.MethodProp,
      path.join(__dirname, "common", "method_prop.partial.hbs"),
    ],
    [PartialName.Method, path.join(__dirname, "common", "method.partial.hbs")],
    [
      PartialName.AbstractMethod,
      path.join(__dirname, "common", "abstract_method.partial.hbs"),
    ],
    [PartialName.Prop, path.join(__dirname, "common", "prop.partial.hbs")],
    [PartialName.Route, path.join(__dirname, "route", "route.partial.hbs")],
    [
      PartialName.RouteValidators,
      path.join(__dirname, "route", "route_validators.partial.hbs"),
    ],
    [
      PartialName.RouteHooks,
      path.join(__dirname, "route", "route_hooks.partial.hbs"),
    ],
    [
      PartialName.RouteAuth,
      path.join(__dirname, "route", "route_auth.partial.hbs"),
    ],
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
      ComponentType.ControllerUnitTest,
      path.join(__dirname, "controller", "controller_unit_test.hbs"),
    ],
    [
      ComponentType.DataSource,
      path.join(__dirname, "data-source", "data_source.hbs"),
    ],
    [
      ComponentType.DataSourceUnitTest,
      path.join(__dirname, "data-source", "data_source_unit_test.hbs"),
    ],
    [ComponentType.Enum, path.join(__dirname, "enum", "enum.hbs")],
    [ComponentType.Input, path.join(__dirname, "input", "input.hbs")],
    [
      ComponentType.InputUnitTest,
      path.join(__dirname, "input", "input_unit_test.hbs"),
    ],
    [ComponentType.Ioc, path.join(__dirname, "ioc", "ioc.hbs")],
    [ComponentType.Mapper, path.join(__dirname, "mapper", "mapper.hbs")],
    [ComponentType.Output, path.join(__dirname, "output", "output.hbs")],
    [
      ComponentType.OutputUnitTest,
      path.join(__dirname, "output", "output_unit_test.hbs"),
    ],
    [
      ComponentType.QueryBuilder,
      path.join(__dirname, "query-builder", "query_builder.hbs"),
    ],
    [
      ComponentType.QueryBuilderUnitTest,
      path.join(__dirname, "query-builder", "query_builder_unit_test.hbs"),
    ],
    [
      ComponentType.Repository,
      path.join(__dirname, "repository", "repository.hbs"),
    ],
    [
      ComponentType.RepositoryImpl,
      path.join(__dirname, "repository", "repository_impl.hbs"),
    ],
    [
      ComponentType.RepositoryImplUnitTest,
      path.join(__dirname, "repository", "repository_impl_unit_test.hbs"),
    ],
    [
      ComponentType.RepositoryFactory,
      path.join(__dirname, "repository", "repository_factory.hbs"),
    ],
    [
      ComponentType.RepositoryFactoryUnitTest,
      path.join(__dirname, "repository", "repository_factory_unit_test.hbs"),
    ],
    [ComponentType.Route, path.join(__dirname, "route", "route.hbs")],
    [ComponentType.Schema, path.join(__dirname, "schema", "schema.hbs")],
    [ComponentType.Service, path.join(__dirname, "service", "service.hbs")],
    [
      ComponentType.ServiceImpl,
      path.join(__dirname, "service", "service_impl.hbs"),
    ],
    [
      ComponentType.ServiceImplUnitTest,
      path.join(__dirname, "service", "service_impl_unit_test.hbs"),
    ],
    [
      ComponentType.ServiceFactory,
      path.join(__dirname, "service", "service_factory.hbs"),
    ],
    [
      ComponentType.ServiceFactoryUnitTest,
      path.join(__dirname, "service", "service_factory_unit_test.hbs"),
    ],
    [ComponentType.UseCase, path.join(__dirname, "use-case", "use_case.hbs")],
    [
      ComponentType.UseCaseUnitTest,
      path.join(__dirname, "use-case", "use_case_unit_test.hbs"),
    ],
    [ComponentType.Route, path.join(__dirname, "route", "route.hbs")],
    [ComponentType.RouteUnitTest, path.join(__dirname, "route", "route_unit_test.hbs")],
    [ComponentType.Util, path.join(__dirname, "util", "util.hbs")],
  ]);

  public static getPath(label: ComponentType): string {
    return this.paths.get(label) || "";
  }
}
