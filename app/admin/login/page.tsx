import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 px-6 text-neutral-100">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-neutral-900 p-8">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Portfolio admin</p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
        </div>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            Admin is not configured. Set <code>ADMIN_PASSWORD</code> in your environment (see <code>.env.example</code>) and restart.
          </p>
        )}
      </div>
    </main>
  );
}
