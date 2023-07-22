import { Import, Prop } from "../../types";

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

export type PropsConfig = {
  model: {
    [type: string]: Prop[];
  };
  mapper: {
    [type: string]: Prop[];
  };
  data_source: {
    [type: string]: Prop[];
  };
  query_builder: {
    [type: string]: Prop[];
  };
  entity: Prop[];
  repository: Prop[];
  service: Prop[];
  controller: Prop[];
  use_case: Prop[];
  input: Prop[];
  output: Prop[];
  utils: Prop[];
  rout: Prop[];
};

export type ImportsConfig = {
  model: {
    [type: string]: Import[];
  };
  mapper: {
    [type: string]: Import[];
  };
  data_source: {
    [type: string]: Import[];
  };
  repository: {
    [type: string]: Import[];
  };
  service: {
    [type: string]: Import[];
  };
  query_builder: {
    [type: string]: Import[];
  };
  controller: {
    [type: string]: Import[];
  };
  use_case: {
    [type: string]: Import[];
  };
  entity: {
    [type: string]: Import[];
  };
  input: {
    [type: string]: Import[];
  };
  output: {
    [type: string]: Import[];
  };
  route: {
    [type: string]: Import[];
  };
  [key: string]: {
    [key: string]: Import[];
  };
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

export type SourceConfig = {
  dirname?: string;
  structure?: FileStructureConfig;
  imports?: ImportsConfig;
  props?: PropsConfig;
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
