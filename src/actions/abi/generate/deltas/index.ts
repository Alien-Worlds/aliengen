import { generateExports, generateIocConfig } from "../common";

import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
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
        // generateDeltaRepository(contractName, deltasOutputPath),
        // generateDeltaEnums(abi, contractName, deltasOutputPath),

        // IOC config
        generateIocConfig(contractName, deltasOutputPath, 'delta'),

        // Exports
        generateExports(deltasOutputPath),
    );

    return output;
}