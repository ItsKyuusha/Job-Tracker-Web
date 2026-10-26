import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MaganghubContainer } from "@/features/maganghub/components/maganghub-container";
import type { MaganghubListItem } from "@/features/maganghub/types";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Riset MagangHub — CareerSync",
};

type SearchParams = Promise<{
  search?: string;
  sort?: string;
  page?: string;
}>;

export default async function MaganghubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const p = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sortBy = p.sort ?? "created_at";

  // ── Build query ─────────────────────────────────────────────────────────────
  let query = supabase
    .from("maganghub_listings")
    .select(
      "id, title, company_name, location, allowance, work_days, source_url, created_at"
    )
    .eq("user_id", user.id);

  // Text search
  if (p.search) {
    query = query.or(
      `title.ilike.%${p.search}%,company_name.ilike.%${p.search}%`
    );
  }

  // Sort
  if (sortBy === "company_name") {
    query = query.order("company_name", { ascending: true });
  } else if (sortBy === "allowance") {
    query = query.order("allowance", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: rawListings } = await query;
  const listings = (rawListings ?? []) as unknown as MaganghubListItem[];

  const hasSearchOrFilter = Boolean(p.search || (p.sort && p.sort !== "created_at"));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Riset Lowongan MagangHub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {listings.length} lowongan tersimpan &mdash; wadah riset &amp; pembanding lowongan magang
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 text-xs font-semibold gap-1.5 shadow-xs bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0"
        >
          <Link href="/maganghub/new">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Lowongan</span>
          </Link>
        </Button>
      </div>

      <MaganghubContainer
        listings={listings}
        hasSearchOrFilter={hasSearchOrFilter}
      />
    </div>
  );
}
