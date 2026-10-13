import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-muted-foreground/40">404</h1>
      <h2 className="text-xl font-semibold mt-4">Halaman tidak ditemukan</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}
