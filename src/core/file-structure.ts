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

export type FileStructureAddons = { endpoint?: string; database?: string };

export class FileStructure {
  protected root: string;
  constructor(
    protected config: SourceConfig,
    protected addons?: FileStructureAddons
  ) {
    this.root = getSourcePath(process.cwd(), config.dirname);
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
    const { root } = this;

    const pattern = this.config.structure[type];
    const { endpoint, database } = this.addons || {};
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

        if (endpoint) {
          parsedPath = parsedPath.replace("{{endpoint}}", paramCase(endpoint));
        }
      }

      if (database) {
        parsedPath = parsedPath.replace("{{database}}", paramCase(database));
      }

      return { path: parsedPath, marker };
    }

    throw new UndefinedPathPatternError(type);
  }
}
