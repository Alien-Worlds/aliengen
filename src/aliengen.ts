#!/usr/bin/env node

import * as Actions from "./actions";

import Logger, { LogLevel } from "./logger";

import commander from "commander";
import { version } from "../package.json";
import { GetConfigOptions, SetConfigOptions } from "./actions/config";

const logger = Logger.getLogger({
  minLevel: LogLevel.Debug,
});

const program = new commander.Command();

program.version(version).description("AlienGen");

const abi = program.command("abi");
const api = program.command("api");
const config = program.command("config");

// abi
//   .command("download")
//   .requiredOption("-c, --contract <value>", "contract name")
//   .option("-b, --block <value>", "block number")
//   .option("-o, --out <value>", "complete download file path")
//   .addOption(
//     new commander.Option("-f, --format <value>", "format")
//       .default("json")
//       .choices(["json", "hex"])
//   )
//   .description("Download contract ABI in JSON/Hex format and save it locally.")
//   .action((options) => {
//     Actions.Abi.download({
//       format: options.format,
//       downloadPath: options.out,
//       contractName: options.contract,
//       blockNumber: options.block,
//     });
//   });

// abi
//   .command("generate")
//   .addOption(
//     new commander.Option("-c, --contract <value>", "contract name").conflicts(
//       "source"
//     )
//   )
//   .option(
//     "-s, --source <value>",
//     "downloaded contract ABI path to file or directory containing multiple ABIs"
//   )
//   .option("-o, --out <value>", "output path", "./generated")
//   .option("-f, --overwrite", "overwrite existing files", false)
//   .description("Download contract ABI in JSON/Hex format and save it locally.")
//   .action((options) => {
//     Actions.Abi.generate({
//       contractName: options.contract,
//       source: options.source,
//       outputPath: options.out,
//       overwrite: options.overwrite,
//     });
//   });

// abi
//   .command("hex-to-code")
//   .option("-c, --contract", "contract name")
//   .option("-s, --source", "hex file path")
//   .option("-t, --target", "target path")
//   .description("...")
//   .action((contract: string, hex: string, target: string) => {
//     console.log(">", { contract, hex, target });
//     Actions.Abi.hextToCode(contract, hex, target);
//   });
// abi
//   .command("hex-to-json")
//   .option("-c, --contract", "contract name")
//   .option("-s, --source", "hex file path")
//   .option("-t, --target", "target path")
//   .option("-b, --block", "block number")
//   .description("...")
//   .action((contract: string, hex: string, target: string, block: string) =>
//     Actions.Abi.hexToJson(contract, hex, target, block)
//   );
// abi
//   .command("json-to-code")
//   .option("-c, --contract", "contract name")
//   .option("-s, --source", "json file path")
//   .option("-t, --target", "target path")
//   .description("...")
//   .action((contract: string, json: string, target: string) =>
//     Actions.Abi.jsonToCode(contract, json, target)
//   );
// abi
//   .command("json-to-hex")
//   .option("-c, --contract", "contract name")
//   .option("-s, --source", "json file path")
//   .option("-t, --target", "target path")
//   .option("-b, --block", "block number")
//   .description("...")
//   .action((contract: string, json: string, target: string, block: string) =>
//     Actions.Abi.jsonToHex(contract, json, target, block)
//   );

/**
 * API
 */
const newComponent = api.command("new");

newComponent
  .command("model")
  .option("-n, --name <value>", "Name of the Model")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --type [values...]", "json, mongo", "json")
  .option("-c, --json <path>", "config")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .option("-p, --props [values...]", "prop1:string prop2:number")
  .description("Creates new model file based on provided data.")
  .action((options) => Actions.Api.newModel(options));

newComponent
  .command("entity")
  .option("-n, --name <value>", "Name of the entity")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option(
    "-i, --include [values...]",
    "Include all related components: repository, data source, model, mapper or all",
    []
  )
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .option("-p, --props [values...]", "prop1:string prop2:number")
  .description("Creates new entity file based on provided data.")
  .action((options) => Actions.Api.newEntity(options));

newComponent
  .command("use-case")
  .option("-n, --name <value>", "Name of the entity")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option(
    "-i, --include [values...]",
    "Include all related components: repository, data source, model, mapper or all",
    []
  )
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .option("-j, --inject [classNames...]", "SomeRepository SomeUseCase")
  .description("Creates new use case file based on provided data.")
  .action((options) => Actions.Api.newUseCase(options));

newComponent
  .command("data-source")
  .option("-n, --name <value>", "Name of the entity")
  .option("-t, --type <value>", "Name of the database", "mongo")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option(
    "-i, --include [values...]",
    "Include all related components: repository, mapper or all",
    []
  )
  .option("-l, --model <name>", "")
  .option("-m, --methods [names...]", "findUserBy updateListWith")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new use case file based on provided data.")
  .action((options) => Actions.Api.newDataSource(options));

newComponent
  .command("repository")
  .option("-n, --name <value>", "Name of the repository")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option("-d, --database <name>", "mongo")
  .option("-l, --model <name>", "")
  .option(
    "-i, --include [values...]",
    "Include all related components: , mapper or all",
    []
  )
  .option("-m, --methods [names...]", "findUserBy updateListWith")
  .option("--impl", "", false)
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new repository file based on provided data.")
  .action((options) => Actions.Api.newRepository(options));

newComponent
  .command("service")
  .option("-n, --name <value>", "Name of the service")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option("-m, --methods [names...]", "findUserBy updateListWith")
  .option("-p, --props [names...]", "prop1:type prop2:type")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new service file based on provided data.")
  .action((options) => Actions.Api.newService(options));

newComponent
  .command("input")
  .option("-n, --name <value>", "Name of the input")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option("-p, --props [names...]", "prop1:type prop2:type")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new input file based on provided data.")
  .action((options) => Actions.Api.newInput(options));

newComponent
  .command("output")
  .option("-n, --name <value>", "Name of the input")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option("-p, --props [names...]", "prop1:type prop2:type")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new output file based on provided data.")
  .action((options) => Actions.Api.newOutput(options));

newComponent
  .command("query-builder")
  .option("-n, --name <value>", "Name of the query builder")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --type <name>", "mongo", "mongo")
  .option("-s, --json <path>", "config")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new query builder file based on provided data.")
  .action((options) => Actions.Api.newQueryBuilder(options));

newComponent
  .command("controller")
  .option("-n, --name <value>", "Name of the controller")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option(
    "-i, --include [values...]",
    "Include all related components: , mapper or all",
    []
  )
  .option("-m, --methods [names...]", "findUserBy updateListWith")
  .option("--inject [names...]", "findUserBy updateListWith")
  .option("-s, --json <path>", "config")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new controller file based on provided data.")
  .action((options) => Actions.Api.newController(options));

newComponent
  .command("route")
  .option("-n, --name <value>", "Name of the route")
  .option("-p, --path <value>", "")
  .option("-t, --type <value>", "Get, Post, Put, Patch, Delete")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option(
    "-i, --include [values...]",
    "Include all related components: , mapper or all",
    []
  )
  .option("-h, --hooks [hooks...]", "pre, post")
  .option("-v, --validators [hooks...]", "request")
  .option("-a, --auth <type>", "jwt")
  .option("-s, --json <path>", "config")
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .description("Creates new route file based on provided data.")
  .action((options) => Actions.Api.newRoute(options));

newComponent
  .command("injector")
  .option("-n, --name <value>", "Name of the route")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option("-f, --force", "", false)
  .option("-r, --root", "", false)
  .option("-h, --here", "", false)
  .description("Creates new dependency injector file based on provided data.")
  .action((options) => Actions.Api.newDependencyInjector(options));

newComponent
  .command("mapper")
  .option("-n, --name <value>", "Name of the mapper")
  .option("-t, --type <value>", "Type of the mapper")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --json <path>", "config")
  .option(
    "-i, --include [values...]",
    "Include all related components: repository, data source, model, mapper or all",
    []
  )
  .option("-f, --force", "", false)
  .option("-h, --here", "", false)
  .option("-p, --props [values...]", "prop1:string prop2:number")
  .description("Creates new mapper file based on provided data.")
  .action((options) => Actions.Api.newMapper(options));

/**
 * Config
 */

config
  .command("set")
  .option("-g, --global", "", false)
  .option("-d, --default", "", false)
  .option("-p, --path <value>", "Path to the config file.")
  .option("-k, --key <value>", "The name of the key whose value is to be set.")
  .option(
    "-v, --value <value>",
    "The new value for the given key. Requires the --key options."
  )
  .description(
    "This command is used to set individual option values or the entire configuration."
  )
  .action((options: SetConfigOptions) => Actions.Config.setConfig(options));

config
  .command("get")
  .option("-k, --key <value>", "The name of the key.")
  .description(
    "This command is used to display a specific option or the entire configuration."
  )
  .action((options: GetConfigOptions) => Actions.Config.printConfig(options));

/**
 *
 */
program.parse(process.argv);

export default program;
