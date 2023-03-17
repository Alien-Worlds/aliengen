import { SupportedFormat } from "../types/abi.types";

export type DownloadAbiOptions = {
    contractName: string,
    blockNumber?: string,
    format: SupportedFormat,
    downloadPath: string,
}