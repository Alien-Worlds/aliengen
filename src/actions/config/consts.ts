import os from "os";
import path from "path";

export const configFilename = ".aliengen";
export const globalConfigPath = path.join(os.homedir(), configFilename);
export const localConfigPath = path.join(process.cwd(), configFilename);
