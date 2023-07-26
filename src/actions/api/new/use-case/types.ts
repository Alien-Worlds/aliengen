import { ComponentTemplateModel, Injection, Prop } from "../../../../types";

export type NewUseCaseOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  include?: string[];
  props?: string[];
  injections?: string[];
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type UseCaseComponentModel = ComponentTemplateModel & {
  injectable: boolean;
  injections: Injection[];
  props: Prop[];
};
