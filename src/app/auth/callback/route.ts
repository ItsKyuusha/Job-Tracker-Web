import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If "next" param is passed, use it, otherwise redirect to /dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user profile exists (some OAuth providers might supply name/picture)
      try {
        const metadata = data.user.user_metadata || {};
        const fullName =
          metadata.full_name || metadata.name || data.user.email?.split("@")[0] || "User";
        const avatarUrl = metadata.avatar_url || metadata.picture || null;

        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch {
        // Non-blocking: database triggers may have already handled this
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to login page with error state
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
