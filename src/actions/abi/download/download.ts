import * as fs from "fs";
import * as path from "path";

import { DownloadAbiOptions } from "./download.types";
import { EosManager } from "../../../eosjs.rpc.source";
import { SupportedFormat } from "../types/abi.types";
import config from "../../../config";
import { ensurePathExists } from "../utils/files";

// TODO: use hex format
// TODO: download ABI at a specific blockNumber

export const download = async (
  options: DownloadAbiOptions
) => {
  const {
    contractName,
    format,
    blockNumber,
    downloadPath = path.join(process.cwd(), config.downloadsDir, `${contractName}.${SupportedFormat.JSON}`),
  } = options;

  const eosMgr = new EosManager();
  const abi = await eosMgr.getAbi(contractName);

  let outPath = path.parse(downloadPath)
  ensurePathExists(path.format(outPath))

  fs.writeFileSync(path.format(outPath), JSON.stringify(abi, null, 2));
  console.info(`🎉 Downloaded contract ABI for '${contractName}' at ${path.resolve(downloadPath)}`);
};
