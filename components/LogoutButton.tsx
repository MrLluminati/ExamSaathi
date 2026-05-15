"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type LogoutButtonProps = {
  lang: string;
};

export default function LogoutButton({ lang }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    window.location.href = `/${lang}/login`;
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoading}
      className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-60"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
