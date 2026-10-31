"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MaganghubListing } from "@/types/database";
import type { MaganghubFormState } from "@/features/maganghub/actions";
import {
  Loader2,
  ArrowRight,
  Building2,
  Banknote,
  FileText,
  BookOpen,
  Users,
} from "lucide-react";

type MaganghubFormProps = {
  action: (
    prevState: MaganghubFormState,
    formData: FormData
  ) => Promise<MaganghubFormState>;
  defaultValues?: Partial<MaganghubListing>;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="text-[11px] text-rose-500 font-medium mt-1">{errors[0]}</p>
  );
}

export function MaganghubForm({
  action,
  defaultValues,
  submitLabel = "Simpan Lowongan",
}: MaganghubFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3.5 py-2.5 rounded-lg">
          {state.error}
        </div>
      )}

      {/* Group 1: Posisi & Perusahaan */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Perusahaan &amp; Posisi</span>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Posisi Lowongan <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="cth. UI/UX Designer Intern"
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
            <Label htmlFor="location" className="text-xs font-medium">
              Lokasi Penempatan
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="cth. Jakarta Selatan / Bandung / Remote"
              defaultValue={defaultValues?.location ?? ""}
              className="h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Group 2: Kompensasi & Jadwal */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Banknote className="w-3.5 h-3.5 text-primary" />
            <span>Kompensasi &amp; Jadwal (Opsional)</span>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="allowance" className="text-xs font-medium">
                Uang Saku (IDR/bulan)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="allowance"
                  name="allowance"
                  type="number"
                  placeholder="cth. 1500000"
                  min={0}
                  defaultValue={defaultValues?.allowance?.toString() ?? ""}
                  className="h-9 text-xs pl-9"
                />
              </div>
              <FieldError errors={state.fieldErrors?.allowance} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="work_days" className="text-xs font-medium">
                Hari Kerja / Minggu
              </Label>
              <div className="relative">
                <Input
                  id="work_days"
                  name="work_days"
                  type="number"
                  placeholder="cth. 5"
                  min={1}
                  max={7}
                  defaultValue={defaultValues?.work_days?.toString() ?? ""}
                  className="h-9 text-xs pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  hari/minggu
                </span>
              </div>
              <FieldError errors={state.fieldErrors?.work_days} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group 3: Kurikulum & Kuota */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Kurikulum &amp; Persaingan (Opsional)</span>
          </div>
          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="curriculum" className="text-xs font-medium">
              Kurikulum yang Dipelajari
            </Label>
            <Textarea
              id="curriculum"
              name="curriculum"
              placeholder="cth. React, Node.js, Figma, Machine Learning, Agile Methodology..."
              rows={3}
              defaultValue={defaultValues?.curriculum ?? ""}
              className="resize-y text-xs leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground">
              Skill atau teknologi yang akan dipelajari/digunakan selama magang.
            </p>
            <FieldError errors={state.fieldErrors?.curriculum} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="quota" className="text-xs font-medium">
                Kuota Lowongan
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="quota"
                  name="quota"
                  type="number"
                  placeholder="cth. 2"
                  min={1}
                  defaultValue={defaultValues?.quota?.toString() ?? ""}
                  className="h-9 text-xs pl-9"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Jumlah posisi yang tersedia di lowongan ini.
              </p>
              <FieldError errors={state.fieldErrors?.quota} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="total_applicants" className="text-xs font-medium">
                Total Pelamar Saat Ini
              </Label>
              <div className="relative">
                <Input
                  id="total_applicants"
                  name="total_applicants"
                  type="number"
                  placeholder="cth. 10"
                  min={0}
                  defaultValue={defaultValues?.total_applicants?.toString() ?? ""}
                  className="h-9 text-xs pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  pelamar
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tampil sebagai <strong>Kuota/Pesaing</strong>, misal 2/10.
              </p>
              <FieldError errors={state.fieldErrors?.total_applicants} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group 4: Detail & Link */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Detail &amp; Link</span>
          </div>
          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="source_url" className="text-xs font-medium">
              Link Lowongan MagangHub
            </Label>
            <Input
              id="source_url"
              name="source_url"
              type="url"
              placeholder="https://maganghub.com/internship/..."
              defaultValue={defaultValues?.source_url ?? ""}
              className="h-9 text-xs"
            />
            <FieldError errors={state.fieldErrors?.source_url} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">
              Detail Lowongan / Catatan
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Deskripsi pekerjaan, kualifikasi yang dibutuhkan, benefit, atau catatan pribadi..."
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
          className="h-10 text-xs font-bold px-6 gap-2 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all shadow-md shadow-violet-600/25 border-0 cursor-pointer"
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
