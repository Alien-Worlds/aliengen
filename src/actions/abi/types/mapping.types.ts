import { ArtifactType } from "../generate/generate.types";
import { pascalCase } from "change-case";

export const getMappedType = (
  sourceType: string,
  artifactType: ArtifactType
): MappedDatatype => {
  const targetTechnology =
    artifactType == ArtifactType.MongoModel
      ? Technology.Mongo
      : Technology.Typescript;

  let typeKey = sourceType,
    isArray = false;

  if (sourceType.endsWith("[]")) {
    isArray = true;
    typeKey = sourceType.split("[]")[0];
  }

  if (typeKey.endsWith("?")) {
    typeKey = typeKey.split("?")[0];
  }

  if (typeKey.includes("pair_")) {
    const name = isArray ? "Pair[]" : "Pair"; // getPairTypeName(typeKey);

    return {
      sourceName: typeKey,
      name,
      mappedName: "Pair",
      requiresImport: true,
      importRef: "@alien-worlds/eosio-contract-types",
      isArray,
    };
  } else if (typesMap.has(typeKey)) {
    const mappedType = typesMap.get(typeKey);

    let defaultValue: string = null;
    if (targetTechnology == Technology.Typescript) {
      if (mappedType.typescript[0].includes("Array")) {
        isArray = true;
      }

      defaultValue = isArray
        ? "[]"
        : typescriptDefaults.get(mappedType.typescript[0]);
    }
    const mappedName = mappedType[targetTechnology].join(` | `);
    let name = mappedType[targetTechnology].join(`${isArray ? "[]" : ""} | `);

    if (isArray && !name.includes("Array")) {
      name += "[]";
    }

    const item: MappedDatatype = {
      sourceName: sourceType,
      mappedName,
      name,
      defaultValue,
      isArray,
    };

    return item;
  } else if (commonEosTypesMap.has(typeKey)) {
    const name = getCommonTypeName(typeKey, artifactType);
    return {
      sourceName: typeKey,
      mappedName: name,
      name: isArray ? `${name}[]` : name,
      requiresImport: true,
      importRef: "@alien-worlds/eosio-contract-types",
      isArray,
    };
  }
};

const getPairTypeName = (typeKey: string) => {
  let typesStr = typeKey.replace("pair_", "");
  const refs = [
    ...Array.from(commonEosTypesMap.keys()),
    ...Array.from(typesMap.keys()),
  ].sort((a, b) => (a.length > b.length ? -1 : 1));
  let key;
  let value;

  for (const ref of refs) {
    const i = typesStr.indexOf(ref);
    if (i > 0) {
      value = ref;
      typesStr = typesStr.replace(ref, "");
    } else if (i === 0) {
      key = ref;
      typesStr = typesStr.replace(ref, "");
    }
  }

  const keyType = commonEosTypesMap.has(key)
    ? commonEosTypesMap.get(key).typescript
    : typesMap.has(key)
    ? typesMap.get(key).typescript
    : null;

  const valueType = commonEosTypesMap.has(value)
    ? commonEosTypesMap.get(value).typescript
    : typesMap.has(value)
    ? typesMap.get(value).typescript
    : null;

  return `Pair${
    keyType && valueType ? "<" + keyType + ", " + valueType + ">" : ""
  }[]`;
};

const getCommonTypeName = (typeKey: string, artifactType: ArtifactType) => {
  const name = `${pascalCase(typeKey)}${
    artifactType !== ArtifactType.Entity ? artifactType : ""
  }`;
  return name;
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
  const mappedName = `${pascalCase(typeKey)}${
    artifactType && artifactType !== ArtifactType.Entity ? artifactType : ""
  }`;

  return {
    sourceName: typeKey,
    mappedName,
    name: `${mappedName}${isArray ? "[]" : ""}`,
    requiresCodeGen: true,
    isArray,
  };
};

export const typesMap = new Map<string, MappedType>([
  ["bool", { typescript: ["boolean"], mongo: ["boolean"] }],
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
  ["action", { typescript: ["Action"], mongo: ["object"] }],
  ["asset", { typescript: ["Asset"], mongo: ["object"] }],
  ["bytes", { typescript: ["Bytes"], mongo: ["MongoDB.Binary"] }],
  ["extended_asset", { typescript: ["ExtendedAsset"], mongo: ["object"] }],
  ["extended_symbol", { typescript: ["ExtendedSymbol"], mongo: ["object"] }],
  ["extension", { typescript: ["Extension"], mongo: ["object"] }],
  ["pair", { typescript: ["Pair"], mongo: ["object"] }],
  ["permission_level", { typescript: ["PermissionLevel"], mongo: ["object"] }],
  ["symbol", { typescript: ["Symbol"], mongo: ["object"] }],
  ["time_point", { typescript: ["TimePoint"], mongo: ["Date"] }],
  ["time_point_sec", { typescript: ["TimePointSec"], mongo: ["Date"] }],
  ["transaction", { typescript: ["Transaction"], mongo: ["object"] }],
]);

export const typescriptDefaults = new Map<string, string>([
  ["number", "0"],
  ["boolean", "false"],
  ["string", "''"],
  ["bigint", "0n"],
  ["Date", "new Date(0)"],
]);

export type MappedType = {
  typescript: string[];
  mongo: string[];
};

export type MappedDatatype = {
  name: string;
  sourceName: string;
  mappedName: string;
  requiresImport?: boolean;
  importRef?: string;
  requiresCodeGen?: boolean;
  defaultValue?: string;
  isArray: boolean;
};

export enum Technology {
  Typescript = "typescript",
  Mongo = "mongo",
  Raw = "raw",
}

export const getArtifactType = (tech: Technology): ArtifactType => {
  let artifactType: ArtifactType = null;

  switch (tech) {
    case Technology.Mongo:
      artifactType = ArtifactType.MongoModel;
      break;

    case Technology.Typescript:
      artifactType = ArtifactType.Entity;
      break;

    case Technology.Raw:
      artifactType = ArtifactType.RawModel;
      break;
  }

  return artifactType;
};

export const getTechnology = (artifactType: ArtifactType): Technology => {
  let tech: Technology = null;

  switch (artifactType) {
    case ArtifactType.MongoModel:
      tech = Technology.Mongo;
      break;

    case ArtifactType.Entity:
      tech = Technology.Typescript;
      break;

    case ArtifactType.RawModel:
      tech = Technology.Raw;
      break;
  }

  return tech;
};

export const generateStructName = (rawName: string, targetTech: Technology) => {
  let result = "";

  switch (targetTech) {
    case Technology.Typescript:
      result = pascalCase(rawName);
      break;
    case Technology.Mongo:
    case Technology.Raw:
      result = `${pascalCase(rawName)}${pascalCase(
        getArtifactType(targetTech)
      )}`;
      break;
  }

  return result;
};
