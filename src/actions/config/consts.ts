import os from "os";
import path from "path";

export const configDirname = ".aliengen";
export const configFilename = "config.json";
export const mapFilename = "map.json";

export const globalConfigPath = path.join(
  os.homedir(),
  configDirname,
  configFilename
);

export const localConfigPath = path.join(
  process.cwd(),
  configDirname,
  configFilename
);

export const localMapPath = path.join(
  process.cwd(),
  configDirname,
  mapFilename
);
