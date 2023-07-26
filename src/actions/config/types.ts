import { Import, Injection, Method, Prop } from "../../types";

export type SetConfigOptions = {
  path?: string;
  key?: string;
  value?: unknown;
  global?: boolean;
  default?: boolean;
};

export type GetConfigOptions = {
  key?: string;
  global?: boolean;
};

export type FileStructureConfig = {
  dependency_injector: string;
  endpoint: string;
  ioc: string;
  route: string;
  schemas: string;
  entity: string;
  entity_unit_test: string;
  repository: string;
  service: string;
  model: string;
  query_builder: string;
  query_builder_unit_test: string;
  input: string;
  input_unit_test: string;
  output: string;
  output_unit_test: string;
  controller: string;
  controller_unit_test: string;
  enums: string;
  use_case: string;
  use_case_unit_test: string;
  utils: string;
  utils_unit_test: string;
  data_source: string;
  data_source_unit_test: string;
  repository_impl: string;
  repository_impl_unit_test: string;
  service_impl: string;
  service_impl_unit_test: string;
  mapper: string;
  mapper_unit_test: string;
  [key: string]: string;
};

export type ComponentDefaultConfig = {
  imports?: Import[];
  injections?: Injection[];
  props?: Prop[];
  methods?: Method[];
  [key: string]: unknown;
};

export type RepositoryDefaultConfig = ComponentDefaultConfig & {
  entity?: string;
};

export type DefaultsConfig = {
  data_source?: {
    [database: string]: ComponentDefaultConfig;
  };
  dependency_injector?: ComponentDefaultConfig;
  entity?: ComponentDefaultConfig;
  model?: {
    [database: string]: ComponentDefaultConfig;
  };
  mapper?: {
    [database: string]: ComponentDefaultConfig;
  };
  use_case?: ComponentDefaultConfig;
  repository?: RepositoryDefaultConfig;
  repository_factory?: {
    [database: string]: RepositoryDefaultConfig;
  };
  query_builder?: {
    [type: string]: ComponentDefaultConfig;
  };
  controller?: ComponentDefaultConfig;
  service?: ComponentDefaultConfig;
  service_factory?: ComponentDefaultConfig;
  input?: ComponentDefaultConfig;
  output?: ComponentDefaultConfig;
  route?: {
    [type: string]: ComponentDefaultConfig;
  };
};

export type SourceConfig = {
  dirname?: string;
  skip_tests?: boolean;
  print_jsdocs?: boolean;
  print_markers?: boolean;
  print_examples?: boolean;
  use_ioc?: boolean;
  structure?: FileStructureConfig;
  defaults?: DefaultsConfig;
};

export type Config = {
  headless: boolean;
  source: SourceConfig;
  [key: string]: unknown;
};
