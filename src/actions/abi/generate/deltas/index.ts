import { Abi, AbiComponent } from "../../types/abi.types";
import { generateExports, generateRepository } from "../common";

import { GeneratedOutput } from "../generate.types";
import { generateDeltaEnums } from "./enums.deltas";
import { generateDeltaMappers } from "./mappers.deltas";
import { generateDeltasDataSource } from "./data-source.deltas";
import { generateDeltasDtos } from "./dtos.deltas";
import { generateDeltasEntities } from "./entities.deltas";
import { paramCase } from "change-case";
import path from "path";

export function generateDeltas(
  abi: Abi,
  contractName: string,
  outputPath: string
): GeneratedOutput[] {
  const deltasOutputPath = path.join(
    outputPath,
    "contracts",
    paramCase(contractName),
    "deltas"
  );

  let output: GeneratedOutput[] = [].concat(
    // Data
    generateDeltasDataSource(contractName, deltasOutputPath),
    generateDeltasDtos(abi, contractName, deltasOutputPath),
    generateDeltaMappers(abi, contractName, deltasOutputPath),

    // Domain
    generateDeltasEntities(abi, contractName, deltasOutputPath),
    generateRepository(contractName, AbiComponent.Delta, deltasOutputPath),
    generateDeltaEnums(abi, contractName, deltasOutputPath),

    // Exports
    generateExports(deltasOutputPath)
  );

  return output;
}
