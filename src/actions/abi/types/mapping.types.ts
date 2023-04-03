export const getMappedType = (sourceType: string, targetTechnology: 'typescript' | 'mongo'): MappedDatatype => {
    if (typesMap.has(sourceType)) {
        return {
            name: typesMap.get(sourceType)[targetTechnology].join(` | `)
        };
    } else if (commonEosTypesMap.has(sourceType)) {
        return {
            name: commonEosTypesMap.get(sourceType)[targetTechnology].join(` | `),
            requiresImport: true,
            importRef: '@alien-worlds/eosio-contract-types',
        };
    } else {
        console.error(`No mapping exist for smart contract type '${sourceType}' in ${targetTechnology}`)
        return { name: 'unknown' };
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
    ["int64", { typescript: ["bigint"], mongo: ["Long"] }],
    ["int128", { typescript: ["bigint"], mongo: ["Long"] }],
    ["int256", { typescript: ["bigint"], mongo: ["Long"] }],
    ["int8_t", { typescript: ["number"], mongo: ["number"] }],
    ["int16_t", { typescript: ["number"], mongo: ["number"] }],
    ["int32_t", { typescript: ["number"], mongo: ["number"] }],
    ["int64_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["int128_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["int256_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint8", { typescript: ["number"], mongo: ["number"] }],
    ["uint16", { typescript: ["number"], mongo: ["number"] }],
    ["uint32", { typescript: ["number"], mongo: ["number"] }],
    ["uint64", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint128", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint256", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint8_t", { typescript: ["number"], mongo: ["number"] }],
    ["uint16_t", { typescript: ["number"], mongo: ["number"] }],
    ["uint32_t", { typescript: ["number"], mongo: ["number"] }],
    ["uint64_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint128_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["uint256_t", { typescript: ["bigint"], mongo: ["Long"] }],
    ["checksum160", { typescript: ["string"], mongo: ["string"] }],
    ["checksum256", { typescript: ["string"], mongo: ["string"] }],
    ["checksum512", { typescript: ["string"], mongo: ["string"] }],
    ["string", { typescript: ["string"], mongo: ["string"] }],
    ["variant", { typescript: ["Array<unknown>"], mongo: ["Array<unknown>"] }],
]);

export const commonEosTypesMap = new Map<string, MappedType>([
    ["extended_symbol", { typescript: ["ExtendedSymbol"], mongo: ["ExtendedSymbolStruct"] }],
]);

export type MappedType = {
    typescript: string[];
    mongo: string[];
}

export type MappedDatatype = {
    name: string;
    requiresImport?: boolean;
    importRef?: string;
}
