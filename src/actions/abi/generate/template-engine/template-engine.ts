import { camelCase, constantCase, paramCase, pascalCase } from "change-case";

import Handlebars from "handlebars";
import config from "../../../../config";
import path from "path";
import { readFileSync } from "fs";
import { walk } from "../../utils/files";
import {
  buildMappingFromEntity,
  buildMappingToEntity,
} from "./helpers/mapper.helpers";

export default class TemplateEngine {
  public static GenerateTemplateOutput(
    templateName: string,
    data?: Object,
    opts?: Handlebars.RuntimeOptions
  ): string {
    const tmplpath = path.parse(
      path.join(process.cwd(), config.templatesDir, templateName)
    );
    const tmpl = readFileSync(path.format(tmplpath), "utf8");

    const compiledTmpl = Handlebars.compile(tmpl);

    return compiledTmpl(data, opts);
  }
}

function registerHelpers(): void {
  Handlebars.registerHelper("upperCase", function (value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return "";
  });

  Handlebars.registerHelper("eq", function (value1, value2) {
    if (
      value1 &&
      value2 &&
      typeof value1 === "string" &&
      typeof value2 === "string"
    ) {
      return value1 === value2;
    }
  });

  Handlebars.registerHelper("dateTimeNow", () => new Date().toUTCString());

  Handlebars.registerHelper({
    camelCase,
    paramCase,
    pascalCase,
    constantCase,
  });
  // mapper helpers
  Handlebars.registerHelper({
    buildMappingFromEntity,
    buildMappingToEntity,
  });
}

function registerTemplates(): void {
  const partialTemplatesDir = path.parse(
    path.join(process.cwd(), config.templatesDir, "partials")
  );
  const partialTmpls = walk(path.format(partialTemplatesDir));

  partialTmpls.forEach((partialTmpl) => {
    const tmpl = readFileSync(partialTmpl, "utf8");
    Handlebars.registerPartial(
      path.basename(partialTmpl, ".hbs"),
      Handlebars.compile(tmpl)
    );
  });
}

registerHelpers();
registerTemplates();
