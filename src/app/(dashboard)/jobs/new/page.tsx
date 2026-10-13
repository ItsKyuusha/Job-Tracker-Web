import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/features/jobs/components/job-form";
import { createJobAction } from "@/features/jobs/actions";
import { ChevronLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Lowongan Baru — CareerSync",
};

export default function NewJobPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-3 pb-3 border-b border-border/60">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Link href="/jobs">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Tambah Lowongan Baru</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3" />
              Manual Input
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simpan data lowongan kerja target Anda ke tracker. Status awal akan otomatis ditandai sebagai &quot;Tersimpan&quot;.
          </p>
        </div>
      </div>

      <JobForm action={createJobAction} submitLabel="Simpan ke Tracker" />
    </div>
  );
}
