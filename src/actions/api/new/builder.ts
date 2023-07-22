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
import { getConfig, Config } from "../../config";
import { EntityOutputBuilder } from "./entity";
import { EntityUnitTestOutputBuilder } from "./entity/entity-unit-test.output-builder";
import { ModelOutputBuilder } from "./model";

export class ComponentBuilder {
  protected config: Config;
  protected templateEngine: TemplateEngine;
  protected fileStructure: FileStructure;
  protected codeWriter: SourceCodeWriter;
  protected outputBuilderByType: Map<string, OutputBuilder> = new Map<
    string,
    OutputBuilder
  >([
    [ComponentType.Model, new ModelOutputBuilder()],
    [ComponentType.Entity, new EntityOutputBuilder()],
    [ComponentType.EntityUnitTest, new EntityUnitTestOutputBuilder()],
  ]);

  constructor(protected options: DefaultOptions) {
    this.config = getConfig();
    this.templateEngine = new TemplateEngine(this.config);
    this.fileStructure = new FileStructure(this.config.source, {
      endpoint: options.endpoint,
    });
    this.codeWriter = new SourceCodeWriter(new FileTransport());
  }

  protected async includeRelated(list: Set<string>) {
    const {
      codeWriter,
      outputBuilderByType,
      config,
      fileStructure,
      templateEngine,
      options,
    } = this;

    const includes = Array.from(list);

    for (const include of includes) {
      try {
        if (outputBuilderByType.has(include)) {
          const builder = outputBuilderByType.get(include);
          builder.inititalize(config, options, templateEngine, fileStructure);
          const output = await builder.build();
          codeWriter.add(output);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async build(
    type: ComponentType,
    configValidator: (
      config: Config,
      options: DefaultOptions
    ) => Promise<Result>
  ) {
    const {
      options,
      config,
      templateEngine,
      fileStructure,
      codeWriter,
      outputBuilderByType,
    } = this;
    const validation = await configValidator(config, options);

    if (validation.isFailure) {
      console.log(validation.failure.error.message);
      return;
    }

    const outputBuilder = outputBuilderByType.get(type);

    if (!outputBuilder) {
      console.log(`No output builder found for "${type}".`);
      return;
    }

    outputBuilder.inititalize(config, options, templateEngine, fileStructure);
    const output = await outputBuilder.build();
    codeWriter.add(output);

    if (Array.isArray(options.include)) {
      const include = new Set<string>();
      options.include.forEach((i) => include.add(i.toLowerCase()));

      await this.includeRelated(include);
    }

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
