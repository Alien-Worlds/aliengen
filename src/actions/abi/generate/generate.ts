import { Abi, JsonFile, SupportedFormat } from "../types/abi.types";

import { GenerateOptions } from "./generate.types";
import Logger from "../../../logger";
import config from "../../../config";
import { download } from "../download/download";
import { existsSync } from "fs";
import { extractDataFromAbiJsonFilename } from "../json-to-code/json-to-code.utils";
import { generateActionDtos } from "./actions/dtos.actions";
import path from "path";
import { readJsonFiles } from "../utils/files";

const logger = Logger.getLogger();

export const generate = async (
  options: GenerateOptions
) => {
  const { contractName, force, outputPath } = options;
  const source = await downloadContractIfSrcNotProvided(options);

  try {
    if (existsSync(source)) {
      const files: JsonFile<Abi>[] = readJsonFiles<Abi>(source);

      for (const abiFile of files) {
        generateActions(
          abiFile.content,
          contractName || extractDataFromAbiJsonFilename(abiFile.path).contract,
          outputPath || path.dirname(abiFile.path),
          force,
        )
      }
    } else {
      logger.error(`invalid source path ${source}`)
    }
  } catch (error) {
    logger.error(error)
  }
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

async function generateActions(abi: Abi, contractName: string, outputPath: string, force: boolean) {
  generateActionDtos(abi, contractName, outputPath, force);
}