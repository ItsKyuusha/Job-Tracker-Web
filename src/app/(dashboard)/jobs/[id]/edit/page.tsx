import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/features/jobs/components/job-form";
import { updateJobAction } from "@/features/jobs/actions";
import type { Job } from "@/types/database";
import { ChevronLeft } from "lucide-react";

type PageParams = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "Edit Informasi Lowongan — CareerSync",
};

export default async function EditJobPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: rawJob } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!rawJob) notFound();

  const job = rawJob as unknown as Job;
  const updateAction = updateJobAction.bind(null, id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-3 pb-3 border-b border-border/60">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Link href={`/jobs/${id}`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Edit Informasi Lowongan</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Perbarui data {job.title} di {job.company_name}
          </p>
        </div>
      </div>

      <JobForm
        action={updateAction}
        defaultValues={job}
        submitLabel="Perbarui Data Lowongan"
      />
    </div>
  );
}
