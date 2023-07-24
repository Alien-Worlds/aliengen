import { Failure, InteractionPrompts, Result } from "../../../../core";
import { ComponentType } from "../../../../enums";
import { Config, validateConfig } from "../../../config";
import { ComponentBuilder } from "../component-builder";
import { NewRepositoryOptions } from "./types";

export const newRepository = async (options: NewRepositoryOptions) => {
  console.log(options);
  if (options.include.includes("all")) {
    options.include = [
      ComponentType.RepositoryFactory,
      ComponentType.Mapper,
      ComponentType.DataSource,
    ];

    if (options.impl) {
      options.include.push(ComponentType.RepositoryImpl);

      if (!options.skipTests) {
        options.include.push(ComponentType.RepositoryImplUnitTest);
        options.include.push(ComponentType.RepositoryFactoryUnitTest);
      }
    }
  } else {
    options.include.push(ComponentType.RepositoryFactory);

    if (!options.skipTests) {
      options.include.push(ComponentType.RepositoryFactoryUnitTest);
    }

    if (options.impl) {
      options.include.push(ComponentType.RepositoryImpl);

      if (!options.skipTests) {
        options.include.push(ComponentType.RepositoryImplUnitTest);
      }
    }
  }

  const builder = new ComponentBuilder(options);
  builder.build(ComponentType.Repository, validateNewRepositoryOptions);
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
