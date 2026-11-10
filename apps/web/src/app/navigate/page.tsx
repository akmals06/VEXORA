import type { Metadata } from "next";
import { Suspense } from "react";
import { IssueNavigatorView } from "@/features/navigator/issue-navigator-view";

export const metadata: Metadata = {
  title: "Navigator Masalah Kerja | VEXORA",
  description:
    "Pemetaan masalah kerja langkah demi langkah dengan penjaga keamanan jalur pelaporan dan dukungan non-klinis.",
};

export default function NavigatePage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Memuat ruang Navigator Masalah Kerja...
        </div>
      }
    >
      <IssueNavigatorView />
    </Suspense>
  );
}
