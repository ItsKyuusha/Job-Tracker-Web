"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
});

export type AuthFormState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Email atau password salah" };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { error: "Email sudah terdaftar. Silakan login." };
    }
    return { error: "Gagal membuat akun. Coba lagi." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ─── Update profile ────────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
});

const changePasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirm_password"],
});

export type ProfileFormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi tidak ditemukan, silakan login ulang." };

  const raw = { full_name: formData.get("full_name") };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (error) return { error: "Gagal memperbarui profil." };
  return { success: true, message: "Profil berhasil diperbarui." };
}

export async function changePasswordAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi tidak ditemukan, silakan login ulang." };

  const raw = {
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return { error: "Gagal mengubah password. Coba lagi." };
  return { success: true, message: "Password berhasil diubah." };
}
