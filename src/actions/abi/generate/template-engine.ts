import Handlebars from "handlebars";
import config from "../../../config";
import path from "path";
import { readFileSync } from "fs";

export default class TemplateEngine {
    public static GenerateTemplateOutput(templateName: string, data?: Object, opts?: Handlebars.RuntimeOptions): string {
        const tmplpath = path.parse(path.join(process.cwd(), config.templatesDir, templateName));
        const tmpl = readFileSync(path.format(tmplpath), "utf8");

        const compiledTmpl = Handlebars.compile(tmpl);

        return compiledTmpl(data, opts);
    }
};
