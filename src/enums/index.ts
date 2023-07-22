export enum ComponentType {
  Controller = "controller",
  DataSource = "data_source",
  Dto = "dto",
  Endpoint = "endpoint",
  Entity = "entity",
  EntityUnitTest = "entity_unit_test",
  Enum = "enum",
  Ioc = "ioc",
  Input = "input",
  Mapper = "mapper",
  Model = "model",
  Output = "output",
  QueryBuilder = "query_builder",
  Repository = "repository",
  RepositoryImpl = "repository_impl",
  Route = "route",
  Schema = "schema",
  Service = "service",
  ServiceImpl = "service_impl",
  UseCase = "use_case",
  Util = "util",
}

export enum WriteMethod {
  Skip = "skip",
  Overwrite = "overwrite",
  Patch = "patch",
}

export enum ModelType {
  Json = "json",
  Mongo = "mongo",
  Redis = "redis",
}
