import { ComponentTemplateModel } from "../../../../types";

export type NewDependencyInjectorOptions = {
  name: string;
  endpoint?: string;
  root?: boolean;
  json?: string;
  force?: boolean;
  here?: boolean;
};

export type DependencyInjectorComponentModel = ComponentTemplateModel;
