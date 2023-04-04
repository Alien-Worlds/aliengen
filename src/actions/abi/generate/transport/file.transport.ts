import { FileTransportOptions, Transport } from "./transport";
import { ensurePathExists, fileOrDirExists } from "../../utils/files";

import Logger from "../../../../logger";
import fs from "fs";

const logger = Logger.getLogger();

export class FileTransport implements Transport {
    writeOutput(data: string, options: FileTransportOptions): boolean {
        const { outputPath, overwrite = false } = options;
        try {
            if (!overwrite && fileOrDirExists(outputPath)) {
                logger.info(`skipped ${outputPath}`, 'abi.generate', `🔵`);
                return true;
            }

            ensurePathExists(outputPath);
            fs.writeFileSync(outputPath, data);
            logger.info(`created ${outputPath}`, 'abi.generate', `🟢`);
        }
        catch (ex) {
            logger.error(ex)
            return false;
        }

        return true;
    }
}