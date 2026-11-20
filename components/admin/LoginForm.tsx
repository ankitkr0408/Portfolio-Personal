"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60">
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-neutral-400">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 outline-none focus:border-rose-400"
        />
      </label>
      {state.error && <p role="alert" className="text-sm text-rose-300">{state.error}</p>}
      <Submit />
    </form>
  );
}
