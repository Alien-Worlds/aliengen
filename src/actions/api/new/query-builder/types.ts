import { ComponentTemplateModel, Prop } from "../../../../types";

export type NewQueryBuilderOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  type?: string;
  include?: string[];
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type QueryBuilderComponentModel = ComponentTemplateModel & {
  props: Prop[];
  type: string;
};
