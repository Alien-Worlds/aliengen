import { Abi, AbiComponent } from "../../types/abi.types";
import {
  generateExports,
  generateIocConfig,
  generateRepository,
} from "../common";

import { GeneratedOutput } from "../generate.types";
import { generateActionDataSource } from "./data-source.actions";
import { generateActionDtos } from "./dtos.actions";
import { generateActionEntities } from "./entities.actions";
import { generateActionEnums } from "./enums.actions";
import { generateActionMappers } from "./mappers.actions";
import { paramCase } from "change-case";
import path from "path";

export function generateActions(
  abi: Abi,
  contractName: string,
  outputPath: string
): GeneratedOutput[] {
  const actionsOutputPath = path.join(
    outputPath,
    "contracts",
    paramCase(contractName),
    "actions"
  );

  let output: GeneratedOutput[] = [].concat(
    // Data
    generateActionDataSource(contractName, actionsOutputPath),
    generateActionDtos(abi, contractName, actionsOutputPath),
    generateActionMappers(abi, contractName, actionsOutputPath),

    // Domain
    generateActionEntities(abi, contractName, actionsOutputPath),
    generateRepository(contractName, AbiComponent.Action, actionsOutputPath),
    generateActionEnums(abi, contractName, actionsOutputPath),

    // IOC config
    generateIocConfig(contractName, actionsOutputPath, AbiComponent.Action),

    // Exports
    generateExports(actionsOutputPath)
  );

  return output;
}
