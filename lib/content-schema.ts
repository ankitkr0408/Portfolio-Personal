// Describes every editable section: used by the admin forms (client) and by the server
// action that validates before anything is written to MongoDB. No server-only imports.
import type { SectionKey } from "./data";

export type FieldKind = "text" | "textarea" | "url" | "email" | "slug" | "tags" | "lines" | "bool";

export type Field = {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
  placeholder?: string;
  max?: number;
};

export type SectionDef = {
  key: SectionKey;
  title: string;
  singular: string;
  description: string;
  shape: "object" | "list";
  fields: Field[];
  titleField?: string; // shown as the row label in list editors
  subtitleField?: string;
  uniqueField?: string; // e.g. slug
  publicPath?: string; // "View on site"
  maxItems?: number;
  // Sections stored as plain arrays/records are mapped to a list of objects for the form.
  toForm?: (stored: unknown) => unknown;
  fromForm?: (form: unknown) => unknown;
};

type Row = Record<string, unknown>;

const stringList = (label: string, placeholder: string): Field[] => [
  { name: "value", label, kind: "text", required: true, placeholder },
];

export const SECTIONS: SectionDef[] = [
  {
    key: "profile",
    title: "Profile & contact",
    singular: "profile",
    description: "Your name, headline and contact links. Used on the home page, footer, dock, chat bot and SEO.",
    shape: "object",
    publicPath: "/",
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "role", label: "Role / headline", kind: "text", required: true },
      { name: "pitch", label: "One-line pitch", kind: "textarea", max: 300 },
      { name: "photo", label: "Photo", kind: "url", help: "A path in /public (e.g. /ankit.jpg) or a full URL." },
      { name: "email", label: "Email", kind: "email", required: true },
      { name: "phone", label: "Phone", kind: "text" },
      { name: "location", label: "Location", kind: "text" },
      { name: "github", label: "GitHub handle", kind: "text", required: true, help: "Handle only, no URL." },
      { name: "githubUrl", label: "GitHub URL", kind: "url" },
      { name: "linkedin", label: "LinkedIn URL", kind: "url", help: "The chat bot hides LinkedIn while this still contains 'your-handle'." },
      { name: "instagram", label: "Instagram URL", kind: "url" },
      { name: "instagramHandle", label: "Instagram handle", kind: "text" },
    ],
  },
  {
    key: "projects",
    title: "Projects",
    singular: "project",
    description: "Projects shown on /projects and the home page. Featured ones appear in 'Selected work'.",
    shape: "list",
    titleField: "title",
    subtitleField: "slug",
    uniqueField: "slug",
    publicPath: "/projects",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "slug", label: "Slug (URL)", kind: "slug", required: true, help: "Lowercase letters, numbers and dashes. Changing it breaks old links." },
      { name: "blurb", label: "Short description", kind: "textarea", required: true, max: 400 },
      { name: "tags", label: "Tags", kind: "tags", help: "Comma separated." },
      { name: "href", label: "Project link", kind: "url", help: "Use # when there is no public link." },
      { name: "featured", label: "Featured on the home page", kind: "bool" },
    ],
  },
  {
    key: "caseStudies",
    title: "Case studies",
    singular: "case study",
    description: "Client results shown on /impact and the home page. The first three appear on the home page.",
    shape: "list",
    titleField: "client",
    subtitleField: "slug",
    uniqueField: "slug",
    publicPath: "/impact",
    fields: [
      { name: "client", label: "Client", kind: "text", required: true, placeholder: "Astrabite — astrabite.com" },
      { name: "slug", label: "Slug (URL)", kind: "slug", required: true },
      { name: "highlight", label: "Highlighted phrase", kind: "text", help: "Short phrase from the outcome that gets the highlighter." },
      { name: "underline", label: "Underlined phrase", kind: "text", help: "Short phrase from the 'built' text that gets underlined." },
      { name: "before", label: "Before", kind: "textarea", required: true },
      { name: "built", label: "What I built", kind: "textarea", required: true },
      { name: "outcome", label: "Outcome", kind: "textarea", required: true },
      { name: "tags", label: "Tags", kind: "tags" },
      { name: "href", label: "Live site", kind: "url", help: "Leave empty if there is none." },
    ],
  },
  {
    key: "experience",
    title: "Experience",
    singular: "role",
    description: "Jobs and internships, newest first. Mark the current one; the chat bot uses it.",
    shape: "list",
    titleField: "company",
    subtitleField: "role",
    publicPath: "/experience",
    fields: [
      { name: "company", label: "Company", kind: "text", required: true },
      { name: "role", label: "Role", kind: "text", required: true },
      { name: "period", label: "Period", kind: "text", required: true, placeholder: "Jan 2026 – Present" },
      { name: "place", label: "Place", kind: "text" },
      { name: "current", label: "Current role", kind: "bool" },
      { name: "points", label: "Highlights", kind: "lines", help: "One per line." },
    ],
  },
  {
    key: "services",
    title: "Services",
    singular: "service",
    description: "What you sell. Each service gets its own page at /services/<slug>.",
    shape: "list",
    titleField: "title",
    subtitleField: "slug",
    uniqueField: "slug",
    publicPath: "/services",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "slug", label: "Slug (URL)", kind: "slug", required: true },
      { name: "blurb", label: "Short description", kind: "textarea", required: true, max: 300 },
      { name: "intro", label: "Intro", kind: "textarea" },
      { name: "offers", label: "What you offer", kind: "lines", help: "One per line." },
      { name: "proof", label: "Proof", kind: "textarea" },
    ],
  },
  {
    key: "hats",
    title: "Three hats",
    singular: "hat",
    description: "The 'Build. Automate. Run.' cards on the home page.",
    shape: "list",
    titleField: "hat",
    subtitleField: "verb",
    publicPath: "/#hats",
    maxItems: 6,
    fields: [
      { name: "hat", label: "Hat", kind: "text", required: true },
      { name: "verb", label: "Verb", kind: "text", required: true },
      { name: "text", label: "Description", kind: "textarea", required: true },
      { name: "proof", label: "Proof point", kind: "text" },
    ],
  },
  {
    key: "workflow",
    title: "How I work",
    singular: "step",
    description: "The numbered process steps (Audit, Automate, Ship, Own it).",
    shape: "list",
    titleField: "title",
    subtitleField: "step",
    publicPath: "/freelance",
    maxItems: 8,
    fields: [
      { name: "step", label: "Step number", kind: "text", required: true, placeholder: "01" },
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "text", label: "Description", kind: "textarea", required: true },
    ],
  },
  {
    key: "freelanceFacts",
    title: "Freelance facts",
    singular: "fact",
    description: "Engagement length, working style and timezone. Shown on /freelance and used by the chat bot (keep these three labels).",
    shape: "list",
    titleField: "label",
    subtitleField: "value",
    publicPath: "/freelance",
    maxItems: 6,
    fields: [
      { name: "label", label: "Label", kind: "text", required: true, help: "The bot looks up: Typical engagement, Working style, Timezone." },
      { name: "value", label: "Value", kind: "text", required: true },
    ],
  },
  {
    key: "skills",
    title: "Skills",
    singular: "skill group",
    description: "Skill groups on /skills. The chat bot answers 'does he know X?' from these.",
    shape: "list",
    titleField: "name",
    publicPath: "/skills",
    fields: [
      { name: "name", label: "Group name", kind: "text", required: true },
      { name: "items", label: "Skills", kind: "tags", required: true, help: "Comma separated." },
    ],
    toForm: (v) => Object.entries((v ?? {}) as Record<string, string[]>).map(([name, items]) => ({ name, items })),
    fromForm: (f) => Object.fromEntries((f as Row[]).map((r) => [String(r.name), r.items as string[]])),
  },
  {
    key: "sites",
    title: "Live sites",
    singular: "site",
    description: "Domains you have shipped, listed on /skills.",
    shape: "list",
    titleField: "value",
    publicPath: "/skills",
    fields: stringList("Domain", "example.com"),
    toForm: (v) => ((v ?? []) as string[]).map((value) => ({ value })),
    fromForm: (f) => (f as Row[]).map((r) => String(r.value)),
  },
  {
    key: "impact",
    title: "Impact & mentoring",
    singular: "event",
    description: "Hackathons, workshops and talks on /impact.",
    shape: "list",
    titleField: "title",
    subtitleField: "date",
    publicPath: "/mentoring",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "tag", label: "Tag", kind: "text", required: true, placeholder: "JUDGE / MENTOR / WORKSHOP" },
      { name: "date", label: "Date", kind: "text", placeholder: "MAR 2026" },
      { name: "org", label: "Organisation", kind: "text" },
      { name: "blurb", label: "Description", kind: "textarea" },
      { name: "photo", label: "Photo", kind: "url", help: "Path in /public or a full URL." },
    ],
  },
  {
    key: "linkedinPosts",
    title: "LinkedIn testimonials",
    singular: "post",
    description: "Student / client posts shown as social proof. Replace the demo ones with real post URLs.",
    shape: "list",
    titleField: "author",
    publicPath: "/mentoring",
    fields: [
      { name: "author", label: "Author", kind: "text", required: true },
      { name: "text", label: "Quote", kind: "textarea", required: true },
      { name: "url", label: "Post URL", kind: "url", required: true },
    ],
  },
  {
    key: "brandNames",
    title: "Brand names (SEO)",
    singular: "brand name",
    description: "Handles used as alternate names and keywords in search results.",
    shape: "list",
    titleField: "value",
    fields: stringList("Handle / name", "ankit.aitalks"),
    toForm: (v) => ((v ?? []) as string[]).map((value) => ({ value })),
    fromForm: (f) => (f as Row[]).map((r) => String(r.value)),
  },
];

export const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.key, s])) as Record<SectionKey, SectionDef>;
export const isSectionKey = (k: string): k is SectionKey => k in SECTION_MAP;

/* ---------------- validation ---------------- */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Only http(s), mailto/tel, in-site paths and '#': never javascript:/data: (these end up in href attributes).
const URL_OK = /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|\/(?!\/)[^\s]*|#[^\s]*)$/i;
export const DEFAULT_MAX = 500;

function cleanText(v: unknown): string {
  return typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "";
}

function toList(v: unknown, kind: "tags" | "lines"): string[] {
  const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split(kind === "tags" ? "," : "\n") : [];
  return arr.map((x) => cleanText(x)).filter(Boolean);
}

export type ValidationResult = { ok: true; value: unknown } | { ok: false; errors: string[] };

function validateRow(def: SectionDef, raw: unknown, label: string, errors: string[]): Row {
  const src = (raw && typeof raw === "object" ? raw : {}) as Row;
  const out: Row = {};
  for (const f of def.fields) {
    const where = `${label} → ${f.label}`;
    const v = src[f.name];
    if (f.kind === "bool") {
      out[f.name] = v === true;
      continue;
    }
    if (f.kind === "tags" || f.kind === "lines") {
      const list = toList(v, f.kind);
      if (f.required && !list.length) errors.push(`${where} is required`);
      if (list.length > 60 || list.some((x) => x.length > 400)) errors.push(`${where} is too long`);
      out[f.name] = list;
      continue;
    }
    const s = cleanText(v);
    if (f.required && !s) errors.push(`${where} is required`);
    if (s.length > (f.max ?? (f.kind === "textarea" ? 2000 : DEFAULT_MAX))) errors.push(`${where} is too long`);
    if (s) {
      if (f.kind === "slug" && !SLUG.test(s)) errors.push(`${where} must be lowercase letters, numbers and dashes`);
      if (f.kind === "email" && !EMAIL.test(s)) errors.push(`${where} is not a valid email`);
      if (f.kind === "url" && !URL_OK.test(s)) errors.push(`${where} must start with https://, /, # or mailto:`);
    }
    out[f.name] = s;
  }
  return out;
}

/** Validates + normalises the form value and maps it back to the stored shape. */
export function validateSection(def: SectionDef, form: unknown): ValidationResult {
  const errors: string[] = [];
  let stored: unknown;

  if (def.shape === "object") {
    stored = validateRow(def, form, def.singular, errors);
  } else {
    if (!Array.isArray(form)) return { ok: false, errors: ["Invalid data"] };
    if (form.length > (def.maxItems ?? 100)) errors.push(`At most ${def.maxItems ?? 100} items allowed`);
    const rows = form.map((r, i) => {
      const named = r && typeof r === "object" ? cleanText((r as Row)[def.titleField ?? ""]) : "";
      return validateRow(def, r, `${def.singular} #${i + 1}${named ? ` (${named})` : ""}`, errors);
    });
    if (def.uniqueField) {
      const seen = new Set<string>();
      for (const r of rows) {
        const u = String(r[def.uniqueField] ?? "");
        if (u && seen.has(u)) errors.push(`Duplicate ${def.uniqueField}: "${u}"`);
        seen.add(u);
      }
    }
    if (def.key === "skills") {
      const names = rows.map((r) => String(r.name));
      if (new Set(names).size !== names.length) errors.push("Skill group names must be unique");
      if (names.some((n) => ["__proto__", "constructor", "prototype"].includes(n))) errors.push("Invalid group name");
    }
    stored = def.fromForm ? def.fromForm(rows) : rows;
  }
  return errors.length ? { ok: false, errors } : { ok: true, value: stored };
}
