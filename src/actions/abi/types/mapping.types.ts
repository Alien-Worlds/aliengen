import { ArtifactType } from "../generate/generate.types";
import { pascalCase } from "change-case";

export const getMappedType = (
  sourceType: string,
  targetTechnology: TargetTech
): MappedDatatype => {
  let typeKey = sourceType,
    isArray = false;

  if (sourceType.endsWith("[]")) {
    isArray = true;
    typeKey = sourceType.split("[]")[0];
  }

  if (typeKey.endsWith("?")) {
    typeKey = typeKey.split("?")[0];
  }

  if (typesMap.has(typeKey)) {
    const mappedType = typesMap.get(typeKey);

    let defaultValue: string = null;
    if (targetTechnology == TargetTech.Typescript) {
      if (mappedType.typescript[0].includes("Array")) {
        isArray = true;
      }

      defaultValue = isArray
        ? "[]"
        : typescriptDefaults.get(mappedType.typescript[0]);
    }

    let typeName = mappedType[targetTechnology].join(
      `${isArray ? "[]" : ""} | `
    );

    if (isArray && !typeName.includes("Array")) {
      typeName += "[]";
    }

    return {
      sourceName: sourceType,
      name: typeName,
      defaultValue,
      isArray,
    };
  } else if (commonEosTypesMap.has(typeKey)) {
    return {
      sourceName: typeKey,
      name: commonEosTypesMap
        .get(typeKey)
        [targetTechnology].join(`${isArray ? "[]" : ""} | `),
      requiresImport: true,
      importRef: "@alien-worlds/eosio-contract-types",
      isArray,
    };
  }
};

export const generateCustomTypeName = (
  sourceType: string,
  artifactType?: ArtifactType
): MappedDatatype => {
  let typeKey = sourceType,
    isArray = false;

  if (sourceType.endsWith("[]")) {
    isArray = true;
    typeKey = sourceType.split("[]")[0];
  }

  if (typeKey.endsWith("?")) {
    typeKey = typeKey.split("?")[0];
  }

  return {
    sourceName: typeKey,
    name: `${pascalCase(typeKey)}${artifactType ?? ""}${isArray ? "[]" : ""}`,
    requiresCodeGen: true,
    isArray,
  };
};

export const typesMap = new Map<string, MappedType>([
  ["bytes", { typescript: ["Bytes"], mongo: ["Binary"] }],
  ["bool", { typescript: ["boolean"], mongo: ["boolean"] }],
  ["symbol", { typescript: ["Symbol"], mongo: ["object"] }],
  ["extension", { typescript: ["Extension"], mongo: ["object"] }],
  ["name", { typescript: ["string"], mongo: ["string"] }],
  ["int8", { typescript: ["number"], mongo: ["number"] }],
  ["int16", { typescript: ["number"], mongo: ["number"] }],
  ["int32", { typescript: ["number"], mongo: ["number"] }],
  ["int64", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["int128", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["int256", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["int8_t", { typescript: ["number"], mongo: ["number"] }],
  ["int16_t", { typescript: ["number"], mongo: ["number"] }],
  ["int32_t", { typescript: ["number"], mongo: ["number"] }],
  ["int64_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["int128_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["int256_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint8", { typescript: ["number"], mongo: ["number"] }],
  ["uint16", { typescript: ["number"], mongo: ["number"] }],
  ["uint32", { typescript: ["number"], mongo: ["number"] }],
  ["uint64", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint128", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint256", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint8_t", { typescript: ["number"], mongo: ["number"] }],
  ["uint16_t", { typescript: ["number"], mongo: ["number"] }],
  ["uint32_t", { typescript: ["number"], mongo: ["number"] }],
  ["uint64_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint128_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["uint256_t", { typescript: ["bigint"], mongo: ["MongoDB.Long"] }],
  ["checksum160", { typescript: ["string"], mongo: ["string"] }],
  ["checksum256", { typescript: ["string"], mongo: ["string"] }],
  ["checksum512", { typescript: ["string"], mongo: ["string"] }],
  ["string", { typescript: ["string"], mongo: ["string"] }],
  ["variant", { typescript: ["Array<unknown>"], mongo: ["Array<unknown>"] }],
  [
    "state_value_variant",
    { typescript: ["Array<unknown>"], mongo: ["Array<unknown>"] },
  ],
  ["time_point_sec", { typescript: ["Date"], mongo: ["Date"] }],
  ["time_point", { typescript: ["Date"], mongo: ["Date"] }],
]);

export const commonEosTypesMap = new Map<string, MappedType>([
  ["asset", { typescript: ["Asset"], mongo: ["object"] }],
  ["extended_asset", { typescript: ["ExtendedAsset"], mongo: ["object"] }],
]);

export const typescriptDefaults = new Map<string, string>([
  ["number", "-1"],
  ["boolean", "false"],
  ["string", "''"],
  ["bigint", "-1n"],
  ["Date", "new Date(0)"],
]);

export type MappedType = {
  typescript: string[];
  mongo: string[];
};

export type MappedDatatype = {
  name: string;
  sourceName: string;
  requiresImport?: boolean;
  importRef?: string;
  requiresCodeGen?: boolean;
  defaultValue?: string;
  isArray: boolean;
};

export enum TargetTech {
  Typescript = "typescript",
  Mongo = "mongo",
}
