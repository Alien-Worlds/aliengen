import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { MapperUnitTestOutputBuilder } from "./mapper-unit-test.output-builder";
import { MapperOutputBuilder } from "./mapper.output-builder";
import { NewMapperOptions } from "./types";

export const newMapper = async (options: NewMapperOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Mapper, config, options);

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.MapperUnitTest,
      new MapperUnitTestOutputBuilder()
    );
  }

  builder
    .useValidator(validateNewMapperOptions)
    .build(new MapperOutputBuilder());
};

export const validateNewMapperOptions = async (
  config: Config,
  options: NewMapperOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Mapper);

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
