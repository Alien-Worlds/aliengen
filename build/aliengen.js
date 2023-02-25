#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const Actions = __importStar(require("./actions"));
const program = new commander_1.default.Command();
const abi = program.command("abi");
const api = program.command("api");
program.version("1.0.0").description("AlienGen");
abi
    .command("hex-to-code")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "hex file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract, hex, target) => {
    console.log(">", { contract, hex, target });
    Actions.Abi.hextToCode(contract, hex, target);
});
abi
    .command("hex-to-json")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "hex file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract, hex, target) => Actions.Abi.hexToJson(contract, hex, target));
abi
    .command("json-to-code")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "json file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract, json, target) => Actions.Abi.jsonToCode(contract, json, target));
abi
    .command("json-to-hex")
    .option("-c, --contract", "contract name")
    .option("-s, --source", "json file path")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract, json, target) => Actions.Abi.jsonToCode(contract, json, target));
api
    .command("endpoint")
    .option("-c, --name", "name")
    .option("-s, --json", "config")
    .option("-t, --target", "target path")
    .description("...")
    .action((contract, hex, target) => {
    console.log(">", { contract, hex, target });
    Actions.Api.newEndpoint(contract, hex, target);
});
program.parse(process.argv);
exports.default = program;
