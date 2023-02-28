import { basename, extname } from "path";

/**
 * abi file name pattern: contract.name[block number].json
 * @param path
 */
export const extractDataFromAbiJsonFilename = (
  path: string
): {
  contract: string;
  blockNumber: string;
} => {
  try {
    const filename = basename(path);
    const name = filename.replace(extname(filename), "");
    const [contract, blockNumber] = name.match(/([a-zA-Z0-9._-]+)/g);

    return { contract, blockNumber };
  } catch (error) {
    return { contract: "", blockNumber: "" };
  }
};
