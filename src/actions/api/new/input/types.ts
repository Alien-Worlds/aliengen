import { ComponentTemplateModel, Prop } from "../../../../types";

export type NewInputOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  props?: string[];
  include?: string[];
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type InputComponentModel = ComponentTemplateModel & {
  props: Prop[];
  requestBody: Prop[];
  requestParams: Prop[];
  requestQuery: Prop[];
};
