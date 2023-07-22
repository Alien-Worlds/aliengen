import { Transport } from "../transport/transport";
import { GeneratedOutput } from "../types";

export class SourceCodeWriter {
  protected outputs = new Set<GeneratedOutput>();
  constructor(protected transport: Transport) {}

  public add(value: GeneratedOutput | GeneratedOutput[]) {
    if (Array.isArray(value)) {
      value.forEach((v) => this.outputs.add(v));
    } else {
      this.outputs.add(value);
    }
    return this;
  }

  public write(): { error?: Error } {
    try {
      const { transport, outputs } = this;

      outputs.forEach((out) => {
        transport.writeOutput(out.content, {
          outputPath: out.path,
          overwrite: out.overwrite,
        });
      });
      return {};
    } catch (error) {
      return { error };
    }
  }
}
