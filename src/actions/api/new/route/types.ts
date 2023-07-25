import { ComponentTemplateModel, Method } from "../../../../types";

export type NewRouteOptions = {
  name: string;
  type: string;
  path: string;
  include: string[];
  endpoint?: string;
  hooks?: string[];
  validators?: string[];
  json?: string;
  auth?: string;
  force?: boolean;
  here?: boolean;
  skipTests?: boolean;
};

export type RouteComponentModel = ComponentTemplateModel & {
  path: string;
  hooks?: {
    pre?: {
      name: string;
    };
    post?: {
      name: string;
    };
  };
  validators?: {
    pre?: boolean;
    post?: boolean;
  };
  authorization?: {
    type: string;
    name: string;
  };
};
