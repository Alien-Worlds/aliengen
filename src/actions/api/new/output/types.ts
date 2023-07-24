import { ComponentTemplateModel, Prop } from "../../../../types";

export type NewOutputOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  props?: string[];
  include?: string[];
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type OutputComponentModel = ComponentTemplateModel & {
  props: Prop[];
};
