/**
 * Static HTML + Bootstrap 5 + vanilla JS from FormModel.
 * Field markup aligned with react-generator semantics.
 */

import { buildVanillaWiredSubmitReplacement } from "@formsync/formgen-shared";
import type { FieldModel, FormModel } from "../types";

const AUTO_COMPLETE_MAP: Record<string, string> = {
  name: "name",
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  phone: "tel",
  mobile: "tel",
  password: "current-password",
  newPassword: "new-password",
  street: "street-address",
  city: "address-level2",
  state: "address-level1",
  zip: "postal-code",
  country: "country-name",
  organisation: "organization",
  company: "organization",
};

export interface StaticGeneratorWiring {
  apiBaseUrl: string;
  apiPath: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function collectAllFields(fields: FieldModel[]): FieldModel[] {
  const result: FieldModel[] = [];
  for (const f of fields) {
    if (f.type === "group" && f.children && f.children.length > 0) {
      result.push(...collectAllFields(f.children));
    } else {
      result.push(f);
    }
  }
  return result;
}

function generateBootstrapField(field: FieldModel, domIdByKey: Map<string, string>): string {
  const { id, key, type, label, required, ui } = field;
  const domId = domIdByKey.get(key) ?? id;
  const explicitPlaceholder = ui?.placeholder;
  const computedPlaceholder = explicitPlaceholder ?? `Enter ${label.toLowerCase()}...`;
  const placeholder = type === "date" ? "" : computedPlaceholder;
  const helpText = ui?.helpText;
  const autoComplete = AUTO_COMPLETE_MAP[key] ?? "";

  if (type === "group") {
    const children = field.children || [];
    const inner = children.map((c) => generateBootstrapField(c, domIdByKey)).join("\n");
    return `<fieldset class="border rounded p-3 mb-4">
  <legend class="float-none w-auto px-2 fs-6 fw-semibold">${escapeHtml(label)}</legend>
  ${inner}
</fieldset>`;
  }

  const describedByParts: string[] = [];
  if (helpText) describedByParts.push(`${domId}-help`);
  describedByParts.push(`${domId}-error`);
  const ariaDescribedBy = `aria-describedby="${describedByParts.join(" ")}"`;
  const ariaRequired = required ? `aria-required="true"` : "";
  const autoCompleteAttr = autoComplete ? `autocomplete="${autoComplete}"` : "";

  let control: string;
  switch (type) {
    case "textarea":
      control = `<textarea
          class="form-control"
          name="${escapeHtml(key)}"
          id="${domId}"
          rows="3"
          ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""}
          ${required ? "required" : ""}
          ${ariaRequired}
          ${ariaDescribedBy}
          ${autoCompleteAttr}
        ></textarea>`;
      break;
    case "select": {
      const options = field.constraints?.enum || [];
      control = `<select
          class="form-select"
          name="${escapeHtml(key)}"
          id="${domId}"
          ${required ? "required" : ""}
          ${ariaRequired}
          ${ariaDescribedBy}
          ${autoCompleteAttr}
        >
          <option value="">${escapeHtml(placeholder) || "Select..."}</option>
          ${options.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("\n")}
        </select>`;
      break;
    }
    case "checkbox":
      control = `<input
          class="form-check-input"
          type="checkbox"
          name="${escapeHtml(key)}"
          id="${domId}"
          value="true"
          ${ariaRequired}
          ${ariaDescribedBy}
        />`;
      return `<div class="form-check mb-3">
  ${control}
  <label class="form-check-label" for="${domId}">
    ${escapeHtml(label)}${required ? ' <span class="text-danger" aria-hidden="true">*</span>' : ""}
  </label>
  ${helpText ? `<div id="${domId}-help" class="form-text">${escapeHtml(helpText)}</div>` : ""}
  <div id="${domId}-error" class="invalid-feedback d-block" role="alert"></div>
</div>`;
    default:
      control = `<input
          class="form-control"
          type="${escapeHtml(type)}"
          name="${escapeHtml(key)}"
          id="${domId}"
          ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""}
          ${required ? "required" : ""}
          ${ariaRequired}
          ${ariaDescribedBy}
          ${autoCompleteAttr}
        />`;
  }

  return `<div class="mb-3">
  <label class="form-label" for="${domId}">
    ${escapeHtml(label)}${required ? ' <span class="text-danger" aria-hidden="true">*</span>' : ""}
  </label>
  ${control}
  ${helpText ? `<div id="${domId}-help" class="form-text">${escapeHtml(helpText)}</div>` : ""}
  <div id="${domId}-error" class="invalid-feedback d-block" role="alert"></div>
</div>`;
}

function buildFormBody(formModel: FormModel, domIdByKey: Map<string, string>): string {
  const { fields, layout, submit } = formModel;
  const orderedFields = layout.order
    .map((fid) => fields.find((f) => f.id === fid))
    .filter((f): f is FieldModel => !!f);

  const hasFields = orderedFields.length > 0;
  const submitText = submit?.text || "Submit";
  const submitColor = submit?.color;

  const btnStyle = submitColor ? ` style="background-color:${escapeHtml(submitColor)};border-color:${escapeHtml(submitColor)}"` : "";

  if (!hasFields) {
    return `<p class="text-muted">Form is empty.</p>`;
  }

  if (layout.steps && layout.steps.length > 0) {
    const sections = layout.steps.map((step, stepIdx) => {
      const stepFields = orderedFields.filter(
        (f) => f.stepIndex === stepIdx || f.stepIndex === undefined,
      );
      const inner = stepFields.map((f) => generateBootstrapField(f, domIdByKey)).join("\n");
      return `<div class="card mb-4">
  <div class="card-header fw-semibold"><span class="badge bg-primary me-2">${stepIdx + 1}</span>${escapeHtml(step.title)}</div>
  <div class="card-body">
    ${inner}
  </div>
</div>`;
    });
    return `<form id="main-form" novalidate>
  ${sections.join("\n")}
  <button type="submit" class="btn btn-primary"${btnStyle}>${escapeHtml(submitText)}</button>
</form>`;
  }

  const fieldHtml = orderedFields.map((f) => generateBootstrapField(f, domIdByKey)).join("\n");
  return `<form id="main-form" novalidate>
  ${fieldHtml}
  <button type="submit" class="btn btn-primary"${btnStyle}>${escapeHtml(submitText)}</button>
</form>`;
}

function generateThemeCss(formModel: FormModel): string {
  const { colors, typography, radius } = formModel.theme;
  return `/* Theme derived from FormModel */
:root {
  --bs-primary: ${colors.primary};
  --bs-body-bg: ${colors.background};
  --bs-body-color: ${colors.text};
  --bs-border-color: ${colors.border};
  --fs-form-radius: ${radius}px;
  --fs-font-family: ${typography.fontFamily};
  --fs-base-font-size: ${typography.baseFontSize}px;
}

body {
  font-family: var(--fs-font-family);
  font-size: var(--fs-base-font-size);
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

.form-control:focus {
  border-color: ${colors.primary};
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, ${colors.primary} 25%, transparent);
}
`;
}

function buildFieldIdMapJs(formModel: FormModel): string {
  const orderedFields = formModel.layout.order
    .map((fid) => formModel.fields.find((f) => f.id === fid))
    .filter((f): f is FieldModel => !!f);
  const domIdByKey = new Map<string, string>();
  collectAllFields(orderedFields).forEach((f, i) => {
    domIdByKey.set(f.key, `field_${i + 1}`);
  });
  const allFields = collectAllFields(orderedFields);
  return allFields
    .map((f) => `    '${f.key.replace(/'/g, "\\'")}': '${domIdByKey.get(f.key) ?? f.id}'`)
    .join(",\n");
}

function generateAppJs(
  formModel: FormModel,
  wiring?: StaticGeneratorWiring & { fieldTypesJson: string },
): string {
  const fieldMapLines = buildFieldIdMapJs(formModel);

  const submitBody = wiring
    ? buildVanillaWiredSubmitReplacement({
        serializedFieldTypes: wiring.fieldTypesJson,
        apiBaseUrl: wiring.apiBaseUrl,
        apiPath: wiring.apiPath,
      })
    : `/* FORMSYNC_API_SUBMIT_START */
    console.log("Form submitted:", Object.fromEntries(new FormData(form)));
    /* FORMSYNC_API_SUBMIT_END */`;

  const submitIndented = submitBody
    .split("\n")
    .map((line) => "    " + line)
    .join("\n");

  return `/**
 * Generated by FormSync static-frontend-generator — do not edit by hand.
 */
(function () {
  var form = document.getElementById("main-form");
  if (!form) return;

  var FIELD_ID_MAP = {
${fieldMapLines}
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var data = Object.fromEntries(fd.entries());

    var errs = validate(data);
    var errorKeys = Object.keys(errs);
    if (errorKeys.length > 0) {
      var statusEl = document.getElementById("form-status");
      if (statusEl) {
        statusEl.textContent =
          errorKeys.length === 1
            ? "1 error found. Please review the highlighted field."
            : errorKeys.length + " errors found. Please review the highlighted fields.";
      }
      var firstKey = errorKeys[0];
      var firstId = FIELD_ID_MAP[firstKey];
      if (firstId) {
        var el = document.getElementById(firstId);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    var statusClear = document.getElementById("form-status");
    if (statusClear) statusClear.textContent = "";

${submitIndented}
  });

  function validate(data) {
    var errs = {};
    return errs;
  }
})();
`;
}

export function collectFieldTypeMap(formModel: FormModel): Record<string, string> {
  const map: Record<string, string> = {};
  const walk = (fields: FieldModel[]) => {
    for (const field of fields) {
      map[field.key] = field.type;
      if (field.children && field.children.length > 0) {
        walk(field.children);
      }
    }
  };
  walk(formModel.fields);
  return map;
}

export function generateStaticBootstrapFiles(
  formModel: FormModel,
  wiring?: StaticGeneratorWiring,
): Record<string, string> {
  const wiringWithTypes =
    wiring &&
    ({
      ...wiring,
      fieldTypesJson: JSON.stringify(collectFieldTypeMap(formModel), null, 2),
    } as StaticGeneratorWiring & { fieldTypesJson: string });

  const orderedFields = formModel.layout.order
    .map((fid) => formModel.fields.find((f) => f.id === fid))
    .filter((f): f is FieldModel => !!f);

  const domIdByKey = new Map<string, string>();
  collectAllFields(orderedFields).forEach((f, i) => {
    domIdByKey.set(f.key, `field_${i + 1}`);
  });

  const title = formModel.meta?.title || formModel.name;
  const description = formModel.meta?.description;

  const bodyInner = buildFormBody(formModel, domIdByKey);

  const appJs = generateAppJs(formModel, wiringWithTypes || undefined);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/theme.css" />
</head>
<body>
  <main class="container py-4">
    <div id="form-status" class="text-danger mb-3" role="status" aria-live="polite"></div>
    <h1 class="h3 mb-2">${escapeHtml(title)}</h1>
    ${description ? `<p class="text-muted mb-4">${escapeHtml(description)}</p>` : ""}
    ${bodyInner}
  </main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <script src="js/app.js"></script>
</body>
</html>
`;

  const readme = `# ${escapeHtml(title)} — static form

Generated HTML + Bootstrap 5 + vanilla JavaScript (no build step).

## Run locally

Use any static file server from this folder, for example:

\`\`\`bash
npx serve .
\`\`\`

Then open the printed URL in your browser.

## API wiring

${
    wiring
      ? `This bundle is configured to POST JSON to **${escapeHtml(wiring.apiBaseUrl)}${escapeHtml(wiring.apiPath)}**. Edit \`js/app.js\` if your backend runs elsewhere (ensure CORS allows your origin).`
      : `Wire your backend by replacing the placeholder in \`js/app.js\` between the FORMSYNC markers, or regenerate from FormSync with fullstack export.`
  }
`;

  return {
    "index.html": html,
    "css/theme.css": generateThemeCss(formModel),
    "js/app.js": appJs,
    "README.md": readme,
  };
}
