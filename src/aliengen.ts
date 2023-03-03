#!/usr/bin/env node

import * as Actions from "./actions";

import commander from "commander";
import { version } from "../package.json";
const program = new commander.Command();
const abi = program.command("abi");
const api = program.command("api");

program.version(version).description("AlienGen");

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
