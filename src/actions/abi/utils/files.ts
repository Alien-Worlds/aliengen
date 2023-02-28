import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { JsonFile } from "../types/abi.types";

export const createTargetPath = (path: string) => {
  const targetDirPath = dirname(path);
  if (!existsSync(targetDirPath)) {
    mkdirSync(targetDirPath, { recursive: true });
  }
};

export const walk = (dir: string): string[] =>
  readdirSync(dir).reduce((files: string[], file: string) => {
    const name = join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...walk(name)] : [...files, name];
  }, []);

export const readJsonFile = <JsonType = unknown>(path: string): JsonType => {
  try {
    let content = readFileSync(path, "utf-8");
    return JSON.parse(content) as JsonType;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const readJsonFiles = <Type = unknown>(
  path: string
): JsonFile<Type>[] => {
  let result: JsonFile<Type>[] = [];
  if (statSync(path).isDirectory()) {
    result = walk(path).reduce((list, path) => {
      const content = readJsonFile<Type>(path);
      if (content) {
        list.push({ path, content });
      }
      return list;
    }, []);
  } else {
    const content = readJsonFile<Type>(path);
    if (content) {
      result.push({ path, content });
    }
  }

  return result;
};
