// Tipe ini akan di-generate dari schema Supabase setelah database dibuat.
// Untuk sementara, definisi manual berdasarkan schema yang sudah direncanakan.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          company_name: string;
          description: string | null;
          location: string | null;
          employment_type: EmploymentType | null;
          workplace_type: WorkplaceType | null;
          salary_min: number | null;
          salary_max: number | null;
          currency: string;
          source_name: SourceName;
          source_url: string | null;
          posted_at: string | null;
          deadline_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          company_name: string;
          description?: string | null;
          location?: string | null;
          employment_type?: EmploymentType | null;
          workplace_type?: WorkplaceType | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string;
          source_name?: SourceName;
          source_url?: string | null;
          posted_at?: string | null;
          deadline_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          company_name?: string;
          description?: string | null;
          location?: string | null;
          employment_type?: EmploymentType | null;
          workplace_type?: WorkplaceType | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string;
          source_name?: SourceName;
          source_url?: string | null;
          posted_at?: string | null;
          deadline_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          user_id: string;
          status: ApplicationStatus;
          applied_at: string | null;
          deadline_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          user_id: string;
          status?: ApplicationStatus;
          applied_at?: string | null;
          deadline_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          user_id?: string;
          status?: ApplicationStatus;
          applied_at?: string | null;
          deadline_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      application_events: {
        Row: {
          id: string;
          application_id: string;
          user_id: string;
          from_status: ApplicationStatus | null;
          to_status: ApplicationStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          user_id: string;
          from_status?: ApplicationStatus | null;
          to_status: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          user_id?: string;
          from_status?: ApplicationStatus | null;
          to_status?: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
        };
      };
      maganghub_listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company_name: string;
          location: string | null;
          allowance: number | null;
          work_days: number | null;
          description: string | null;
          source_url: string | null;
          curriculum: string | null;
          quota: number | null;
          total_applicants: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company_name: string;
          location?: string | null;
          allowance?: number | null;
          work_days?: number | null;
          description?: string | null;
          source_url?: string | null;
          curriculum?: string | null;
          quota?: number | null;
          total_applicants?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company_name?: string;
          location?: string | null;
          allowance?: number | null;
          work_days?: number | null;
          description?: string | null;
          source_url?: string | null;
          curriculum?: string | null;
          quota?: number | null;
          total_applicants?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      application_status: ApplicationStatus;
      employment_type: EmploymentType;
      workplace_type: WorkplaceType;
      source_name: SourceName;
    };
  };
};

// ─── Domain types ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "assessment"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "internship";

export type WorkplaceType = "onsite" | "remote" | "hybrid";

export type SourceName =
  | "manual"
  | "linkedin"
  | "jobstreet"
  | "glints"
  | "indeed"
  | "other";

// ─── Convenience row types ─────────────────────────────────────────────────────

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ApplicationEvent =
  Database["public"]["Tables"]["application_events"]["Row"];

// Insert types
export type InsertJob = Database["public"]["Tables"]["jobs"]["Insert"];
export type InsertApplication =
  Database["public"]["Tables"]["applications"]["Insert"];
export type InsertApplicationEvent =
  Database["public"]["Tables"]["application_events"]["Insert"];

// Update types
export type UpdateJob = Database["public"]["Tables"]["jobs"]["Update"];
export type UpdateApplication =
  Database["public"]["Tables"]["applications"]["Update"];

// ─── MagangHub Listing ────────────────────────────────────────────────────────

export type MaganghubListing =
  Database["public"]["Tables"]["maganghub_listings"]["Row"];
export type InsertMaganghubListing =
  Database["public"]["Tables"]["maganghub_listings"]["Insert"];
export type UpdateMaganghubListing =
  Database["public"]["Tables"]["maganghub_listings"]["Update"];

// ─── Composite types untuk queries dengan JOIN ─────────────────────────────────

export type JobWithApplication = Job & {
  applications: Application[];
};

export type ApplicationWithJob = Application & {
  jobs: Job;
};

export type ApplicationWithEvents = Application & {
  application_events: ApplicationEvent[];
  jobs: Job;
};
