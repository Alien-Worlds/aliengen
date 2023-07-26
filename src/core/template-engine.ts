import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import { walk } from "../utils/files";
import { Config } from "../actions/config";
import {
  camelCase,
  constantCase,
  paramCase,
  pascalCase,
  snakeCase,
} from "change-case";
import { ComponentTemplateModel, TemplateModel } from "../types";
import { ComponentType, WriteMethod } from "../enums";
import {
  AllDefinedHelper,
  CurlyBracesHelper,
  EqHelper,
  GtHelper,
  GteHelper,
  IncludesHelper,
  JoinHelper,
  LtHelper,
  LteHelper,
  NotEmptyHelper,
  NotHelper,
  OrHelper,
  RelativePathHelper,
  RenderHelper,
} from "../template-helpers";
import {
  ComponentTemplatePaths,
  PartialName,
  PartialTemplatePaths,
} from "../templates";

export class TemplateEngine {
  protected templates = new Map<string, Handlebars.TemplateDelegate>();
  constructor(protected config: Config) {
    Handlebars.registerHelper({
      camel_case: camelCase,
      param_case: paramCase,
      pascal_case: pascalCase,
      constant_case: constantCase,
      snake_case: snakeCase,
    });
    Handlebars.registerHelper(RenderHelper.Token, RenderHelper.fn);
    Handlebars.registerHelper(RelativePathHelper.Token, RelativePathHelper.fn);
    Handlebars.registerHelper(CurlyBracesHelper.Token, CurlyBracesHelper.fn);
    Handlebars.registerHelper(NotEmptyHelper.Token, NotEmptyHelper.fn);
    Handlebars.registerHelper(AllDefinedHelper.Token, AllDefinedHelper.fn);
    Handlebars.registerHelper(JoinHelper.Token, JoinHelper.fn);
    Handlebars.registerHelper(IncludesHelper.Token, IncludesHelper.fn);
    Handlebars.registerHelper(EqHelper.Token, EqHelper.fn);
    Handlebars.registerHelper(NotHelper.Token, NotHelper.fn);
    Handlebars.registerHelper(LtHelper.Token, LtHelper.fn);
    Handlebars.registerHelper(LteHelper.Token, LteHelper.fn);
    Handlebars.registerHelper(GtHelper.Token, GtHelper.fn);
    Handlebars.registerHelper(GteHelper.Token, GteHelper.fn);
    Handlebars.registerHelper(OrHelper.Token, OrHelper.fn);
  }

  public generateOutput<ComponentModelType extends ComponentTemplateModel>(
    templatePath: string,
    model: TemplateModel<ComponentModelType>,
    method: WriteMethod,
    filePath?: string,
    marker?: string,
    opts?: Handlebars.RuntimeOptions
  ): string {
    if (method === WriteMethod.Skip) {
      return "";
    }

    if (filePath && method === WriteMethod.Patch) {
      const file = readFileSync(filePath, "utf8");
      return "<<patch>>";
    }

    const tmplpath = path.parse(templatePath);
    const tmpl = readFileSync(path.format(tmplpath), "utf8");
    const compiledTmpl = Handlebars.compile(tmpl);

    return compiledTmpl(model, opts);
  }

  protected getTemplate(templatePath: string): Handlebars.TemplateDelegate {
    if (this.templates.has(templatePath)) {
      return this.templates.get(templatePath);
    }

    const tmpl = readFileSync(templatePath, "utf8");
    const compiledTmpl = Handlebars.compile(tmpl);
    this.templates.set(templatePath, compiledTmpl);

    return compiledTmpl;
  }

  public registerHelper(name: string, helper: (...args: unknown[]) => unknown) {
    Handlebars.registerHelper(name, helper);

    return this;
  }

  public registerTemplate(
    templatePath: string,
    options?: { partial?: boolean; name?: string }
  ) {
    const { name, partial } = options || {};
    const compiledTmpl = this.getTemplate(templatePath);

    if (partial) {
      Handlebars.registerPartial(
        name || path.basename(templatePath, ".partial.hbs"),
        compiledTmpl
      );
    }

    return this;
  }

  public registerPartialTemplate(name: PartialName) {
    return this.registerTemplate(PartialTemplatePaths.getPath(name), {
      partial: true,
      name,
    });
  }

  public registerComponentTemplate(name: ComponentType) {
    return this.registerTemplate(ComponentTemplatePaths.getPath(name), {
      partial: false,
      name,
    });
  }

  public registerTemplates(templatesPath: string) {
    const partialTemplatesDir = path.parse(templatesPath);
    const partialTmpls = walk(path.format(partialTemplatesDir));

    partialTmpls.forEach((partialPath) => {
      this.registerTemplate(partialPath);
    });

    return this;
  }
}
