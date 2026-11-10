import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEXORA: Platform Perlindungan & Kesejahteraan Psikososial Pekerja",
  description:
    "Navigasi masalah kerja berfokus solusi, persiapan percakapan terstruktur, literasi hak ketenagakerjaan, dan dukungan psikologis non-klinis.",
};

interface PropertiLayoutAkar {
  children: ReactNode;
}

export default function RootLayout({ children }: PropertiLayoutAkar) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--vx-bg-viewport)] text-[var(--vx-text-primary)] antialiased">
        <AppProviders>
          <PageShell>{children}</PageShell>
        </AppProviders>
      </body>
    </html>
  );
}
