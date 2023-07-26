import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { DataSourceUnitTestOutputBuilder } from "./data-source-unit-test.output-builder";
import { DataSourceOutputBuilder } from "./data-source.output-builder";
import { NewDataSourceOptions } from "./types";

export const newDataSource = async (options: NewDataSourceOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(
    ComponentType.DataSource,
    config,
    options
  );

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (
    Array.isArray(options.methods) &&
    options.methods.length > 0 &&
    !options.skipTests &&
    !config.source.skip_tests
  ) {
    builder.includeRelated(
      ComponentType.DataSourceUnitTest,
      new DataSourceUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewDataSourceOptions)
    .build(new DataSourceOutputBuilder());
};

export const validateNewDataSourceOptions = async (
  config: Config,
  options: NewDataSourceOptions
) => {
  const { failure } = validateConfig(config, ComponentType.DataSource);

  if (failure) {
    if (failure.error.issues.missingSourceDirname && options.here === false) {
      const shouldContinue = await InteractionPrompts.continue(
        failure.error.messages.missingSourceDirname
      );

      if (shouldContinue === false) {
        return Result.withFailure(
          Failure.withMessage(failure.error.messages.missingSourceDirname)
        );
      }
    } else if (
      failure.error.warnings.missingEndpoint &&
      options.here === false &&
      options.endpoint
    ) {
      const shouldContinue = await InteractionPrompts.continue(
        failure.error.messages.missingEndpoint
      );

      if (shouldContinue === false) {
        return Result.withFailure(
          Failure.withMessage(failure.error.messages.missingEndpoint)
        );
      }
    } else if (
      failure.error.issues.missingPathStructure &&
      options.here === false
    ) {
      const shouldContinue = await InteractionPrompts.continue(
        failure.error.messages.missingPathStructure
      );

      if (shouldContinue === false) {
        return Result.withFailure(
          Failure.withMessage(failure.error.messages.missingPathStructure)
        );
      }
    } else {
      return Result.withFailure(failure);
    }
  }

  return Result.withoutContent();
};
