import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MaganghubForm } from "@/features/maganghub/components/maganghub-form";
import { createMaganghubAction } from "@/features/maganghub/actions";
import { ChevronLeft, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Lowongan MagangHub — CareerSync",
};

export default function NewMaganghubPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-3 pb-3 border-b border-border/60">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Link href="/maganghub">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Tambah Lowongan MagangHub
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <GraduationCap className="w-3 h-3" />
              Riset
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simpan informasi lowongan magang dari MagangHub sebagai bahan riset dan pembanding.
          </p>
        </div>
      </div>

      <MaganghubForm action={createMaganghubAction} submitLabel="Simpan ke Daftar Riset" />
    </div>
  );
}
