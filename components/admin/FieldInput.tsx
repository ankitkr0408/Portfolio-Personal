"use client";

import { useState } from "react";
import type { Field } from "@/lib/content-schema";

const base =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-rose-400";

// Keeps the raw text locally so typing a comma / pressing Enter is not eaten by parsing.
function ListInput({ field, value, onChange }: { field: Field; value: string[]; onChange: (v: string[]) => void }) {
  const sep = field.kind === "tags" ? ", " : "\n";
  const [text, setText] = useState(() => (value ?? []).join(sep));
  const parse = (t: string) => t.split(field.kind === "tags" ? "," : "\n").map((x) => x.trim()).filter(Boolean);
  const set = (t: string) => {
    setText(t);
    onChange(parse(t));
  };
  return field.kind === "tags" ? (
    <input value={text} onChange={(e) => set(e.target.value)} className={base} placeholder="one, two, three" />
  ) : (
    <textarea value={text} onChange={(e) => set(e.target.value)} rows={Math.max(4, text.split("\n").length + 1)} className={base} />
  );
}

export default function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${field.name}`;
  if (field.kind === "bool") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-rose-500" />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm text-neutral-300">
        {field.label}
        {field.required && <span className="text-rose-400">*</span>}
      </label>
      {field.kind === "tags" || field.kind === "lines" ? (
        <ListInput field={field} value={(value as string[]) ?? []} onChange={onChange} />
      ) : field.kind === "textarea" ? (
        <textarea id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={4} className={base} />
      ) : (
        <input
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          inputMode={field.kind === "email" ? "email" : field.kind === "url" ? "url" : undefined}
          spellCheck={field.kind === "text"}
          className={base}
        />
      )}
      {field.help && <p className="text-xs text-neutral-500">{field.help}</p>}
    </div>
  );
}
