import { Abi, JsonFile, SupportedFormat } from "../types/abi.types";
import { GenerateOptions, GeneratedOutput } from "./generate.types";

import { FileTransport } from "../../../transport/file.transport";
import Logger from "../../../logger";
import config from "../../../config";
import { download } from "../download/download";
import { existsSync } from "fs";
import { extractDataFromAbiJsonFilename } from "../json-to-code/json-to-code.utils";
import { generateActions } from "./actions";
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

      let output: GeneratedOutput[] = [];

      for (const abiFile of files) {
        const actionsOutput = generateActions(
          abiFile.content,
          contractName || extractDataFromAbiJsonFilename(abiFile.path).contract,
          outputPath || path.dirname(abiFile.path),
        )

        output = output.concat(actionsOutput);
      }

      await transportOutput(output, force);
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

async function transportOutput(output: GeneratedOutput[], overwrite: boolean): Promise<boolean> {
  const transport = new FileTransport();

  output.forEach((out) => {
    transport.writeOutput(out.content, {
      outputPath: out.filePath,
      overwrite,
    });
  })

  return true;
}