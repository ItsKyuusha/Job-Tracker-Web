import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MaganghubForm } from "@/features/maganghub/components/maganghub-form";
import { updateMaganghubAction } from "@/features/maganghub/actions";
import type { MaganghubListing } from "@/types/database";
import { ChevronLeft } from "lucide-react";

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("maganghub_listings")
    .select("title, company_name")
    .eq("id", id)
    .single();

  if (!data) return { title: "Edit Lowongan MagangHub — CareerSync" };
  const listing = data as unknown as Pick<MaganghubListing, "title" | "company_name">;
  return {
    title: `Edit ${listing.title} — CareerSync`,
  };
}

export default async function EditMaganghubPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: rawListing } = await supabase
    .from("maganghub_listings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!rawListing) notFound();

  const listing = rawListing as unknown as MaganghubListing;
  const boundAction = updateMaganghubAction.bind(null, id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-3 pb-3 border-b border-border/60">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/maganghub/${id}`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Edit Lowongan MagangHub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {listing.title} &mdash; {listing.company_name}
          </p>
        </div>
      </div>

      <MaganghubForm
        action={boundAction}
        defaultValues={listing}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
