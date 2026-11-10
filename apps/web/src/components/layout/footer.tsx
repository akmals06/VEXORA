import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-[var(--vx-border-subtle)] px-2 pt-7 pb-3 text-[var(--vx-text-primary)] sm:px-4 sm:pt-9">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A2552] text-xs font-extrabold text-white">
              VX
            </span>
            <p className="text-base font-extrabold tracking-tight">VEXORA</p>
          </div>
          <p className="mt-2.5 max-w-md text-xs leading-relaxed text-[var(--vx-text-secondary)]">
            Bantu pekerja memahami situasi, mengenali pilihan dukungan, dan menyiapkan langkah
            berikutnya dengan lebih aman.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--vx-surface-secondary)] px-2.5 py-1 text-[11px] font-medium text-[var(--vx-text-primary)]">
              <Icon name="shield" size={13} />
              Non-Pengawasan HR
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--vx-surface-secondary)] px-2.5 py-1 text-[11px] font-medium text-[var(--vx-text-primary)]">
              <Icon name="lock" size={13} />
              Utamakan sesi peramban
            </span>
          </div>
        </div>

        <div className="md:col-span-5">
          <p className="text-xs font-bold tracking-wider text-[var(--vx-text-primary)] uppercase">
            Batas Layanan & Saluran Darurat
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
            VEXORA memberikan informasi edukatif dan dukungan awal non-klinis, bukan diagnosis
            medis/psikologis, nasihat hukum mengikat, atau kanal investigasi HR/pelaporan
            pelanggaran resmi.
          </p>
          <div className="mt-3 rounded-xl bg-[var(--vx-surface-secondary)] p-3 text-xs text-[var(--vx-text-primary)]">
            <p className="font-semibold">
              Saluran Darurat Nasional: 112 / 119 | SEJIWA 119 ext. 8 | SAPA 129
            </p>
          </div>
        </div>
      </div>

      <div className="-mx-2 mt-8 flex flex-col justify-between gap-2 border-t border-[var(--vx-border-subtle)] px-2 pt-4 text-[11px] text-[var(--vx-text-secondary)] sm:-mx-4 sm:flex-row sm:items-center sm:px-4">
        <p>
          VEXORA: Proyek Akhir Mata Kuliah Psikologi Kerja 
        </p>
        <Link
          href="/my-journey#session-privacy"
          className="font-semibold text-[var(--vx-text-primary)] hover:underline"
        >
          Cara data Anda disimpan ›
        </Link>
      </div>
    </footer>
  );
}
