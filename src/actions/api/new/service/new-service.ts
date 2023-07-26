import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { ServiceFactoryUnitTestOutputBuilder } from "./service-factory-unit-test.output-builder";
import { ServiceFactoryOutputBuilder } from "./service-factory.output-builder";
import { ServiceImplUnitTestOutputBuilder } from "./service-impl-unit-test.output-builder";
import { ServiceImplOutputBuilder } from "./service-impl.output-builder";
import { ServiceOutputBuilder } from "./service.output-builder";
import { NewServiceOptions } from "./types";

export const newService = async (options: NewServiceOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(ComponentType.Service, config, options);

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  builder
    .includeRelated(
      ComponentType.ServiceFactory,
      new ServiceFactoryOutputBuilder()
    )
    .includeRelated(ComponentType.ServiceImpl, new ServiceImplOutputBuilder());

  if (!options.skipTests && !config.source.skip_tests) {
    builder
      .includeRelated(
        ComponentType.ServiceFactoryUnitTest,
        new ServiceFactoryUnitTestOutputBuilder()
      )
      .includeRelated(
        ComponentType.ServiceImplUnitTest,
        new ServiceImplUnitTestOutputBuilder()
      );
  }

  builder
    .useValidator(validateNewServiceOptions)
    .build(new ServiceOutputBuilder());
};

export const validateNewServiceOptions = async (
  config: Config,
  options: NewServiceOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Service);

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
