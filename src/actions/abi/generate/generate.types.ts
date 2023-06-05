import { AbiComponent } from "../types/abi.types";
import { MappedDatatype } from "../types/mapping.types";

export type GenerateOptions = {
  contractName?: string;
  source?: string;
  outputPath?: string;
  force?: boolean;
};

export type ParsedAbiComponent = {
  name: string;
  component?: AbiComponent;
  types: ParsedType[];
};

export type ParsedType = {
  artifactType?: ArtifactType;
  name: string;
  isParent?: boolean;
  props: Property[];
};

export enum ArtifactType {
  MongoModel = "MongoModel",
  Model = "Model",
}

type Property = {
  key: string;
  type: MappedDatatype;
};

export type GeneratedOutput = {
  filePath: string;
  overwrite?: boolean;
  content: string;
};
