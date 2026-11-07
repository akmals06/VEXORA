import { Icon } from "@/components/ui/icons";

interface PropertiSaveBoundaryCard {
  ringkas?: boolean;
}

export function SaveBoundaryCard({ ringkas = false }: PropertiSaveBoundaryCard) {
  return (
    <section
      aria-labelledby="judul-batas-penyimpanan"
      className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
            <Icon name="shield" size={16} />
          </span>
          <div>
            <h3
              id="judul-batas-penyimpanan"
              className="text-sm font-bold text-[var(--vx-text-primary)]"
            >
              Transparansi Batas Penyimpanan Data (Minimisasi Data Opsi B)
            </h3>
            {!ringkas ? (
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                Seluruh eksplorasi VOXERA berjalan di peramban Anda secara bawaan. Akun opsional
                hanya menyimpan ringkasan kode jalur dan langkah tindak lanjut terstruktur.
              </p>
            ) : null}
          </div>
        </div>
        <span className="rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--vx-primary)]">
          Non-Pengawasan HR
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/80 bg-[#E7F6EF]/65 p-3.5 dark:border-emerald-800/60 dark:bg-emerald-950/30">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#166534] dark:text-emerald-300">
            <Icon name="check" size={14} />
            <span>Yang Dapat Disimpan ke Akun Opsional:</span>
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--vx-text-primary)]">
            <li>• Kategori masalah terstruktur (`issue_id`)</li>
            <li>• Kode jalur dukungan (`pathway_slug`, `outcome_class`)</li>
            <li>• Label judul ringkas perjalanan (maks. 240 karakter)</li>
            <li>• Daftar langkah tindak lanjut terstruktur (maks. 12 langkah)</li>
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)]/75 p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--vx-primary)]">
            <Icon name="lock" size={14} />
            <span>Yang Tidak Pernah Disimpan ke Server (Khusus Sesi Peramban):</span>
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--vx-text-primary)]">
            <li>• Catatan kronologi pribadi, curhatan, atau bukti sensitif</li>
            <li>• Jawaban teks bebas pada Draf Persiapan Percakapan</li>
            <li>• Nama atasan, rekan kerja, pelaku, atau nama perusahaan</li>
            <li>• Respons item pemeriksaan awal psikologis (`session_local_only`)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
