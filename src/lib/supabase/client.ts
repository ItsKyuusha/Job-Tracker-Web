import { createBrowserClient } from "@supabase/ssr";

// Note: Database generic akan ditambahkan setelah generate types dari Supabase
// npx supabase gen types typescript --project-id <id> > src/types/database.gen.ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
