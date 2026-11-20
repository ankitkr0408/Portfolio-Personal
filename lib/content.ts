import "server-only";
import { unstable_cache } from "next/cache";
import { defaultContent, type SectionKey, type SiteContent } from "./data";
import type { ObjectId } from "mongodb";
import { getDb, hasDb } from "./mongo";

export const CONTENT_TAG = "site-content";
export const SECTION_KEYS = Object.keys(defaultContent) as SectionKey[];

type SectionDoc = { _id: SectionKey; value: unknown; updatedAt: Date };
type HistoryDoc = { key: SectionKey; value: unknown; savedAt: Date; action: string };
export type Revision = { id: string; savedAt: string; action: string };

async function readOverrides(): Promise<Partial<Record<SectionKey, SectionDoc>>> {
  const db = await getDb();
  const docs = await db.collection<SectionDoc>("sections").find({}).toArray();
  return Object.fromEntries(docs.map((d) => [d._id, d]));
}

async function loadContent(): Promise<SiteContent> {
  const overrides = await readOverrides();
  const merged: Record<string, unknown> = { ...defaultContent };
  for (const key of SECTION_KEYS) {
    const doc = overrides[key];
    if (doc && doc.value !== undefined && doc.value !== null) merged[key] = doc.value;
  }
  return merged as SiteContent;
}

// Cached across requests; the admin calls revalidateTag(CONTENT_TAG) after every save.
// The hourly revalidate is a safety net for edits made directly in Atlas.
const cached = unstable_cache(loadContent, ["site-content-v1"], { tags: [CONTENT_TAG], revalidate: 3600 });

/** What the public site renders. Falls back to the defaults in lib/data.ts. */
export async function getContent(): Promise<SiteContent> {
  if (!hasDb()) return defaultContent;
  try {
    return await cached();
  } catch (e) {
    console.error("[content] MongoDB read failed, serving defaults:", e);
    return defaultContent;
  }
}

/* ---------------- admin-only helpers (never cached) ---------------- */

export type SectionStatus = { key: SectionKey; customized: boolean; updatedAt: string | null };

export async function getSectionStatuses(): Promise<SectionStatus[]> {
  let overrides: Partial<Record<SectionKey, SectionDoc>> = {};
  if (hasDb()) overrides = await readOverrides();
  return SECTION_KEYS.map((key) => ({
    key,
    customized: Boolean(overrides[key]),
    updatedAt: overrides[key]?.updatedAt?.toISOString() ?? null,
  }));
}

/** Current value for the editor, straight from the DB (not the cache). */
export async function getSectionValue<K extends SectionKey>(key: K): Promise<{ value: SiteContent[K]; customized: boolean }> {
  if (hasDb()) {
    const doc = await (await getDb()).collection<SectionDoc>("sections").findOne({ _id: key });
    if (doc && doc.value != null) return { value: doc.value as SiteContent[K], customized: true };
  }
  return { value: defaultContent[key], customized: false };
}

const HISTORY_LIMIT = 25;

export async function saveSectionValue(key: SectionKey, value: unknown, action = "save"): Promise<void> {
  const db = await getDb();
  const sections = db.collection<SectionDoc>("sections");
  const history = db.collection<HistoryDoc>("history");
  // Snapshot what is being replaced so every change can be undone.
  const prev = await sections.findOne({ _id: key });
  await history.insertOne({ key, value: prev ? prev.value : defaultContent[key], savedAt: new Date(), action });
  await sections.updateOne({ _id: key }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
  const old = await history.find({ key }).sort({ savedAt: -1 }).skip(HISTORY_LIMIT).project({ _id: 1 }).toArray();
  if (old.length) await history.deleteMany({ _id: { $in: old.map((o) => o._id) } });
}

/** Remove the override so the section falls back to lib/data.ts defaults. */
export async function resetSectionValue(key: SectionKey): Promise<void> {
  const db = await getDb();
  const prev = await db.collection<SectionDoc>("sections").findOne({ _id: key });
  if (!prev) return;
  await db.collection<HistoryDoc>("history").insertOne({ key, value: prev.value, savedAt: new Date(), action: "reset to defaults" });
  await db.collection<SectionDoc>("sections").deleteOne({ _id: key });
}

export async function listRevisions(key: SectionKey): Promise<Revision[]> {
  if (!hasDb()) return [];
  const rows = await (await getDb()).collection<HistoryDoc & { _id: ObjectId }>("history").find({ key }).sort({ savedAt: -1 }).limit(10).toArray();
  return rows.map((r) => ({ id: String(r._id), savedAt: (r.savedAt as Date).toISOString(), action: String(r.action ?? "save") }));
}

export async function getRevisionValue(key: SectionKey, id: string): Promise<unknown | undefined> {
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return undefined;
  const row = await (await getDb()).collection<HistoryDoc & { _id: ObjectId }>("history").findOne({ _id: new ObjectId(id), key });
  return row?.value;
}
