import { MappedDatatype } from "../types/mapping.types";

export type GenerateOptions = {
    contractName?: string,
    source?: string,
    outputPath?: string,
    force?: boolean
}

export type ParsedAction = {
    name: string;
    props: {
        key: string;
        entityType: MappedDatatype;
        structType: MappedDatatype;
    }[];
}