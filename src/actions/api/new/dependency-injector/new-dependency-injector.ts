import { NewDependencyInjectorOptions } from "./types";
import { Config, getConfig, validateConfig } from "../../../config";
import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { ComponentBuilder } from "../component-builder";
import { DependencyInjectorOutputBuilder } from "./dependency-injector.output-builder";
import { RootDependencyInjectorOutputBuilder } from "./root-dependency-injector.output-builder";

export const newDependencyInjector = async (
  options: NewDependencyInjectorOptions
) => {
  const config = getConfig();
  const builder = new ComponentBuilder(
    ComponentType.DependencyInjector,
    config,
    options
  );

  builder.useValidator(validateNewDependencyInjectorOptions);

  if (options.root === true) {
    builder.build(new RootDependencyInjectorOutputBuilder());
  } else {
    builder.build(new DependencyInjectorOutputBuilder());
  }
};

export const validateNewDependencyInjectorOptions = async (
  config: Config,
  options: NewDependencyInjectorOptions
) => {
  const { failure } = validateConfig(config, ComponentType.DependencyInjector);

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
