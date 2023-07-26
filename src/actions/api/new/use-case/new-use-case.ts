import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { NewUseCaseOptions } from "./types";
import { UseCaseUnitTestOutputBuilder } from "./use-case-unit-test.output-builder";
import { UseCaseOutputBuilder } from "./use-case.output-builder";

export const newUseCase = async (options: NewUseCaseOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.UseCase, config, options);

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.UseCaseUnitTest,
      new UseCaseUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewUseCaseOptions)
    .build(new UseCaseOutputBuilder());
};

export const validateNewUseCaseOptions = async (
  config: Config,
  options: NewUseCaseOptions
) => {
  const { failure } = validateConfig(config, ComponentType.UseCase);

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
