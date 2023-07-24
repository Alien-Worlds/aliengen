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
  route?: ComponentDefaultConfig;
};

export type SourceConfig = {
  dirname?: string;
  structure?: FileStructureConfig;
  defaults?: DefaultsConfig;
};

export type RpcConfig = {
  chainId?: string;
  endpoint?: string;
  [key: string]: unknown;
};

export type Config = {
  source: SourceConfig;
  rpc?: RpcConfig;
  overwrite?: boolean;
  [key: string]: unknown;
};
