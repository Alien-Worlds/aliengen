import { existsSync, readFileSync } from "fs";
import { Config } from "./types";
import { globalConfigPath, localConfigPath } from "./consts";
import { Result } from "../../core/result";
import { ConfigIssues, ConfigWarnings, InvalidConfigError } from "./errors";
import { Failure } from "../../core/failure";

export const validateConfig = (
  value: string | Object,
  type?: string
): Result<ConfigWarnings, InvalidConfigError> => {
  const config: Config = typeof value === "string" ? JSON.parse(value) : value;
  const issues: ConfigIssues = {};
  const warnings: ConfigWarnings = {};

  const missingSourceDirname = typeof config.source?.dirname !== "string";

  if (missingSourceDirname) {
    issues.missingSourceDirname = true;
  }

  if (type) {
    const missingPathStructure =
      typeof config.source?.structure?.[type] !== "string";

    if (missingPathStructure) {
      issues.missingPathStructure = true;
    }

    warnings.missingEndpoint =
      typeof config.source?.structure?.[type] === "string" &&
      config.source.structure[type].includes("{{endpoint}}") === false;

    warnings.missingMarker =
      typeof config.source?.structure?.[type] === "string" &&
      /^.*#(.*)$/.test(config.source.structure[type]) === false;
  }

  return Object.keys(issues).length === 0
    ? Result.withContent(warnings)
    : Result.withFailure(
        Failure.fromError(new InvalidConfigError(issues, warnings))
      );
};

export const isValidConfigKey = (key: string): boolean => {
  return true;
};

export const getConfig = (): Config => {
  if (existsSync(localConfigPath)) {
    const content = readFileSync(localConfigPath, "utf-8");
    return JSON.parse(content);
  }

  console.warn(`Local config file not found.`);

  if (existsSync(globalConfigPath)) {
    const content = readFileSync(globalConfigPath, "utf-8");
    return JSON.parse(content);
  }

  console.warn(`Global config file not found.`);

  return { source: {} };
};

export const getConfigPath = (global = false): string => {
  if (global && existsSync(globalConfigPath)) {
    return globalConfigPath;
  }

  if (existsSync(localConfigPath) && global === false) {
    return localConfigPath;
  }

  return "";
};

export const setConfigValue = (obj: Object, path: string, value: unknown) => {
  const keys = path.split(".");
  let currentObj = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!currentObj.hasOwnProperty(key)) {
      currentObj[key] = {};
    }

    currentObj = currentObj[key];
  }

  const finalKey = keys[keys.length - 1];
  currentObj[finalKey] = value;
};

export const getConfigValue = (obj: Object, path: string) => {
  const keys = path.split(".");
  let currentValue = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (currentValue.hasOwnProperty(key)) {
      currentValue = currentValue[key];
    }
  }

  return currentValue;
};
