"use client";

import { useActionState, useCallback } from "react";
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

type JobFormProps = {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  defaultValues?: Partial<Job>;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive mt-1">{errors[0]}</p>;
}

export function JobForm({ action, defaultValues, submitLabel = "Simpan" }: JobFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  // Normalize date untuk input type="date"
  const toDateInput = (val?: string | null) => {
    if (!val) return "";
    return val.split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {state.error}
        </div>
      )}

      {/* Info Dasar */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Informasi Lowongan
          </h3>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Posisi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Frontend Engineer"
                defaultValue={defaultValues?.title ?? ""}
                required
              />
              <FieldError errors={state.fieldErrors?.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">
                Perusahaan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Nama Perusahaan"
                defaultValue={defaultValues?.company_name ?? ""}
                required
              />
              <FieldError errors={state.fieldErrors?.company_name} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              name="location"
              placeholder="Jakarta, Indonesia"
              defaultValue={defaultValues?.location ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employment_type">Tipe Pekerjaan</Label>
              <Select name="employment_type" defaultValue={defaultValues?.employment_type ?? ""}>
                <SelectTrigger id="employment_type">
                  <SelectValue placeholder="Pilih tipe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace_type">Tempat Kerja</Label>
              <Select name="workplace_type" defaultValue={defaultValues?.workplace_type ?? ""}>
                <SelectTrigger id="workplace_type">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tanggal */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Tanggal
          </h3>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="posted_at">Tanggal Posting</Label>
              <Input
                id="posted_at"
                name="posted_at"
                type="date"
                defaultValue={toDateInput(defaultValues?.posted_at)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline_at">Deadline</Label>
              <Input
                id="deadline_at"
                name="deadline_at"
                type="date"
                defaultValue={toDateInput(defaultValues?.deadline_at)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaji */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Gaji (Opsional)
          </h3>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="currency">Mata Uang</Label>
              <Select name="currency" defaultValue={defaultValues?.currency ?? "IDR"}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_min">Gaji Minimum</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                placeholder="5000000"
                min={0}
                defaultValue={defaultValues?.salary_min?.toString() ?? ""}
              />
              <FieldError errors={state.fieldErrors?.salary_min} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_max">Gaji Maksimum</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                placeholder="10000000"
                min={0}
                defaultValue={defaultValues?.salary_max?.toString() ?? ""}
              />
              <FieldError errors={state.fieldErrors?.salary_max} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL & Deskripsi */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Detail
          </h3>
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="source_url">URL Lowongan</Label>
            <Input
              id="source_url"
              name="source_url"
              type="url"
              placeholder="https://linkedin.com/jobs/..."
              defaultValue={defaultValues?.source_url ?? ""}
            />
            <FieldError errors={state.fieldErrors?.source_url} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi / Catatan</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Deskripsi lowongan, requirement, atau catatan pribadi..."
              rows={5}
              defaultValue={defaultValues?.description ?? ""}
              className="resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
