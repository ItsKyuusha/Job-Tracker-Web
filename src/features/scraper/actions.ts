"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ScrapedJob } from "./types";
import type { SourceName, EmploymentType, WorkplaceType } from "@/types/database";

export interface ImportJobResponse {
  success: boolean;
  alreadySaved?: boolean;
  jobId?: string;
  error?: string;
}

/**
 * Save / Import a scraped job into the user's tracker (Kanban board) under 'saved' status.
 * Automatically checks for duplicate entries by source_url or (title + company).
 */
export async function importScrapedJobAction(job: ScrapedJob): Promise<ImportJobResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Silakan login terlebih dahulu untuk menyimpan lowongan ke pelacak.",
    };
  }

  // 1. Check duplicate by source_url
  if (job.source_url) {
    const { data: urlMatch } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("source_url", job.source_url)
      .limit(1);

    if (urlMatch && urlMatch.length > 0) {
      return {
        success: true,
        alreadySaved: true,
        jobId: urlMatch[0].id,
        error: "Lowongan ini sudah pernah Anda simpan di tracker.",
      };
    }
  }

  // 2. Check duplicate by title & company_name
  if (job.title && job.company) {
    const { data: nameMatch } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user.id)
      .ilike("title", job.title.trim())
      .ilike("company_name", job.company.trim())
      .limit(1);

    if (nameMatch && nameMatch.length > 0) {
      return {
        success: true,
        alreadySaved: true,
        jobId: nameMatch[0].id,
        error: "Lowongan dengan posisi & perusahaan yang sama sudah ada di tracker.",
      };
    }
  }

  // 3. Map source_name to match postgres enum ('manual' | 'linkedin' | 'jobstreet' | 'glints' | 'indeed' | 'other')
  const validSources = ["manual", "linkedin", "jobstreet", "glints", "indeed", "other"] as const;
  const mappedSource: SourceName = validSources.includes(job.source as SourceName)
    ? (job.source as SourceName)
    : "other";

  // 4. Map employment_type and workplace_type
  const validEmployment: EmploymentType[] = [
    "full_time",
    "part_time",
    "contract",
    "freelance",
    "internship",
  ];
  const validWorkplace: WorkplaceType[] = ["onsite", "remote", "hybrid"];

  const empType: EmploymentType | null = validEmployment.includes(
    job.employment_type as EmploymentType
  )
    ? (job.employment_type as EmploymentType)
    : null;

  const wpType: WorkplaceType | null = validWorkplace.includes(
    job.workplace_type as WorkplaceType
  )
    ? (job.workplace_type as WorkplaceType)
    : null;

  // 5. Insert new job
  const { data: newJob, error: jobError } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      title: job.title.trim(),
      company_name: (job.company || "Perusahaan").trim(),
      description: job.description || null,
      location: job.location || null,
      employment_type: empType,
      workplace_type: wpType,
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
      currency: job.currency || "IDR",
      source_name: mappedSource,
      source_url: job.source_url || null,
      posted_at: job.posted_at || null,
      is_active: true,
    })
    .select("id")
    .single();

  if (jobError || !newJob) {
    console.error("importScrapedJobAction error:", jobError);
    return {
      success: false,
      error: "Gagal menyimpan lowongan ke database. Coba beberapa saat lagi.",
    };
  }

  // 6. Create application entry in Kanban board with status 'saved'
  const { error: appError } = await supabase.from("applications").insert({
    job_id: newJob.id,
    user_id: user.id,
    status: "saved",
  });

  if (appError) {
    console.error("importScrapedJobAction app error:", appError);
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");

  return {
    success: true,
    alreadySaved: false,
    jobId: newJob.id,
  };
}

/**
 * Fetch all source URLs of jobs already saved by the current logged-in user.
 * Used for fast batch duplicate detection and UI indicator.
 */
export async function getSavedJobUrlsAction(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from("jobs")
      .select("source_url")
      .eq("user_id", user.id)
      .not("source_url", "is", null);

    return (data || [])
      .map((j) => j.source_url)
      .filter((url): url is string => Boolean(url));
  } catch (err) {
    console.error("getSavedJobUrlsAction error:", err);
    return [];
  }
}
