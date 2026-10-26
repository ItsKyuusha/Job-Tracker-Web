"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { InsertMaganghubListing, UpdateMaganghubListing } from "@/types/database";

// ─── Validation schema ──────────────────────────────────────────────────────────

const maganghubSchema = z.object({
  title: z.string().min(1, "Posisi lowongan wajib diisi"),
  company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
  location: z.string().optional(),
  allowance: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().positive("Uang saku harus positif").nullable().optional()
  ),
  work_days: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z
      .number()
      .int()
      .min(1, "Minimal 1 hari")
      .max(7, "Maksimal 7 hari")
      .nullable()
      .optional()
  ),
  description: z.string().optional(),
  source_url: z
    .string()
    .url("URL tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type MaganghubFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  success?: boolean;
};

// ─── Create listing ─────────────────────────────────────────────────────────────

export async function createMaganghubAction(
  _prevState: MaganghubFormState,
  formData: FormData
): Promise<MaganghubFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = maganghubSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { source_url, ...rest } = parsed.data;

  const insert: InsertMaganghubListing = {
    ...rest,
    user_id: user.id,
    source_url: source_url || null,
  };

  const { data: listing, error } = await supabase
    .from("maganghub_listings")
    .insert(insert)
    .select("id")
    .single();

  if (error) {
    console.error("createMaganghubAction error:", error);
    return { error: "Gagal menyimpan data. Coba lagi." };
  }

  revalidatePath("/maganghub");
  redirect(`/maganghub/${listing.id}`);
}

// ─── Update listing ─────────────────────────────────────────────────────────────

export async function updateMaganghubAction(
  listingId: string,
  _prevState: MaganghubFormState,
  formData: FormData
): Promise<MaganghubFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = maganghubSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { source_url, ...rest } = parsed.data;

  const update: UpdateMaganghubListing = {
    ...rest,
    source_url: source_url || null,
  };

  const { error } = await supabase
    .from("maganghub_listings")
    .update(update)
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateMaganghubAction error:", error);
    return { error: "Gagal memperbarui data. Coba lagi." };
  }

  revalidatePath("/maganghub");
  revalidatePath(`/maganghub/${listingId}`);
  redirect(`/maganghub/${listingId}`);
}

// ─── Delete listing ─────────────────────────────────────────────────────────────

export async function deleteMaganghubAction(
  listingId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda harus login terlebih dahulu" };

  const { error } = await supabase
    .from("maganghub_listings")
    .delete()
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) {
    console.error("deleteMaganghubAction error:", error);
    return { error: "Gagal menghapus data. Coba lagi." };
  }

  revalidatePath("/maganghub");
  redirect("/maganghub");
}
