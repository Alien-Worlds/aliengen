import { ComponentType } from "../enums";

export type TemplateModel<ComponentModelType extends ComponentTemplateModel> = {
  models: ComponentModelType[];
  imports: RelativeImport[];
  path: string;
  [key: string]: unknown;
};

export type ComponentTemplateModel = {
  imports: Import[];
  name: string;
  type?: string;
  [key: string]: unknown;
};

export type JsonFile<T = unknown> = {
  path: string;
  content: T;
};

export type Prop = {
  name: string;
  type: string;
  default?: unknown;
  access?: string;
  import?: string;
  factory?: string;
  optional?: boolean;
};

export type Injection = {
  name: string;
  access?: string;
  import?: string;
};

export type Method = {
  name: string;
  access?: string;
  returns?: string;
  async?: boolean;
  static?: boolean;
  props?: Prop[];
};

export type Import = {
  path: string;
  alias?: string;
  list?: string[];
  default?: string;
};

export type RelativeImport = Import & {
  relativeTo: string;
};

export type DefaultOptions = {
  name: string;
  unitTests?: boolean;
  endpoint?: string;
  database?: string;
  include?: string[];
  json?: string;
  force?: boolean;
  here?: boolean;
  [key: string]: unknown;
};

export type GeneratedPath = { path: string; marker: string };

export type GeneratedOutput = {
  name: string;
  type: ComponentType | string;
  content: string;
  path: string;
  overwrite?: boolean;
};
