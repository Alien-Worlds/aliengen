import Handlebars from "handlebars";
import config from "../../../config";
import path from "path";
import { readFileSync } from "fs";
import { walk } from "../utils/files";

export default class TemplateEngine {
    public static GenerateTemplateOutput(templateName: string, data?: Object, opts?: Handlebars.RuntimeOptions): string {
        const tmplpath = path.parse(path.join(process.cwd(), config.templatesDir, templateName));
        const tmpl = readFileSync(path.format(tmplpath), "utf8");

        const compiledTmpl = Handlebars.compile(tmpl);

        return compiledTmpl(data, opts);
    }
};

export const registerTemplates = function (): void {
    const partialTemplatesDir = path.parse(path.join(process.cwd(), config.templatesDir, 'partials'));
    const partialTmpls = walk(path.format(partialTemplatesDir));

    partialTmpls.forEach(partialTmpl => {
        const tmpl = readFileSync(partialTmpl, "utf8");
        Handlebars.registerPartial(path.basename(partialTmpl, '.hbs'), Handlebars.compile(tmpl));
    })
};

registerTemplates();
