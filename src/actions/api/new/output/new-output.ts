import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { OutputUnitTestOutputBuilder } from "./output-unit-test.output-builder";
import { OutputOutputBuilder } from "./output.output-builder";
import { NewOutputOptions } from "./types";

export const newOutput = async (options: NewOutputOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Output, config, options);

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.OutputUnitTest,
      new OutputUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewOutputOptions)
    .build(new OutputOutputBuilder());
};

export const validateNewOutputOptions = async (
  config: Config,
  options: NewOutputOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Output);

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
