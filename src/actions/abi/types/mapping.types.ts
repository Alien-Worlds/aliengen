import { pascalCase } from "change-case";

export const getMappedType = (sourceType: string, targetTechnology: 'typescript' | 'mongo'): MappedDatatype => {
    let typeKey = sourceType, isArrayType = false;

    if (sourceType.endsWith("[]")) {
        isArrayType = true;
        typeKey = sourceType.split("[]")[0];
    }

    if (typesMap.has(typeKey)) {
        return {
            sourceName: sourceType,
            name: typesMap.get(typeKey)[targetTechnology].join(`${isArrayType ? '[]' : ''} | `),
        };
    } else if (commonEosTypesMap.has(typeKey)) {
        return {
            sourceName: typeKey,
            name: commonEosTypesMap.get(typeKey)[targetTechnology].join(`${isArrayType ? '[]' : ''} | `),
            requiresImport: true,
            importRef: '@alien-worlds/eosio-contract-types',
        };
    } else {
        console.error(`No mapping exist for smart contract type '${typeKey}' in ${targetTechnology}`)
        return {
            sourceName: typeKey,
            name: `${generateNewCustomTypeName(typeKey, TargetTech[targetTechnology])}${isArrayType ? '[]' : ''}`,
            requiresCodeGen: true,
        }
    }
}

function generateNewCustomTypeName(fieldType: string, target: TargetTech) {
    if (target == TargetTech.mongo) {
        return `${pascalCase(fieldType)}Struct`
    } else if (target == TargetTech.typescript) {
        return pascalCase(fieldType)
    }
}

export const typesMap = new Map<string, MappedType>([
    ["bytes", { typescript: ["Bytes"], mongo: ["Binary"] }],
    ["bool", { typescript: ["boolean"], mongo: ["boolean"] }],
    ["asset", { typescript: ["Asset"], mongo: ["object"] }],
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
]);

export const commonEosTypesMap = new Map<string, MappedType>([
    // TODO: think about defining common eos types in an independent git repository
]);

export type MappedType = {
    typescript: string[];
    mongo: string[];
}

export type MappedDatatype = {
    name: string;
    sourceName: string;
    requiresImport?: boolean;
    importRef?: string;
    requiresCodeGen?: boolean;
}

export enum TargetTech {
    typescript,
    mongo,
}
