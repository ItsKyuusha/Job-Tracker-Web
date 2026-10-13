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
  title: "Edit Lowongan — Job Tracker",
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

  // Bind jobId ke action
  const updateAction = updateJobAction.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/jobs/${id}`}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Lowongan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {job.title} di {job.company_name}
          </p>
        </div>
      </div>

      <JobForm
        action={updateAction}
        defaultValues={job}
        submitLabel="Perbarui Lowongan"
      />
    </div>
  );
}
