"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { InsertJob, UpdateJob, EmploymentType, WorkplaceType } from "@/types/database";

// ─── Validation schema ─────────────────────────────────────────────────────────

const jobSchema = z.object({
  title: z.string().min(1, "Judul posisi wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  description: z.string().optional(),
  location: z.string().optional(),
  employment_type: z
    .enum(["full_time", "part_time", "contract", "freelance", "internship"])
    .optional()
    .nullable(),
  workplace_type: z
    .enum(["onsite", "remote", "hybrid"])
    .optional()
    .nullable(),
  salary_min: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().positive().nullable().optional()
  ),
  salary_max: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().positive().nullable().optional()
  ),
  currency: z.string().default("IDR"),
  source_url: z
    .string()
    .url("URL tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  posted_at: z.string().optional().nullable().or(z.literal("")),
  deadline_at: z.string().optional().nullable().or(z.literal("")),
});

export type JobFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  success?: boolean;
};

// ─── Create job ────────────────────────────────────────────────────────────────

export async function createJobAction(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { source_url, posted_at, deadline_at, employment_type, workplace_type, ...rest } = parsed.data;

  const insert: InsertJob = {
    ...rest,
    user_id: user.id,
    source_name: "manual",
    employment_type: (employment_type as EmploymentType) ?? null,
    workplace_type: (workplace_type as WorkplaceType) ?? null,
    source_url: source_url || null,
    posted_at: posted_at || null,
    deadline_at: deadline_at || null,
  };

  const { data: job, error } = await supabase
    .from("jobs")
    .insert(insert)
    .select("id")
    .single();

  if (error) {
    console.error("createJobAction error:", error);
    return { error: "Gagal menyimpan lowongan. Coba lagi." };
  }

  // Buat application dengan status 'saved' secara otomatis
  await supabase.from("applications").insert({
    job_id: job.id,
    user_id: user.id,
    status: "saved",
  });

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect(`/jobs/${job.id}`);
}

// ─── Update job ────────────────────────────────────────────────────────────────

export async function updateJobAction(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { source_url, posted_at, deadline_at, employment_type, workplace_type, ...rest } = parsed.data;

  const update: UpdateJob = {
    ...rest,
    employment_type: (employment_type as EmploymentType) ?? null,
    workplace_type: (workplace_type as WorkplaceType) ?? null,
    source_url: source_url || null,
    posted_at: posted_at || null,
    deadline_at: deadline_at || null,
  };

  const { error } = await supabase
    .from("jobs")
    .update(update)
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateJobAction error:", error);
    return { error: "Gagal memperbarui lowongan. Coba lagi." };
  }

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}

// ─── Delete job ────────────────────────────────────────────────────────────────

export async function deleteJobAction(jobId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) {
    console.error("deleteJobAction error:", error);
    return { error: "Gagal menghapus lowongan. Coba lagi." };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect("/jobs");
}

// ─── Archive / restore job ─────────────────────────────────────────────────────

export async function toggleArchiveJobAction(
  jobId: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login" };

  const { error } = await supabase
    .from("jobs")
    .update({ is_active: !isActive })
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) return { error: "Gagal mengubah status arsip." };

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return {};
}
