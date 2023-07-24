import { ComponentTemplateModel, Method, Prop } from "../../../../types";

export type NewServiceOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  include?: string[];
  props?: string[];
  methods?: string[];
  skipTests?: boolean;
  force?: boolean;
  here?: boolean;
};

export type ServiceComponentModel = ComponentTemplateModel & {
  injectable: boolean;
  methods: Method[];
  props: Prop[];
};
