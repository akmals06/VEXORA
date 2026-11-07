import type { BatasKonfigurasiSkrining } from "@voxera/contracts";
import { StatusBadge } from "@/components/ui/status-badge";

export function KartuBatasSkriningPsikologis({
  batas_skrining,
}: {
  batas_skrining: BatasKonfigurasiSkrining | null;
}) {
  return (
    <section
      aria-labelledby="judul-batas-skrining"
      className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge
          label={
            batas_skrining?.status_ketersediaan === "menunggu_persetujuan_tim_psikologi"
              ? "Batas Instrumen Skrining Aktif"
              : "Pemeriksaan Awal Non-Diagnostik"
          }
          nada="info"
        />
      </div>
      <h2
        id="judul-batas-skrining"
        className="mt-2.5 text-sm font-bold text-[var(--vx-text-primary)]"
      >
        Batas Etik Pemeriksaan Awal Kesejahteraan Psikologis (Non-Diagnostik)
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
        {batas_skrining?.peringatan_bukan_diagnosis ??
          "VOXERA membedakan secara tegas antara navigasi masalah kerja, dukungan psikologis non-klinis, dan asesmen klinis oleh profesional berkualifikasi."}
      </p>
      <div className="mt-3 space-y-2 text-xs">
        <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
          <p className="font-bold text-[var(--vx-text-primary)]">1. Tidak Mengarang Kuesioner</p>
          <p className="mt-0.5 text-[var(--vx-text-secondary)]">
            Instrumen pemeriksaan awal hanya ditampilkan apabila daftar pertanyaan tervalidasi telah
            disetujui secara akademik.
          </p>
        </div>
        <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
          <p className="font-bold text-[var(--vx-text-primary)]">
            2. Tanpa Skor Diagnostik atau Label Klinis
          </p>
          <p className="mt-0.5 text-[var(--vx-text-secondary)]">
            VOXERA tidak pernah mengeluarkan label gangguan klinis atau persentase patologis.
          </p>
        </div>
        <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
          <p className="font-bold text-[var(--vx-text-primary)]">
            3. Penyimpanan Ketat Sesi Lokal (`session_local_only`)
          </p>
          <p className="mt-0.5 text-[var(--vx-text-secondary)]">
            Respons item pemeriksaan awal tidak pernah dikirim ke database server maupun disimpan ke
            akun opsional.
          </p>
        </div>
      </div>
    </section>
  );
}
