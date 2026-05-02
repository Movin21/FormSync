import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

export class TemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }

  private registerHelpers() {
    handlebars.registerHelper("toPascalCase", (str: string) => {
      return (str || "")
        .replace(/[_-]+/g, " ")
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");
    });

    handlebars.registerHelper("toCamelCase", (str: string) => {
      const pascal = (str || "")
        .replace(/[_-]+/g, " ")
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");
      return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : "";
    });

    handlebars.registerHelper("toKebabCase", (str: string) => {
      return (str || "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[_\s]+/g, "-")
        .replace(/[^\w-]/g, "")
        .toLowerCase()
        .replace(/^-+|-+$/g, "");
    });

    // Used in test templates — renders a JS literal value for the field
    // Expects `this` to be a FieldDescriptor with a pre-computed `testValue` string property.
    // The template accesses it directly as {{{testValue}}}, so no helper needed for that path.
    // This helper is kept for any template that calls testValue with explicit args.
    handlebars.registerHelper("testValueFor", (...args: any[]) => {
      const [type, format, min, max, minLen, maxLen, enumVals, examples] = args;
      return computeJsLiteral({
        type,
        format,
        minimum: min,
        maximum: max,
        minLength: minLen,
        maxLength: maxLen,
        enum: enumVals,
        examples,
      });
    });
  }

  private loadTemplates() {
    const candidateDirs = [
      path.resolve(__dirname, "../templates"),
      path.resolve(__dirname, "../../src/templates"),
    ];
    const templatesDir = candidateDirs.find((dir) => fs.existsSync(dir));

    if (!templatesDir) {
      throw new Error("Templates directory not found");
    }

    this.loadTemplate(
      "package-json",
      path.join(templatesDir, "package-json.hbs"),
    );
    this.loadTemplate("server-js", path.join(templatesDir, "server-js.hbs"));
    this.loadTemplate("route-js", path.join(templatesDir, "route-js.hbs"));
    this.loadTemplate(
      "controller-js",
      path.join(templatesDir, "controller-js.hbs"),
    );
    this.loadTemplate("service-js", path.join(templatesDir, "service-js.hbs"));
    this.loadTemplate("readme", path.join(templatesDir, "readme.hbs"));
    this.loadTemplate("route-test", path.join(templatesDir, "route-test.hbs"));
    this.loadTemplate(
      "service-test",
      path.join(templatesDir, "service-test.hbs"),
    );
  }

  private loadTemplate(name: string, filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Template not found: ${filePath}`);
    }
    const source = fs.readFileSync(filePath, "utf-8");
    this.templates.set(name, handlebars.compile(source));
  }

  public render(templateName: string, data: any): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }
    return template(data);
  }
}

/**
 * Derives a JS literal string (e.g. `"test@example.com"` or `25`) from a
 * JSON Schema field definition.  Used by NodeBackendGenerator to pre-compute
 * the `testValue` property on each FieldDescriptor so templates can simply
 * write `{{{testValue}}}`.
 */
export function computeJsLiteral(def: any, fieldName = "field"): string {
  const examples: any[] =
    def.examples || (def.example != null ? [def.example] : []);

  if (examples.length > 0) {
    const ex = examples[0];
    if (typeof ex === "string") return `"${ex}"`;
    if (typeof ex === "number" || typeof ex === "boolean") return String(ex);
  }

  if (def.type === "boolean") return "true";

  if (def.type === "integer" || def.type === "number") {
    const min = def.minimum ?? 0;
    const max = def.maximum;
    if (max !== undefined) {
      const mid = Math.floor((Number(min) + Number(max)) / 2);
      return String(Math.max(Number(min), mid));
    }
    return String(Math.max(1, Number(min || 1)));
  }

  if (def.type === "array") return "[]";

  // String variants
  if (def.format === "email") return '"test@example.com"';
  if (def.format === "date") return '"2024-01-15"';
  if (def.format === "date-time") return '"2024-01-15T10:00:00.000Z"';
  if (def.format === "uri" || def.format === "url")
    return '"https://example.com"';

  if (Array.isArray(def.enum) && def.enum.length > 0) return `"${def.enum[0]}"`;

  // Plain string — respect length constraints
  const minLen = def.minLength || 1;
  const maxLen = def.maxLength || 50;
  const targetLen = Math.min(maxLen, Math.max(minLen, 8));
  const base = `test-${fieldName}`.slice(0, targetLen).padEnd(minLen, "x");
  return `"${base}"`;
}
