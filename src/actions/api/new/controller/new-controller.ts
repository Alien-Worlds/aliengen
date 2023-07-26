import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { ControllerUnitTestOutputBuilder } from "./controller-unit-test.output-builder";
import { ControllerOutputBuilder } from "./controller.output-builder";
import { NewControllerOptions } from "./types";

export const newController = async (options: NewControllerOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(
    ComponentType.Controller,
    config,
    options
  );

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.ControllerUnitTest,
      new ControllerUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewControllerOptions)
    .build(new ControllerOutputBuilder());
};

export const validateNewControllerOptions = async (
  config: Config,
  options: NewControllerOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Controller);

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
