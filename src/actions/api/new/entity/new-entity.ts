import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { EntityUnitTestOutputBuilder } from "./entity-unit-test.output-builder";
import { EntityOutputBuilder } from "./entity.output-builder";
import { NewEntityOptions } from "./types";

export const newEntity = async (options: NewEntityOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Entity, config, options);

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.EntityUnitTest,
      new EntityUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewEntityOptions)
    .build(new EntityOutputBuilder());
};

export const validateNewEntityOptions = async (
  config: Config,
  options: NewEntityOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Entity);

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
