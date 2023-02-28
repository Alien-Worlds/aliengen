import { existsSync } from "fs";
import { dirname } from "path";
import { Abi } from "../types/abi.types";
import { readJsonFiles } from "../utils/files";
import { extractDataFromAbiJsonFilename } from "./json-to-code.utils";

export const generateContractActionsCode = (
  abi: Abi,
  contract: string,
  path: string
) => {};

export const generateContractDeltasCode = (
  abi: Abi,
  contract: string,
  path: string
) => {};

export const generateContractServiceCode = (
  abi: Abi,
  contract: string,
  path: string
) => {};

export const jsonToCode = async (
  jsonPath: string,
  contract?: string,
  targetPath?: string
) => {
  try {
    if (existsSync(jsonPath)) {
      const abis = readJsonFiles<Abi>(jsonPath);

      // pola  kamysz  mama  kamysz  tata  kamysz  TYMON  KAMYSZ    KOCHAM  WAS

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
  } catch (error) {}
};
