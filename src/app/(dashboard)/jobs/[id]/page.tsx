import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeleteJobButton } from "@/features/jobs/components/delete-job-button";
import { ArchiveJobButton } from "@/features/jobs/components/archive-job-button";
import { ApplicationStatus } from "@/features/applications/components/application-status";
import { ApplicationHistory } from "@/features/applications/components/application-history";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatSalary,
} from "@/lib/utils";
import type { Job, Application, ApplicationEvent } from "@/types/database";
import {
  ChevronLeft,
  Pencil,
  MapPin,
  Briefcase,
  Monitor,
  Calendar,
  CalendarClock,
  ExternalLink,
  Archive,
  Banknote,
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
    .from("jobs")
    .select("title, company_name")
    .eq("id", id)
    .single();

  if (!data) return { title: "Lowongan — Job Tracker" };
  const job = data as unknown as Pick<Job, "title" | "company_name">;
  return { title: `${job.title} di ${job.company_name} — Job Tracker` };
}

export default async function JobDetailPage({ params }: { params: PageParams }) {
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

  const { data: rawApplication } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", id)
    .eq("user_id", user.id)
    .single();

  const application = rawApplication as unknown as Application | null;

  const { data: rawEvents } = await supabase
    .from("application_events")
    .select("*")
    .eq("application_id", application?.id ?? "")
    .order("created_at", { ascending: false });

  const events = (rawEvents ?? []) as unknown as ApplicationEvent[];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back + Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{job.title}</h1>
              {!job.is_active && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Archive className="w-3 h-3" />
                  Diarsipkan
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{job.company_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ArchiveJobButton jobId={job.id} isActive={job.is_active} />
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={`/jobs/${job.id}/edit`}>
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
          </Button>
          <DeleteJobButton jobId={job.id} jobTitle={job.title} />
        </div>
      </div>

      {/* Application Status */}
      {application && (
        <ApplicationStatus
          applicationId={application.id}
          currentStatus={application.status}
          appliedAt={application.applied_at}
          deadlineAt={application.deadline_at}
          notes={application.notes}
        />
      )}

      {/* Job Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Informasi Lowongan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {job.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{job.location}</span>
            </div>
          )}
          {job.employment_type && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</span>
            </div>
          )}
          {job.workplace_type && (
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{WORKPLACE_TYPE_LABELS[job.workplace_type]}</span>
            </div>
          )}
          {(job.salary_min || job.salary_max) && (
            <div className="flex items-center gap-2 text-sm">
              <Banknote className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
            </div>
          )}
          {job.posted_at && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Diposting {formatDate(job.posted_at)}</span>
            </div>
          )}
          {job.deadline_at && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Deadline {formatDate(job.deadline_at)}</span>
            </div>
          )}
          {job.source_url && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                Lihat lowongan asli
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      {job.description && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Deskripsi / Catatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Application History */}
      {application && events.length > 0 && (
        <ApplicationHistory events={events} />
      )}
    </div>
  );
}
