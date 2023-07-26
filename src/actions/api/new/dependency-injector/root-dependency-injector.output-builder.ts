import { ComponentType } from "../../../../enums";
import { PartialName } from "../../../../templates";
import { GeneratedOutput } from "../../../../types";
import { DependencyInjectorOutputBuilder } from "./dependency-injector.output-builder";

export class RootDependencyInjectorOutputBuilder extends DependencyInjectorOutputBuilder {
  constructor() {
    super(ComponentType.RootDependencyInjector);
  }

  public registerTemplates() {
    this.templateEngine
      .registerPartialTemplate(PartialName.Import)
      .registerPartialTemplate(PartialName.Imports)
      .registerPartialTemplate(PartialName.DependencyInjector)
      .registerComponentTemplate(ComponentType.DependencyInjector);
  }

  public async build(): Promise<GeneratedOutput[]> {
    const outputs = await super.build();
    /*
     In the constructor we used RootDependencyInjector to generate the appropriate path to the file.
     After that we restore the original value for consistency.
     */
    outputs.forEach((output) => {
      output.type = ComponentType.DependencyInjector;
    });

    return outputs;
  }
}
