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

export const typesMap = new Map<string, object>([
  ["bytes", { typeScript: ["Bytes"], mongo: ["Binary"] }],
  ["bool", { typeScript: ["boolean"], mongo: ["boolean"] }],
  ["asset", { typeScript: ["Asset"], mongo: ["object"] }],
  ["symbol", { typeScript: ["Symbol"], mongo: ["object"] }],
  ["extension", { typeScript: ["Extension"], mongo: ["object"] }],
  ["name", { typeScript: ["string"], mongo: ["string"] }],
  ["int8", { typeScript: ["number"], mongo: ["number"] }],
  ["int16", { typeScript: ["number"], mongo: ["number"] }],
  ["int32", { typeScript: ["number"], mongo: ["number"] }],
  ["int64", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["int128", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["int256", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["int8_t", { typeScript: ["number"], mongo: ["number"] }],
  ["int16_t", { typeScript: ["number"], mongo: ["number"] }],
  ["int32_t", { typeScript: ["number"], mongo: ["number"] }],
  ["int64_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["int128_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["int256_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint8", { typeScript: ["number"], mongo: ["number"] }],
  ["uint16", { typeScript: ["number"], mongo: ["number"] }],
  ["uint32", { typeScript: ["number"], mongo: ["number"] }],
  ["uint64", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint128", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint256", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint8_t", { typeScript: ["number"], mongo: ["number"] }],
  ["uint16_t", { typeScript: ["number"], mongo: ["number"] }],
  ["uint32_t", { typeScript: ["number"], mongo: ["number"] }],
  ["uint64_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint128_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["uint256_t", { typeScript: ["bigint"], mongo: ["Long"] }],
  ["checksum160", { typeScript: ["string"], mongo: ["string"] }],
  ["checksum256", { typeScript: ["string"], mongo: ["string"] }],
  ["checksum512", { typeScript: ["string"], mongo: ["string"] }],
  ["variant", { typeScript: ["Array<unknown>"], mongo: ["Array<unknown>"] }],
]);

export enum SupportedFormat {
  JSON = 'json',
  HEX = 'hex'
}