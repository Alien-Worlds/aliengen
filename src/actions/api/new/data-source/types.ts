import { ComponentTemplateModel, DefaultOptions, Method } from "../../../../types";

export type NewDataSourceOptions = {
  name: string;
  skipTests?: boolean;
  endpoint?: string;
  type?: string;
  include?: string[];
  json?: string;
  force?: boolean;
  here?: boolean;
  model: string;
  methods?: string[];
};

export type DataSourceComponentModel = ComponentTemplateModel & {
  methods: Method[];
  model: string;
};
