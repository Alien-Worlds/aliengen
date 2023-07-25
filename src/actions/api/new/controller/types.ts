import { ComponentTemplateModel, Injection, Method, Prop } from "../../../../types";

export type NewControllerOptions = {
  name: string;
  endpoint?: string;
  json?: string;
  include?: string[];
  inject?: string[];
  methods?: string[];
  force?: boolean;
  here?: boolean;
};

export type ControllerComponentModel = ComponentTemplateModel & {
  props: Prop[];
  injections: Injection[];
  methods: Method[];
  injectable: boolean;
};
