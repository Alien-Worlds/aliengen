export type Type = {
  new_type_name: string;
  type: string;
  [key: string]: any;
};

export type Field = {
  name: string;
  type: string;
  [key: string]: any;
};

export type Struct = {
  name: string;
  base: string;
  fields: Field[];
  [key: string]: any;
};

export type Action = {
  name: string;
  base: string;
  ricardian_contract: string;
  [key: string]: any;
};

export type Table = {
  name: string;
  index_type: string;
  key_names: string[];
  key_types: string[];
  type: string;
  [key: string]: any;
};

export type Variant = {
  name: string;
  types: string[];
  [key: string]: any;
};

export type Extension = {
  type: string;
  data: string;
  [key: string]: any;
};

export type Abi = {
  version: string;
  types: Type[];
  structs: Struct[];
  actions: Action[];
  tables: Table[];
  ricardian_clauses?: any[];
  error_messages?: any[];
  abi_extensions?: Extension[];
  variants?: Variant[];
  action_results?: any[];
  kv_tables?: any;
  [key: string]: any;
};

export type JsonFile<T = unknown> = {
  path: string;
  content: T;
};

export enum SupportedFormat {
  JSON = 'json',
  HEX = 'hex'
}
