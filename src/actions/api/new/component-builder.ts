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
import { DataSourceOutputBuilder } from "./data-source";
import { DataSourceUnitTestOutputBuilder } from "./data-source/data-source-unit-test.output-builder";
import { EntityOutputBuilder } from "./entity";
import { EntityUnitTestOutputBuilder } from "./entity/entity-unit-test.output-builder";
import { InputOutputBuilder } from "./input";
import { InputUnitTestOutputBuilder } from "./input/input-unit-test.output-builder";
import { ModelOutputBuilder } from "./model";
import { OutputOutputBuilder } from "./output";
import { OutputUnitTestOutputBuilder } from "./output/output-unit-test.output-builder";
import {
  QueryBuilderOutputBuilder,
  QueryBuilderUnitTestOutputBuilder,
} from "./query-builder";
import {
  RepositoryFactoryOutputBuilder,
  RepositoryImplOutputBuilder,
  RepositoryImplUnitTestOutputBuilder,
  RepositoryOutputBuilder,
} from "./repository";
import { RepositoryFactoryUnitTestOutputBuilder } from "./repository/repository-factory-unit-test.output-builder";
import {
  ServiceFactoryOutputBuilder,
  ServiceImplOutputBuilder,
  ServiceImplUnitTestOutputBuilder,
  ServiceOutputBuilder,
} from "./service";
import { ServiceFactoryUnitTestOutputBuilder } from "./service/service-factory-unit-test.output-builder";
import { UseCaseOutputBuilder } from "./use-case";
import { UseCaseUnitTestOutputBuilder } from "./use-case/use-case-unit-test.output-builder";

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
    [ComponentType.UseCase, new UseCaseOutputBuilder()],
    [ComponentType.UseCaseUnitTest, new UseCaseUnitTestOutputBuilder()],
    // [ComponentType.Controller, new ControllerOutputBuilder()],
    // [ComponentType.ControllerUnitTest, new ControllerUnitTestOutputBuilder()],
    [ComponentType.Repository, new RepositoryOutputBuilder()],
    [ComponentType.RepositoryFactory, new RepositoryFactoryOutputBuilder()],
    [
      ComponentType.RepositoryFactoryUnitTest,
      new RepositoryFactoryUnitTestOutputBuilder(),
    ],
    [ComponentType.RepositoryImpl, new RepositoryImplOutputBuilder()],
    [
      ComponentType.RepositoryImplUnitTest,
      new RepositoryImplUnitTestOutputBuilder(),
    ],
    [ComponentType.Service, new ServiceOutputBuilder()],
    [ComponentType.ServiceImpl, new ServiceImplOutputBuilder()],
    [ComponentType.ServiceImplUnitTest, new ServiceImplUnitTestOutputBuilder()],
    [ComponentType.ServiceFactory, new ServiceFactoryOutputBuilder()],
    [
      ComponentType.ServiceFactoryUnitTest,
      new ServiceFactoryUnitTestOutputBuilder(),
    ],
    [ComponentType.DataSource, new DataSourceOutputBuilder()],
    [ComponentType.DataSourceUnitTest, new DataSourceUnitTestOutputBuilder()],
    [ComponentType.QueryBuilder, new QueryBuilderOutputBuilder()],
    [
      ComponentType.QueryBuilderUnitTest,
      new QueryBuilderUnitTestOutputBuilder(),
    ],
    [ComponentType.Input, new InputOutputBuilder()],
    [ComponentType.InputUnitTest, new InputUnitTestOutputBuilder()],
    [ComponentType.Output, new OutputOutputBuilder()],
    [ComponentType.OutputUnitTest, new OutputUnitTestOutputBuilder()],
    // [ComponentType.Route, new RouteOutputBuilder()],
    // [ComponentType.RouteUnitTest, new RouteUnitTestOutputBuilder()],
  ]);

  constructor(protected options: DefaultOptions) {
    this.config = getConfig();
    this.templateEngine = new TemplateEngine(this.config);
    this.fileStructure = new FileStructure(this.config.source, {
      endpoint: options.endpoint,
      database: options.database,
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
          builder.registerTemplates();
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
    configValidator?: (
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

    if (configValidator) {
      const validation = await configValidator(config, options);

      if (validation.isFailure) {
        console.log(validation.failure.error.message);
        return;
      }
    }

    const outputBuilder = outputBuilderByType.get(type);

    if (!outputBuilder) {
      console.log(`No output builder found for "${type}".`);
      return;
    }

    outputBuilder.inititalize(config, options, templateEngine, fileStructure);
    outputBuilder.registerTemplates();
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
