import { NewModelOptions } from "./types";
import { Config, validateConfig } from "../../../config";
import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { ComponentBuilder } from "../builder";

export const newModel = async (options: NewModelOptions) => {
  const builder = new ComponentBuilder(options);
  builder.build(ComponentType.Model, validateNewModelOptions);
};

export const validateNewModelOptions = async (
  config: Config,
  options: NewModelOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Model);

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
