import { join } from "path";
import { paramCase } from "change-case";
import { GeneratedPath } from "../types";
import { getSourcePath } from "../utils/files";
import { SourceConfig } from "../actions/config";

export class UndefinedPathPatternError extends Error {
  constructor(type: string) {
    super(`${type}`);
  }
}

export type FileStructureAddons = {
  endpoint?: string;
  type?: string;
  [key: string]: string;
};

export class FileStructure {
  protected root: string;
  constructor(
    protected config: SourceConfig,
    protected addons?: FileStructureAddons
  ) {
    this.root = getSourcePath(process.cwd(), config.dirname);
    if (!addons) {
      this.addons = {};
    }
  }

  public has(name: string): boolean {
    const { config } = this;
    return typeof config?.structure?.[name] === "string";
  }

  public generatePath(
    type: string,
    name: string,
    here?: boolean
  ): GeneratedPath {
    const { root, addons, config } = this;
    const pattern = config.structure[type];

    if (pattern) {
      const [pathPattern, marker] = pattern.split("#");
      const [rest, ext] = pathPattern.split("{{name}}");
      let parsedPath;
      if (here) {
        parsedPath = join(process.cwd(), `${paramCase(name)}${ext}`);
      } else {
        parsedPath = pathPattern;
        parsedPath = pathPattern.replace("{{root}}", root);
        parsedPath = parsedPath.replace("{{name}}", paramCase(name));

        if (addons.endpoint) {
          parsedPath = parsedPath.replace(
            "{{endpoint}}",
            paramCase(addons.endpoint)
          );
        }
      }

      if (addons.type) {
        parsedPath = parsedPath.replace("{{type}}", paramCase(addons.type));
      }

      return { path: parsedPath, marker };
    }

    throw new UndefinedPathPatternError(type);
  }
}
