import { NextResponse } from "next/server";
import { createSupabaseAuthClient } from "@/lib/supabase-auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/en/dashboard";

  if (code) {
    const supabase = await createSupabaseAuthClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email,
            name:
              typeof user.user_metadata?.full_name === "string"
                ? user.user_metadata.full_name
                : null,
          },
          {
            onConflict: "id",
          }
        );
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
