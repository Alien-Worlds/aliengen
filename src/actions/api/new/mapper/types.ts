import { ComponentTemplateModel, DefaultOptions, Prop } from "../../../../types";

export type NewMapperOptions = {
  name: string;
  type: string;
  endpoint?: string;
  json?: string;
  include?: string[];
  props?: string[];
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type MapperComponentModel = ComponentTemplateModel & {
  props: Prop[];
};
