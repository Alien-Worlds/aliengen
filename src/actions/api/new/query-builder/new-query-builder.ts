import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { NewQueryBuilderOptions } from "./types";

export const newQueryBuilder = async (options: NewQueryBuilderOptions) => {
  if (!options.skipTests) {
    options.include = [ComponentType.QueryBuilderUnitTest];
  }

  const builder = new ComponentBuilder(options);
  builder.build(ComponentType.QueryBuilder, validateNewQueryBuilderOptions);
};

export const validateNewQueryBuilderOptions = async (
  config: Config,
  options: NewQueryBuilderOptions
) => {
  const { failure } = validateConfig(config, ComponentType.QueryBuilder);

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
