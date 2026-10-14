import type { Metadata } from "next";
import { JobExplorer } from "@/features/scraper/components/job-explorer";

export const metadata: Metadata = {
  title: "Cari Lowongan Eksternal — CareerSync",
  description: "Eksplorasi lowongan kerja dari LinkedIn, JobStreet, Glints, dan Threads melalui scraper service.",
};

export const dynamic = "force-dynamic";

export default function ExplorePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <JobExplorer />
    </div>
  );
}
