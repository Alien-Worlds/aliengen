import { Abi, SupportedFormat } from "../types/abi.types";

import { GenerateOptions } from "./generate.types";
import config from "../../../config";
import { download } from "../download/download";
import { existsSync } from "fs";
import { extractDataFromAbiJsonFilename } from "../json-to-code/json-to-code.utils";
import { generateContractActions } from "./generate.actions";
import path from "path";
import { readJsonFiles } from "../utils/files";

export const generate = async (
  options: GenerateOptions
) => {
  const { contractName, force, outputPath } = options;
  const source = await downloadContractIfSrcNotProvided(options);

  try {
    if (existsSync(source)) {
      const abis = readJsonFiles<Abi>(source);

      for (const abi of abis) {
        generateContractActions(
          abi.content,
          contractName || extractDataFromAbiJsonFilename(abi.path).contract,
          outputPath || path.dirname(abi.path),
          force,
        );
      }
    } else {
      console.log("wrong jsonPath");
    }
  } catch (error) { }
};

async function downloadContractIfSrcNotProvided(options: GenerateOptions): Promise<string> {
  let { source, contractName } = options;

  if (!source) {
    if (!contractName) {
      throw new Error("please provide contract name OR contract ABI path")
    }
    const downloadPath = path.join(process.cwd(), config.downloadsDir, `${contractName}.${SupportedFormat.JSON}`)

    await download({
      contractName,
      downloadPath,
      format: SupportedFormat.JSON,
    })

    source = downloadPath;
  }

  return source;
}
