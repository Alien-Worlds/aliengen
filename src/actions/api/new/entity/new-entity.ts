import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, validateConfig } from "../../../config";
import { ComponentBuilder } from "../builder";
import { NewEntityOptions } from "./types";

export const newEntity = async (options: NewEntityOptions) => {
  if (Array.isArray(options.include)) {
    options.include.push(ComponentType.EntityUnitTest);
  } else {
    options.include = [ComponentType.EntityUnitTest];
  }

  const builder = new ComponentBuilder(options);
  builder.build(ComponentType.Entity, validateNewEntityOptions);
};

export const validateNewEntityOptions = async (
  config: Config,
  options: NewEntityOptions
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
