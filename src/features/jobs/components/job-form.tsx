"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/types/database";
import type { JobFormState } from "@/features/jobs/actions";
import { Loader2, ArrowRight, Building2, Calendar, Banknote, FileText } from "lucide-react";

type JobFormProps = {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  defaultValues?: Partial<Job>;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-[11px] text-rose-500 font-medium mt-1">{errors[0]}</p>;
}

export function JobForm({ action, defaultValues, submitLabel = "Simpan Lowongan" }: JobFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  const toDateInput = (val?: string | null) => {
    if (!val) return "";
    return val.split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3.5 py-2.5 rounded-lg">
          {state.error}
        </div>
      )}

      {/* Group 1: Posisi & Perusahaan */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs relative z-30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Perusahaan & Posisi</span>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Posisi / Job Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="cth. Senior Frontend Engineer"
                defaultValue={defaultValues?.title ?? ""}
                required
                className="h-9 text-xs"
              />
              <FieldError errors={state.fieldErrors?.title} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company_name" className="text-xs font-medium">
                Nama Perusahaan <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="cth. GoTo, Shopee, Traveloka"
                defaultValue={defaultValues?.company_name ?? ""}
                required
                className="h-9 text-xs"
              />
              <FieldError errors={state.fieldErrors?.company_name} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-medium">Lokasi Penempatan</Label>
            <Input
              id="location"
              name="location"
              placeholder="cth. Jakarta Selatan / Singapura / Remote"
              defaultValue={defaultValues?.location ?? ""}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 relative z-20">
              <Label htmlFor="employment_type" className="text-xs font-medium">Tipe Pekerjaan</Label>
              <Select name="employment_type" defaultValue={defaultValues?.employment_type ?? "full_time"}>
                <SelectTrigger id="employment_type" className="h-9 text-xs">
                  <SelectValue placeholder="Pilih tipe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Kontrak</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Magang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 relative z-10">
              <Label htmlFor="workplace_type" className="text-xs font-medium">Mode Tempat Kerja</Label>
              <Select name="workplace_type" defaultValue={defaultValues?.workplace_type ?? "hybrid"}>
                <SelectTrigger id="workplace_type" className="h-9 text-xs">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="remote">Remote (WFA)</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group 2: Tanggal & Jadwal */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs relative z-20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Tanggal Penting</span>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="posted_at" className="text-xs font-medium">Tanggal Diumumkan</Label>
              <Input
                id="posted_at"
                name="posted_at"
                type="date"
                defaultValue={toDateInput(defaultValues?.posted_at)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline_at" className="text-xs font-medium">Batas Waktu / Deadline</Label>
              <Input
                id="deadline_at"
                name="deadline_at"
                type="date"
                defaultValue={toDateInput(defaultValues?.deadline_at)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group 3: Gaji */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs relative z-10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Banknote className="w-3.5 h-3.5 text-primary" />
            <span>Kompensasi & Gaji (Opsional)</span>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 relative z-20">
              <Label htmlFor="currency" className="text-xs font-medium">Mata Uang</Label>
              <Select name="currency" defaultValue={defaultValues?.currency ?? "IDR"}>
                <SelectTrigger id="currency" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR (Rp)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="SGD">SGD (S$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salary_min" className="text-xs font-medium">Gaji Minimal</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                placeholder="cth. 8000000"
                min={0}
                defaultValue={defaultValues?.salary_min?.toString() ?? ""}
                className="h-9 text-xs"
              />
              <FieldError errors={state.fieldErrors?.salary_min} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salary_max" className="text-xs font-medium">Gaji Maksimal</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                placeholder="cth. 15000000"
                min={0}
                defaultValue={defaultValues?.salary_max?.toString() ?? ""}
                className="h-9 text-xs"
              />
              <FieldError errors={state.fieldErrors?.salary_max} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group 4: Detail & Link */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs relative z-0">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Detail & Sumber</span>
          </div>
          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="source_url" className="text-xs font-medium">Link Lowongan Asli (LinkedIn, Glints, Karir.com)</Label>
            <Input
              id="source_url"
              name="source_url"
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              defaultValue={defaultValues?.source_url ?? ""}
              className="h-9 text-xs"
            />
            <FieldError errors={state.fieldErrors?.source_url} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">Deskripsi / Persyaratan / Catatan</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Requirement penting, benefit yang ditawarkan, atau hal yang perlu dipersiapkan saat interview..."
              rows={5}
              defaultValue={defaultValues?.description ?? ""}
              className="resize-y text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 text-xs font-bold px-6 gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all shadow-md shadow-indigo-600/25 border-0 cursor-pointer"
        >
          {pending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Menyimpan ke Database...</span>
            </>
          ) : (
            <>
              <span>{submitLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
