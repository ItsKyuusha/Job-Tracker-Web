import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteMaganghubButton } from "@/features/maganghub/components/delete-maganghub-button";
import { formatDate, getCompanyGradient } from "@/lib/utils";
import type { MaganghubListing } from "@/types/database";
import {
  ChevronLeft,
  Pencil,
  MapPin,
  Banknote,
  Clock,
  ExternalLink,
  FileText,
  Building2,
  BookOpen,
  Users,
} from "lucide-react";

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

  if (!data) return { title: "Detail Lowongan MagangHub — CareerSync" };
  const listing = data as unknown as Pick<MaganghubListing, "title" | "company_name">;
  return {
    title: `${listing.title} di ${listing.company_name} — CareerSync`,
  };
}

function formatAllowance(amount: number | null): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function MaganghubDetailPage({
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

  const initial = listing.company_name?.charAt(0)?.toUpperCase() || "M";
  const gradientClass = getCompanyGradient(listing.company_name);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Link href="/maganghub">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-base shadow-md shadow-violet-500/10`}
            >
              {initial}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {listing.title}
              </h1>
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3 h-3 text-violet-500" />
                {listing.company_name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs gap-1.5"
          >
            <Link href={`/maganghub/${listing.id}/edit`}>
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          </Button>
          <DeleteMaganghubButton
            listingId={listing.id}
            listingTitle={listing.title}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Detail Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Cards */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ringkasan Lowongan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
              {listing.location && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">
                      Lokasi
                    </span>
                    <span className="font-bold text-foreground">
                      {listing.location}
                    </span>
                  </div>
                </div>
              )}

              {listing.work_days && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">
                      Hari Kerja
                    </span>
                    <span className="font-bold text-foreground">
                      {listing.work_days} hari/minggu
                    </span>
                  </div>
                </div>
              )}

              {listing.allowance && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      Uang Saku
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {formatAllowance(listing.allowance)}/bulan
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">
                      Ditambahkan
                    </span>
                    <span className="font-bold text-foreground">
                      {formatDate(listing.created_at)}
                    </span>
                  </div>
                </div>

              {/* Kuota & Total Pelamar */}
              {(listing.quota || listing.total_applicants != null) && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40 sm:col-span-2 lg:col-span-1">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">
                      Kuota / Total Pelamar
                    </span>
                    <span className="font-bold text-foreground">
                      {listing.quota ?? "?"} kuota &mdash; {listing.total_applicants ?? "?"} pelamar
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detail &amp; Catatan Lowongan
              </CardTitle>
              {listing.source_url && (
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  <span>Buka Lowongan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {listing.description ? (
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                  {listing.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada catatan atau deskripsi untuk lowongan ini.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Curriculum */}
          {listing.curriculum && (
            <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                  Kurikulum yang Dipelajari
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                  {listing.curriculum}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-4">
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {listing.source_url && (
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-xs font-semibold text-white bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-3 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-500/20"
                >
                  <span>Buka di MagangHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full h-9 text-xs gap-1.5 justify-between"
              >
                <Link href={`/maganghub/${listing.id}/edit`}>
                  <span>Edit Data</span>
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full h-9 text-xs gap-1.5 justify-between"
              >
                <Link href="/maganghub">
                  <span>Kembali ke Daftar</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
