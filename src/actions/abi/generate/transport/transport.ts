
type TransportOptions = {};
export declare abstract class Transport {
    abstract writeOutput(data: string, options?: TransportOptions): Promise<boolean> | boolean | void;
}

export interface FileTransportOptions extends TransportOptions {
    outputPath: string;
    overwrite?: boolean;
}