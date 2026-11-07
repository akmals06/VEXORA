"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/icons";

interface PropertiClearSessionModal {
  terbuka: boolean;
  ada_data_lokal?: boolean;
  tutup?: () => void;
  konfirmasi_bersihkan?: () => void;
  saat_tutup?: () => void;
  saat_konfirmasi_hapus?: () => void;
}

export function ClearSessionModal({
  terbuka,
  ada_data_lokal = true,
  tutup,
  konfirmasi_bersihkan,
  saat_tutup,
  saat_konfirmasi_hapus,
}: PropertiClearSessionModal) {
  const penangan_tutup = tutup ?? saat_tutup ?? (() => {});
  const penangan_konfirmasi = konfirmasi_bersihkan ?? saat_konfirmasi_hapus ?? (() => {});

  useEffect(() => {
    if (!terbuka) {
      return;
    }

    const tangani_keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        penangan_tutup();
      }
    };

    window.addEventListener("keydown", tangani_keydown);
    return () => {
      window.removeEventListener("keydown", tangani_keydown);
    };
  }, [terbuka, penangan_tutup]);

  if (!terbuka) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071735]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-modal-bersihkan-sesi"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-2xl sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#92400E] dark:bg-amber-950/60 dark:text-amber-200">
            <Icon name="trash" size={18} />
          </span>
          <div>
            <h2
              id="judul-modal-bersihkan-sesi"
              className="text-base font-bold text-[var(--vx-text-primary)]"
            >
              Bersihkan Sesi Peramban Lokal?
            </h2>
            <p className="text-xs text-[var(--vx-text-secondary)]">
              Kontrol privasi cepat untuk perangkat bersama atau kantor
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
          Tindakan ini akan menghapus seluruh data sementara yang tersimpan di peramban ini (
          <code>voxera_session_v1</code>), termasuk:
        </p>

        <ul className="mt-3 space-y-1.5 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5 text-xs text-[var(--vx-text-primary)]">
          <li>• Pilihan progres Navigator Masalah dan Jalur Dukungan aktif</li>
          <li>• Draf Persiapan Percakapan (termasuk jawaban teks bebas Anda)</li>
          <li>• Hasil Refleksi Makna Kerja di sesi peramban ini</li>
        </ul>

        <p className="mt-3 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
          {ada_data_lokal
            ? "Jika Anda menggunakan komputer kantor atau perangkat bersama, membersihkan sesi memastikan tidak ada teks draf yang tertinggal di peramban."
            : "Saat ini belum ada draf atau progres aktif di sesi peramban lokal Anda, namun Anda tetap dapat mengatur ulang penyimpanan sesi."}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={penangan_tutup}
            className="min-h-11 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              penangan_konfirmasi();
              penangan_tutup();
            }}
            className="min-h-11 rounded-full bg-[#991B1B] px-5 py-2 text-xs font-semibold text-white transition hover:bg-rose-800"
          >
            Ya, Bersihkan Sesi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
