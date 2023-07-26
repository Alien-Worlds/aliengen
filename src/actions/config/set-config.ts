import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Config, SetConfigOptions } from "./types";
import { isValidConfigKey, setConfigValue, validateConfig } from "./utils";
import { InvalidConfigError } from "./errors";
import { globalConfigPath, localConfigPath, localMapPath } from "./consts";
import DefaultConfig from "../../config/default.config.json";
import { fetchData } from "../../utils/files";
import { dirname } from "path";

export const setConfig = async (options: SetConfigOptions) => {
  const { key, value, global } = options;
  const targetPath = global ? globalConfigPath : localConfigPath;
  const parentDir = dirname(targetPath);

  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }

  if (global === false && existsSync(localMapPath) === false) {
    writeFileSync(localMapPath, "{}");
  }

  const currentConfig: Config = existsSync(targetPath)
    ? JSON.parse(readFileSync(targetPath, "utf-8"))
    : { headless: false, source: {} };

  if (options.default) {
    writeFileSync(targetPath, JSON.stringify(DefaultConfig, null, 2));
    console.log("Default configuration has been set.");
  } else if (options.path) {
    const candidate = await fetchData(options.path);
    const { failure } = validateConfig(candidate);

    if (failure) {
      throw new InvalidConfigError();
    }

    if (Object.keys(currentConfig.source).length > 0) {
      console.warn(
        "The configuration file already exists and its contents will be replaced with the new one from the given path"
      );
    }

    writeFileSync(targetPath, JSON.stringify(candidate));
    console.log("The new configuration has been set.");
    //
  } else if (key && value && isValidConfigKey(key)) {
    //
    setConfigValue(currentConfig, key, value);

    writeFileSync(targetPath, JSON.stringify(currentConfig, null, 2));
    console.log(`The key "${key}" has been added to the configuration.`);
    //
  } else {
    console.log(
      "The operation cannot be performed, no valid options are given."
    );
  }
};
