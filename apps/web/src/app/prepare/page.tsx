import type { Metadata } from "next";
import { Suspense } from "react";
import { ConversationPrepView } from "@/features/prepare/conversation-prep-view";

export const metadata: Metadata = {
  title: "Persiapan Percakapan & Situasi Kerja | VEXORA",
  description:
    "Ruang penyusunan draf komunikasi 5-prompt untuk Atasan, HR, Psikolog, Konselor, Pendamping Hukum, dan Mentor Karier khusus di sesi peramban lokal.",
};

export default function PreparePage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Memuat ruang Persiapan Percakapan...
        </div>
      }
    >
      <ConversationPrepView />
    </Suspense>
  );
}
