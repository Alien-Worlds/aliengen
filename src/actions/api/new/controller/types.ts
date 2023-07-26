import { ComponentTemplateModel, Injection, Method, Prop } from "../../../../types";

export type NewControllerOptions = {
  name: string;
  skipTests?: boolean;
  endpoint?: string;
  include?: string[];
  inject?: string[];
  json?: string;
  force?: boolean;
  here?: boolean;
  methods?: string[];
};

export type ControllerComponentModel = ComponentTemplateModel & {
  props: Prop[];
  injections: Injection[];
  methods: Method[];
};
