import { Abi, AbiComponent } from "../../types/abi.types";
import { generateExports, generateIocConfig, generateRepository } from "../common";

import { GeneratedOutput } from "../generate.types";
import { generateDeltaEnums } from "./enums.deltas";
import { paramCase } from "change-case";
import path from "path";

export function generateDeltas(abi: Abi, contractName: string, outputPath: string): GeneratedOutput[] {
    const deltasOutputPath = path.join(outputPath, 'contracts', paramCase(contractName), 'deltas');

    let output: GeneratedOutput[] = [].concat(
        // Data
        // generateDeltaDataSource(contractName, deltasOutputPath),
        // generateDeltaDtos(abi, contractName, deltasOutputPath),
        // generateDeltaMappers(abi, contractName, deltasOutputPath),

        // Domain
        // generateDeltaEntities(abi, contractName, deltasOutputPath),
        generateRepository(contractName, AbiComponent.Delta, deltasOutputPath),
        generateDeltaEnums(abi, contractName, deltasOutputPath),

        // IOC config
        generateIocConfig(contractName, deltasOutputPath, AbiComponent.Delta),

        // Exports
        generateExports(deltasOutputPath),
    );

    return output;
}