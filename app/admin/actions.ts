"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  adminConfigured,
  checkPassword,
  createSessionToken,
} from "@/lib/admin/auth";
import { requireAdmin } from "@/lib/admin/session";
import { CONTENT_TAG, getRevisionValue, resetSectionValue, saveSectionValue } from "@/lib/content";
import { SECTION_MAP, isSectionKey, validateSection } from "@/lib/content-schema";
import { hasDb } from "@/lib/mongo";

/* ---------------- login / logout ---------------- */

// Best-effort brute-force guard (per server instance). The password should be long anyway.
const attempts = new Map<string, { n: number; first: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Admin is not configured: set ADMIN_PASSWORD in the environment." };

  const h = headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.first > WINDOW) attempts.delete(ip);
  const cur = attempts.get(ip);
  if (cur && cur.n >= MAX_ATTEMPTS) return { error: "Too many attempts. Try again in 15 minutes." };

  const ok = await checkPassword(String(formData.get("password") ?? ""));
  if (!ok) {
    attempts.set(ip, { n: (cur?.n ?? 0) + 1, first: cur?.first ?? now });
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "Wrong password." };
  }
  attempts.delete(ip);

  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------------- content ---------------- */

export type SaveResult = { ok: true; message: string } | { ok: false; errors: string[] };

function publish() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout"); // purge every statically rendered page that reads the content
}

const NO_DB: SaveResult = {
  ok: false,
  errors: ["MongoDB is not configured. Set MONGODB_URI (and restart) to save changes."],
};

export async function saveSection(key: string, form: unknown): Promise<SaveResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, errors: ["Unknown section"] };
  if (!hasDb()) return NO_DB;

  const result = validateSection(SECTION_MAP[key], form);
  if (!result.ok) return result;
  try {
    await saveSectionValue(key, result.value);
  } catch (e) {
    console.error("[admin] save failed", e);
    return { ok: false, errors: ["Could not reach MongoDB. Check MONGODB_URI and your Atlas network access."] };
  }
  publish();
  return { ok: true, message: "Saved. The live site is updated." };
}

export async function resetSection(key: string): Promise<SaveResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, errors: ["Unknown section"] };
  if (!hasDb()) return NO_DB;
  try {
    await resetSectionValue(key);
  } catch (e) {
    console.error("[admin] reset failed", e);
    return { ok: false, errors: ["Could not reach MongoDB."] };
  }
  publish();
  return { ok: true, message: "Reset to the built-in defaults." };
}

export async function restoreRevision(key: string, revisionId: string): Promise<SaveResult> {
  await requireAdmin();
  if (!isSectionKey(key)) return { ok: false, errors: ["Unknown section"] };
  if (!hasDb()) return NO_DB;
  try {
    const value = await getRevisionValue(key, revisionId);
    if (value === undefined) return { ok: false, errors: ["That revision no longer exists."] };
    await saveSectionValue(key, value, "restore");
  } catch (e) {
    console.error("[admin] restore failed", e);
    return { ok: false, errors: ["Could not reach MongoDB."] };
  }
  publish();
  return { ok: true, message: "Revision restored." };
}
