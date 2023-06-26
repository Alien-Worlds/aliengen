import { MappedDatatype, Technology } from "../types/mapping.types";

import { AbiComponent } from "../types/abi.types";

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
  RawModel = "RawModel",
  Entity = "Entity",
}

export type Property = {
  key: string;
  type: MappedDatatype;
};

export type GeneratedOutput = {
  filePath: string;
  overwrite?: boolean;
  content: string;
};

export type ParsedComponentMapper = {
  name: string;
  component?: AbiComponent;

  [Technology.Mongo]?: ParsedTypeMapper[];
  [Technology.Typescript]?: ParsedTypeMapper[];
  [Technology.Raw]?: ParsedTypeMapper[];
};

export type ParsedTypeMapper = {
  name: string;
  isParent?: boolean;
  props: Property[];
};
