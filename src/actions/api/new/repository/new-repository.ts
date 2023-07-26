import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, getConfig, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { RepositoryFactoryUnitTestOutputBuilder } from "./repository-factory-unit-test.output-builder";
import { RepositoryFactoryOutputBuilder } from "./repository-factory.output-builder";
import { RepositoryImplUnitTestOutputBuilder } from "./repository-impl-unit-test.output-builder";
import { RepositoryImplOutputBuilder } from "./repository-impl.output-builder";
import { RepositoryOutputBuilder } from "./repository.output-builder";
import { NewRepositoryOptions } from "./types";

export const newRepository = async (options: NewRepositoryOptions) => {
  const config = getConfig();
  const builder = new ComponentBuilder(
    ComponentType.Repository,
    config,
    options
  );

  if (Array.isArray(options.include) && options.include.includes("all")) {
    // include all related components
  }

  builder.includeRelated(
    ComponentType.RepositoryFactory,
    new RepositoryFactoryOutputBuilder()
  );

  if (options.impl) {
    builder.includeRelated(
      ComponentType.RepositoryImpl,
      new RepositoryImplOutputBuilder()
    );
  }

  if (!options.skipTests && !config.source.skip_tests) {
    builder.includeRelated(
      ComponentType.RepositoryFactoryUnitTest,
      new RepositoryFactoryUnitTestOutputBuilder()
    );

    if (options.impl) {
      builder.includeRelated(
        ComponentType.RepositoryImplUnitTest,
        new RepositoryImplUnitTestOutputBuilder()
      );
    }
  }

  builder
    .useValidator(validateNewRepositoryOptions)
    .build(new RepositoryOutputBuilder());
};

export const validateNewRepositoryOptions = async (
  config: Config,
  options: NewRepositoryOptions
) => {
  const { failure } = validateConfig(config, ComponentType.Repository);

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
