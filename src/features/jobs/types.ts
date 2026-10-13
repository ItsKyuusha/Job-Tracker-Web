import type { Job, Application, ApplicationStatus } from "@/types/database";

export type JobWithApplication = Job & {
  applications: Pick<Application, "id" | "status" | "applied_at" | "deadline_at" | "notes">[];
};

export type JobListItem = Pick<
  Job,
  | "id"
  | "title"
  | "company_name"
  | "location"
  | "employment_type"
  | "workplace_type"
  | "deadline_at"
  | "is_active"
  | "created_at"
  | "source_name"
> & {
  applications: { status: ApplicationStatus; applied_at: string | null }[];
};

export type JobFilters = {
  search?: string;
  status?: ApplicationStatus | "all";
  employment_type?: string;
  workplace_type?: string;
  sort?: "created_at" | "applied_at" | "deadline_at";
  order?: "asc" | "desc";
};
