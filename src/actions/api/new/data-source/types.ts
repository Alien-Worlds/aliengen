import { ComponentTemplateModel, Method } from "../../../../types";

export type NewDataSourceOptions = {
  name: string;
  type: string;
  model: string;
  endpoint?: string;
  json?: string;
  include?: string[];
  methods?: string[];
  force?: boolean;
  here?: boolean;
};

export type DataSourceComponentModel = ComponentTemplateModel & {
  methods: Method[];
  model: string;
};
