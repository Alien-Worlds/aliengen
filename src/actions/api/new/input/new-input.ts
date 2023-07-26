import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { InputUnitTestOutputBuilder } from "./input-unit-test.output-builder";
import { InputOutputBuilder } from "./input.output-builder";
import { NewInputOptions } from "./types";

export const newInput = async (options: NewInputOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Input, config, options);

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.InputUnitTest,
      new InputUnitTestOutputBuilder()
    );
  }

  builder.useValidator(validateNewInputOptions).build(new InputOutputBuilder());
};

export const validateNewInputOptions = async (
  config: Config,
  options: NewInputOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Input);

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
