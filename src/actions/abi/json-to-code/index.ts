import { Abi } from "../types/abi.types";
import { dirname } from "path";
import { existsSync } from "fs";
import { extractDataFromAbiJsonFilename } from "./json-to-code.utils";
import { readJsonFiles } from "../utils/files";

export const generateContractActionsCode = (
  abi: Abi,
  contract: string,
  path: string
) => { };

export const generateContractDeltasCode = (
  abi: Abi,
  contract: string,
  path: string
) => { };

export const generateContractServiceCode = (
  abi: Abi,
  contract: string,
  path: string
) => { };

export const jsonToCode = async (
  jsonPath: string,
  contract?: string,
  targetPath?: string
) => {
  try {
    if (existsSync(jsonPath)) {
      const abis = readJsonFiles<Abi>(jsonPath);

      for (const abi of abis) {
        generateContractActionsCode(
          abi.content,
          contract || extractDataFromAbiJsonFilename(abi.path).contract,
          targetPath || dirname(abi.path)
        );
      }
    } else {
      console.log("wrong jsonPath");
    }
  } catch (error) { }
};
