import type { Metadata } from "next";
import { PortalExplorer } from "@/features/scraper/components/portal-explorer";

export const metadata: Metadata = {
  title: "Portal Karir Resmi — CareerSync",
  description: "Cari lowongan kerja terverifikasi dan terstruktur langsung dari JobStreet dan Glints.",
};

export const dynamic = "force-dynamic";

export default function PortalsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PortalExplorer />
    </div>
  );
}
