import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { QueryBuilderUnitTestOutputBuilder } from "./query-builder-unit-test.output-builder";
import { QueryBuilderOutputBuilder } from "./query-builder.output-builder";
import { NewQueryBuilderOptions } from "./types";

export const newQueryBuilder = async (options: NewQueryBuilderOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(
    ComponentType.QueryBuilder,
    config,
    options
  );

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.QueryBuilderUnitTest,
      new QueryBuilderUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewQueryBuilderOptions)
    .build(new QueryBuilderOutputBuilder());
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
