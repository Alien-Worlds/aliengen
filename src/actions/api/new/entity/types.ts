import { ComponentTemplateModel, Prop } from "../../../../types";

export type NewEntityOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  unitTests?: boolean;
  include?: string[];
  props?: string[];
  force?: boolean;
  here?: boolean;
};

export type EntityComponentModel = ComponentTemplateModel & {
  props: Prop[];
};
