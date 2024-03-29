import { Abi } from "../../types/abi.types";
import { GeneratedOutput } from "../generate.types";
import { generateServiceImplementation } from "./implementation.services";
import { generateServicesDefinition } from "./definition.services";
import path from "path";

export function generateServices(
  abi: Abi,
  contractName: string,
  outputPath: string
): GeneratedOutput[] {
  const servicesOutputPath = path.join(outputPath, "services");

  let output: GeneratedOutput[] = [].concat(
    generateServicesDefinition(abi, contractName, servicesOutputPath),
    generateServiceImplementation(abi, contractName, servicesOutputPath)
  );

  return output;
}
