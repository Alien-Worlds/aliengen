import { ComponentTemplateModel, Method, Prop } from "../../../../types";

export type NewRepositoryOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  model?: string;
  database?: string;
  include?: string[];
  methods?: string[];
  skipTests?: boolean;
  impl?: boolean;
  force?: boolean;
  here?: boolean;
};

export type RepositoryComponentModel = ComponentTemplateModel & {
  injectable: boolean;
  requireImpl: boolean;
  database: string;
  model: string;
  methods: Method[];
  props: Prop[];
  entity?: string;
};
