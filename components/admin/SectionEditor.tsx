"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetSection, restoreRevision, saveSection, type SaveResult } from "@/app/admin/actions";
import { SECTION_MAP, type SectionDef } from "@/lib/content-schema";
import type { SectionKey } from "@/lib/data";
import type { Revision } from "@/lib/content";
import FieldInput from "./FieldInput";

type Row = Record<string, unknown> & { _k?: string };

let counter = 0;
const newKey = () => `k${++counter}`;

const blank = (def: SectionDef): Row => ({
  _k: newKey(),
  ...Object.fromEntries(def.fields.map((f) => [f.name, f.kind === "bool" ? false : f.kind === "tags" || f.kind === "lines" ? [] : ""])),
});

const strip = (rows: Row[]) => rows.map(({ _k, ...rest }) => rest);

export default function SectionEditor(props: {
  sectionKey: SectionKey;
  initial: unknown;
  customized: boolean;
  dbReady: boolean;
  revisions: Revision[];
}) {
  const def = SECTION_MAP[props.sectionKey];
  const router = useRouter();

  // The form always edits an array of rows (objects are a one-row array).
  const startRows = useMemo<Row[]>(() => {
    const formVal = def.toForm ? def.toForm(props.initial) : props.initial;
    const arr = def.shape === "object" ? [formVal as Row] : ((formVal ?? []) as Row[]);
    return arr.map((r) => ({ ...r, _k: newKey() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rows, setRows] = useState<Row[]>(startRows);
  const [sel, setSel] = useState(0);
  const baseline = useRef(JSON.stringify(strip(startRows)));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(strip(rows)) !== baseline.current;
  const isList = def.shape === "list";
  const current = rows[Math.min(sel, rows.length - 1)];

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const setField = (name: string, value: unknown) =>
    setRows((rs) => rs.map((r, i) => (i === Math.min(sel, rs.length - 1) ? { ...r, [name]: value } : r)));

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    setRows((rs) => {
      const c = [...rs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
    setSel(j);
  };

  const add = () => {
    setRows((rs) => [...rs, blank(def)]);
    setSel(rows.length);
  };
  const duplicate = (i: number) => {
    setRows((rs) => [...rs.slice(0, i + 1), { ...rs[i], _k: newKey() }, ...rs.slice(i + 1)]);
    setSel(i + 1);
  };
  const remove = (i: number) => {
    if (!confirm(`Delete this ${def.singular}? (You can still discard before saving.)`)) return;
    setRows((rs) => rs.filter((_, k) => k !== i));
    setSel(Math.max(0, i - 1));
  };

  const save = () =>
    startTransition(async () => {
      const payload = def.shape === "object" ? strip(rows)[0] : strip(rows);
      const res = await saveSection(def.key, payload);
      setResult(res);
      if (res.ok) {
        baseline.current = JSON.stringify(strip(rows));
        router.refresh();
      }
    });

  const discard = () => {
    if (!dirty || confirm("Discard all unsaved changes?")) window.location.reload();
  };

  const reload = (res: SaveResult) => {
    setResult(res);
    if (res.ok) setTimeout(() => window.location.reload(), 600);
  };
  const reset = () =>
    confirm("Reset this section to the built-in defaults from lib/data.ts? Your edits are kept in history.") &&
    startTransition(async () => reload(await resetSection(def.key)));
  const restore = (id: string) =>
    confirm("Restore this revision? The current version is kept in history.") &&
    startTransition(async () => reload(await restoreRevision(def.key, id)));

  const label = (r: Row) => String(r[def.titleField ?? ""] || `(new ${def.singular})`);

  return (
    <div className="max-w-5xl space-y-6 pb-28">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{def.title}</h1>
          <span className={`rounded-full px-2 py-0.5 text-[11px] ${props.customized ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-neutral-400"}`}>
            {props.customized ? "Edited" : "Using defaults"}
          </span>
          {def.publicPath && (
            <a href={def.publicPath} target="_blank" rel="noreferrer" className="text-sm text-neutral-400 underline underline-offset-4 hover:text-white">
              View on site ↗
            </a>
          )}
        </div>
        <p className="text-neutral-400">{def.description}</p>
      </header>

      {!props.dbReady && (
        <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          MongoDB is not configured, so you can look around but not save. Set <code>MONGODB_URI</code> and restart.
        </p>
      )}

      <div className={isList ? "grid gap-6 md:grid-cols-[260px_1fr]" : ""}>
        {isList && (
          <div className="space-y-2">
            <ul className="space-y-1.5">
              {rows.map((r, i) => (
                <li key={r._k}>
                  <div className={`flex items-center gap-1 rounded-lg border pr-1 ${i === sel ? "border-rose-400/60 bg-white/5" : "border-white/10 hover:bg-white/5"}`}>
                    <button onClick={() => setSel(i)} className="min-w-0 flex-1 px-3 py-2 text-left">
                      <span className="block truncate text-sm">{label(r)}</span>
                      {def.subtitleField && <span className="block truncate text-xs text-neutral-500">{String(r[def.subtitleField] ?? "")}</span>}
                    </button>
                    <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 text-neutral-500 hover:text-white disabled:opacity-20">↑</button>
                    <button aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 text-neutral-500 hover:text-white disabled:opacity-20">↓</button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={add}
              disabled={rows.length >= (def.maxItems ?? 100)}
              className="w-full rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-neutral-300 hover:border-rose-400/60 hover:text-white disabled:opacity-40"
            >
              + Add {def.singular}
            </button>
          </div>
        )}

        <div className="min-w-0">
          {current ? (
            <div className="space-y-5 rounded-2xl border border-white/10 bg-neutral-900 p-5 md:p-6">
              {def.fields.map((f) => (
                <FieldInput key={`${current._k}-${f.name}`} field={f} value={current[f.name]} onChange={(v) => setField(f.name, v)} />
              ))}
              {isList && (
                <div className="flex gap-4 border-t border-white/10 pt-4 text-sm">
                  <button onClick={() => duplicate(rows.indexOf(current))} className="text-neutral-400 hover:text-white">Duplicate</button>
                  <button onClick={() => remove(rows.indexOf(current))} className="text-rose-400 hover:text-rose-300">Delete</button>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-neutral-500">Nothing here yet. Add the first {def.singular}.</p>
          )}
        </div>
      </div>

      {result && (
        <div role="status" className={`rounded-lg border p-3 text-sm ${result.ok ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200"}`}>
          {result.ok ? result.message : (
            <ul className="list-disc space-y-0.5 pl-5">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </div>
      )}

      <details className="rounded-xl border border-white/10 bg-neutral-900">
        <summary className="cursor-pointer px-4 py-3 text-sm text-neutral-300">History & reset</summary>
        <div className="space-y-4 border-t border-white/10 p-4">
          {props.revisions.length === 0 ? (
            <p className="text-sm text-neutral-500">No saved revisions yet.</p>
          ) : (
            <ul className="divide-y divide-white/10 text-sm">
              {props.revisions.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-neutral-300">
                    {new Date(r.savedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    <span className="ml-2 text-neutral-500">before a {r.action}</span>
                  </span>
                  <button disabled={pending || !props.dbReady} onClick={() => restore(r.id)} className="text-rose-300 hover:text-rose-200 disabled:opacity-40">Restore</button>
                </li>
              ))}
            </ul>
          )}
          {props.customized && (
            <button disabled={pending} onClick={reset} className="text-sm text-neutral-400 underline underline-offset-4 hover:text-white">
              Reset this section to the built-in defaults
            </button>
          )}
        </div>
      </details>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-neutral-950/90 px-5 py-3 backdrop-blur md:left-[250px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <span className="text-sm text-neutral-400">{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <div className="flex gap-2">
            <button onClick={discard} disabled={!dirty || pending} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-40">Discard</button>
            <button onClick={save} disabled={!dirty || pending || !props.dbReady} className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-40">
              {pending ? "Saving…" : "Save & publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
