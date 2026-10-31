"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ApplicationStatus } from "@/types/database";

const updateApplicationSchema = z.object({
  status: z.enum([
    "saved",
    "applied",
    "assessment",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ]),
  applied_at: z.string().optional().nullable().or(z.literal("")),
  deadline_at: z.string().optional().nullable().or(z.literal("")),
  notes: z.string().optional().nullable(),
});

export type ApplicationFormState = {
  error?: string;
  success?: boolean;
};

export async function updateApplicationAction(
  applicationId: string,
  jobId: string,
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateApplicationSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { applied_at, deadline_at, ...rest } = parsed.data;

  const { error } = await supabase
    .from("applications")
    .update({
      ...rest,
      applied_at: applied_at || null,
      deadline_at: deadline_at || null,
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateApplicationAction error:", error);
    return { error: "Gagal memperbarui status lamaran." };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addApplicationNoteAction(
  applicationId: string,
  jobId: string,
  note: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login" };

  // Ambil status aktif dulu agar event tidak salah mencatat to_status
  const { data: app } = await supabase
    .from("applications")
    .select("status")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (!app) return { error: "Lamaran tidak ditemukan." };

  const { error } = await supabase.from("application_events").insert({
    application_id: applicationId,
    user_id: user.id,
    from_status: null,
    to_status: app.status as ApplicationStatus,
    notes: note,
  });

  if (error) return { error: "Gagal menambahkan catatan." };

  revalidatePath(`/jobs/${jobId}`);
  return {};
}
