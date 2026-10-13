import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/features/jobs/components/job-form";
import { createJobAction } from "@/features/jobs/actions";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Lowongan — Job Tracker",
};

export default function NewJobPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/jobs">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Lowongan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Isi informasi lowongan yang ingin Anda simpan
          </p>
        </div>
      </div>

      <JobForm action={createJobAction} submitLabel="Simpan Lowongan" />
    </div>
  );
}
