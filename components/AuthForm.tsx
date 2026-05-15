"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type AuthFormProps = {
  lang: string;
};

export default function AuthForm({ lang }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function getRedirectUrl() {
    return `${window.location.origin}/auth/callback?next=/${lang}/dashboard`;
  }

  async function loginWithGoogle() {
    setIsLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  }

  async function loginWithMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link sent. Please check your email inbox.");
      setEmail("");
    }

    setIsLoading(false);
  }

  return (
    <div className="mt-6 max-w-md rounded-2xl border border-slate-200 p-5 shadow-sm">
      <button
        type="button"
        onClick={loginWithGoogle}
        disabled={isLoading}
        className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase text-slate-400">
          or
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={loginWithMagicLink} className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          Email address
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="student@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Send Magic Link
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
