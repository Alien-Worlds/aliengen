import { ComponentTemplateModel, Prop } from "../../../../types";

export type NewModelOptions = {
  name: string;
  endpoint?: string;
  type?: string[];
  json?: string;
  props?: string[];
  force?: boolean;
  here?: boolean;
};

export type ModelComponentModel = ComponentTemplateModel & {
  props: Prop[];
};
