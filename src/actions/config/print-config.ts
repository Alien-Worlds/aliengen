import { getConfigValue } from "./utils";
import { existsSync, readFileSync } from "fs";
import { GetConfigOptions } from "./types";
import { globalConfigPath, localConfigPath } from "./consts";

export const printConfig = (options: GetConfigOptions) => {
  const { key, global } = options;
  const targetPath = global ? globalConfigPath : localConfigPath;

  const storedConfig = existsSync(targetPath)
    ? readFileSync(targetPath, "utf-8")
    : null;

  if (storedConfig && key) {
    console.log(`{ ${key}: ${getConfigValue(JSON.parse(storedConfig), key)} }`);
  } else if (storedConfig) {
    console.dir(storedConfig, { depth: null });
  } else {
    console.log("");
  }
};
