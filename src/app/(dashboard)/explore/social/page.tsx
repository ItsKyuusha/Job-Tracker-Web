import type { Metadata } from "next";
import { SocialExplorer } from "@/features/scraper/components/social-explorer";

export const metadata: Metadata = {
  title: "Loker Sosmed & Komunitas — CareerSync",
  description: "Eksplorasi postingan lowongan kerja informal dari Threads dan LinkedIn.",
};

export const dynamic = "force-dynamic";

export default function SocialPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <SocialExplorer />
    </div>
  );
}
