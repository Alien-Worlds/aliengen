import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { RouteUnitTestOutputBuilder } from "./route-unit-test.output-builder";
import { RouteOutputBuilder } from "./route.output-builder";
import { NewRouteOptions } from "./types";

export const newRoute = async (options: NewRouteOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Route, config, options);

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.RouteUnitTest,
      new RouteUnitTestOutputBuilder()
    );
  }

  builder.useValidator(validateNewRouteOptions).build(new RouteOutputBuilder());
};

export const validateNewRouteOptions = async (
  config: Config,
  options: NewRouteOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Route);

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
