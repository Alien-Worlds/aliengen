import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import { generateActionDataSource } from "./data-source.actions";
import { generateActionDtos } from "./dtos.actions";
import { generateActionEntities } from "./entities.actions";
import { generateActionEnums } from "./enums.actions";
import { generateActionExports } from "./exports.actions";
import { generateActionIocConfig } from "./ioc.actions";
import { generateActionMappers } from "./mappers.actions";
import { generateActionRepository } from "./repository.actions";

export function generateActions(abi: Abi, contractName: string, outputPath: string): GeneratedOutput[] {
    let output: GeneratedOutput[] = [].concat(
        // Data
        generateActionDataSource(contractName, outputPath),
        generateActionDtos(abi, contractName, outputPath),
        generateActionMappers(abi, contractName, outputPath),

        // Domain
        generateActionEntities(abi, contractName, outputPath),
        generateActionRepository(contractName, outputPath),
        generateActionEnums(abi, contractName, outputPath),

        // IOC config
        generateActionIocConfig(contractName, outputPath),

        // Exports
        generateActionExports(contractName, outputPath),
    );

    return output;
}