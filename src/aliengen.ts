#!/usr/bin/env node

import * as Actions from "./actions";

import Logger, { LogLevel } from "./logger";

import commander from "commander";
import { version } from "../package.json";

const logger = Logger.getLogger({
    minLevel: LogLevel.Debug
});

const program = new commander.Command();

program.version(version).description("AlienGen");

const abi = program.command("abi");
const api = program.command("api");

abi
    .command("download")
    .requiredOption("-c, --contract <value>", "contract name")
    .option("-b, --block <value>", "block number")
    .option("-o, --out <value>", "complete download file path")
    .addOption(new commander.Option('-f, --format <value>', 'format').default('json').choices(['json', 'hex']))
    .description("Download contract ABI in JSON/Hex format and save it locally.")
    .action((options) => {
        Actions.Abi.download({
            format: options.format,
            downloadPath: options.out,
            contractName: options.contract,
            blockNumber: options.block,
        });
    });

abi
    .command("generate")
    .addOption(new commander.Option("-c, --contract <value>", "contract name").conflicts('source'))
    .option("-s, --source <value>", "downloaded contract ABI path to file or directory containing multiple ABIs")
    .option("-o, --out <value>", "output path", './generated')
    .option("-f, --force", "overwrite existing files", false)
    .description("Download contract ABI in JSON/Hex format and save it locally.")
    .action((options) => {
        Actions.Abi.generate({
            contractName: options.contract,
            source: options.source,
            outputPath: options.out,
            force: options.force,
        });
    });

abi
    .command("hex-to-code")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "hex file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract: string, hex: string, target: string) => {
        console.log(">", { contract, hex, target });
        Actions.Abi.hextToCode(contract, hex, target);
    });
abi
    .command("hex-to-json")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "hex file path")
    .option("-t, --target", "target path")
    .option("-b, --block", "block number")
    .description("...")
    .action((contract: string, hex: string, target: string, block: string) =>
        Actions.Abi.hexToJson(contract, hex, target, block)
    );
abi
    .command("json-to-code")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "json file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract: string, json: string, target: string) =>
        Actions.Abi.jsonToCode(contract, json, target)
    );
abi
    .command("json-to-hex")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "json file path")
    .option("-t, --target", "target path")
    .option("-b, --block", "block number")
    .description("...")
    .action((contract: string, json: string, target: string, block: string) =>
        Actions.Abi.jsonToHex(contract, json, target, block)
    );

/**
 * API
 */

api
    .command("endpoint")
    .option("-c, --name", "name")
    .option("-s, --json", "config")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract: string, hex: string, target: string) => {
        console.log(">", { contract, hex, target });
        Actions.Api.newEndpoint(contract, hex, target);
    });

/**
 *
 */
program.parse(process.argv);

export default program;
