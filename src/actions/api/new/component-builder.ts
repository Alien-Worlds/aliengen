import {
  FileStructure,
  OutputBuilder,
  Result,
  SourceCodeWriter,
  TemplateEngine,
} from "../../../core";
import { ComponentType } from "../../../enums";
import { FileTransport } from "../../../transport/file.transport";
import { DefaultOptions } from "../../../types";
import { Config } from "../../config";

export type Validator = (
  config: Config,
  options: DefaultOptions
) => Promise<Result>;

export class ComponentBuilder {
  protected templateEngine: TemplateEngine;
  protected fileStructure: FileStructure;
  protected codeWriter: SourceCodeWriter;
  protected validator: Validator;
  protected related: Set<string> = new Set<string>();
  protected outputBuilderByType: Map<string, OutputBuilder> = new Map<
    string,
    OutputBuilder
  >();

  constructor(
    protected type: ComponentType,
    protected config: Config,
    protected options: DefaultOptions
  ) {
    const addons = {
      endpoint: options.endpoint,
      type: "",
    };

    if (typeof options.type === "string") {
      addons.type = type;
    }

    this.config = config;
    this.templateEngine = new TemplateEngine(this.config);
    this.fileStructure = new FileStructure(this.config.source, addons);
    this.codeWriter = new SourceCodeWriter(new FileTransport());
  }

  protected async buildRelated() {
    const {
      codeWriter,
      outputBuilderByType,
      config,
      fileStructure,
      templateEngine,
      options,
      related,
    } = this;

    const includes = Array.from(related);

    for (const include of includes) {
      try {
        if (outputBuilderByType.has(include)) {
          const builder = outputBuilderByType.get(include);
          builder.inititalize(config, options, templateEngine, fileStructure);
          builder.registerTemplates();
          const output = await builder.build();
          codeWriter.add(output);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  public includeRelated(name: string, builder: OutputBuilder) {
    this.outputBuilderByType.set(name, builder);
    this.related.add(name);
    return this;
  }

  public useValidator(validator: Validator) {
    this.validator = validator;
    return this;
  }

  public async build(builder: OutputBuilder) {
    const {
      type,
      options,
      config,
      templateEngine,
      fileStructure,
      codeWriter,
      validator,
    } = this;

    if (validator) {
      const validation = await validator(config, options);

      if (validation.isFailure) {
        console.log(validation.failure.error.message);
        return;
      }
    }

    if (!builder) {
      console.log(`No output builder found for "${type}".`);
      return;
    }

    builder.inititalize(config, options, templateEngine, fileStructure);
    builder.registerTemplates();
    const output = await builder.build();
    codeWriter.add(output);

    if (Array.isArray(options.include)) {
      const include = new Set<string>();
      options.include.forEach((i) => include.add(i.toLowerCase()));
    }

    await this.buildRelated();

    const { error } = codeWriter.write();

    if (error) {
      console.error(error);
    } else {
      if (output.length === 0) {
        console.warn(`No content was generated. Check the logs above.`);
      } else {
        console.log(`Creation task completed`);
      }
    }
  }
}
