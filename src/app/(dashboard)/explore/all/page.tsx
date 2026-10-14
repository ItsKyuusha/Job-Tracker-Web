import type { Metadata } from "next";
import { JobExplorer } from "@/features/scraper/components/job-explorer";

export const metadata: Metadata = {
  title: "Loker Gabungan (Semua Sumber) — CareerSync",
  description: "Cari dan bandingkan lowongan kerja dari LinkedIn, JobStreet, Glints, dan Threads sekaligus dalam satu layar.",
};

export const dynamic = "force-dynamic";

export default function ExploreAllPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <JobExplorer />
    </div>
  );
}
