import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { NewDataSourceOptions } from "./types";

export const newDataSource = async (options: NewDataSourceOptions) => {
  if (Array.isArray(options.methods) && options.methods.length > 0) {
    if (Array.isArray(options.include)) {
      options.include.push(ComponentType.DataSourceUnitTest);
    } else {
      options.include = [ComponentType.DataSourceUnitTest];
    }
  }

  const builder = new ComponentBuilder({ database: options.type, ...options });
  builder.build(ComponentType.DataSource, validateNewDataSourceOptions);
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
