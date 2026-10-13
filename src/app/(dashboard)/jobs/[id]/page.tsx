import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteJobButton } from "@/features/jobs/components/delete-job-button";
import { ArchiveJobButton } from "@/features/jobs/components/archive-job-button";
import { ApplicationStatus } from "@/features/applications/components/application-status";
import { ApplicationHistory } from "@/features/applications/components/application-history";
import { StatusStepper } from "@/features/applications/components/status-stepper";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatSalary,
  getCompanyGradient,
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
  Building2,
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

  if (!data) return { title: "Detail Lowongan — CareerSync" };
  const job = data as unknown as Pick<Job, "title" | "company_name">;
  return { title: `${job.title} di ${job.company_name} — CareerSync` };
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

  const initial = job.company_name?.charAt(0)?.toUpperCase() || "J";
  const gradientClass = getCompanyGradient(job.company_name);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar: Back & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Link href="/jobs">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/10`}
            >
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{job.title}</h1>
                {!job.is_active && (
                  <Badge variant="secondary" className="gap-1 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    <Archive className="w-3 h-3" />
                    Arsip
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3 h-3 text-indigo-500" />
                {job.company_name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {application && <StatusBadge status={application.status} />}
          <div className="w-px h-4 bg-border/80 mx-1" />
          <ArchiveJobButton jobId={job.id} isActive={job.is_active} />
          <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1.5">
            <Link href={`/jobs/${job.id}/edit`}>
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          </Button>
          <DeleteJobButton jobId={job.id} jobTitle={job.title} />
        </div>
      </div>

      {/* Visual Step Pipeline */}
      {application && <StatusStepper currentStatus={application.status} />}

      {/* Main Split Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Detail Info, Requirements, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Highlights */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ringkasan Lowongan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
              {job.location && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Lokasi</span>
                    <span className="font-bold text-foreground">{job.location}</span>
                  </div>
                </div>
              )}

              {job.workplace_type && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Tipe Tempat</span>
                    <span className="font-bold text-foreground">{WORKPLACE_TYPE_LABELS[job.workplace_type]}</span>
                  </div>
                </div>
              )}

              {job.employment_type && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Sistem Kerja</span>
                    <span className="font-bold text-foreground">{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</span>
                  </div>
                </div>
              )}

              {(job.salary_min || job.salary_max) && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Rentang Gaji</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {formatSalary(job.salary_min, job.salary_max, job.currency)}
                    </span>
                  </div>
                </div>
              )}

              {job.posted_at && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Tanggal Publikasi</span>
                    <span className="font-bold text-foreground">{formatDate(job.posted_at)}</span>
                  </div>
                </div>
              )}

              {job.deadline_at && (
                <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">Batas Waktu Lamaran</span>
                    <span className="font-bold text-foreground">{formatDate(job.deadline_at)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description & Requirements */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Deskripsi & Persyaratan Pekerjaan
              </CardTitle>
              {job.source_url && (
                <a
                  href={job.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Buka Lowongan Asli</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {job.description ? (
                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                  {job.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada catatan deskripsi atau rincian kualifikasi pekerjaan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Quick Status Updater & History */}
        <div className="space-y-6">
          {application && (
            <ApplicationStatus
              applicationId={application.id}
              currentStatus={application.status}
              appliedAt={application.applied_at}
              deadlineAt={application.deadline_at}
              notes={application.notes}
            />
          )}

          {application && events.length > 0 && (
            <ApplicationHistory events={events} />
          )}
        </div>
      </div>
    </div>
  );
}
