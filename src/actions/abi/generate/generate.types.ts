import { MappedDatatype } from "../types/mapping.types";

export type GenerateOptions = {
    contractName?: string,
    source?: string,
    outputPath?: string,
    force?: boolean
}

export type ParsedAction = {
    name: string;
    types: ParsedAbiType[];
};

export type ParsedAbiType = {
    artifactType?: ArtifactType;
    name: string;
    props: TypeProp[]
}

export enum ArtifactType {
    Document = 'Document',
    SubDocument = 'SubDocument',
    Struct = 'Struct',
    SubStruct = 'SubStruct',
}

type TypeProp = {
    key: string;
    type: MappedDatatype;
}

export type GeneratedOutput = {
    filePath: string;
    overwrite?: boolean;
    content: string;
}
