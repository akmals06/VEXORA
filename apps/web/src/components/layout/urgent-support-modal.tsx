"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/icons";

interface PropertiUrgentSupportModal {
  terbuka: boolean;
  tutup?: () => void;
  saat_tutup?: () => void;
}

export function UrgentSupportModal({ terbuka, tutup, saat_tutup }: PropertiUrgentSupportModal) {
  const penangan_tutup = tutup ?? saat_tutup ?? (() => {});

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
      aria-labelledby="judul-modal-bantuan-darurat"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--vx-border-subtle)] pb-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#991B1B] dark:bg-rose-950/60 dark:text-rose-200">
              <Icon name="lifebuoy" size={20} />
            </span>
            <div>
              <span className="inline-block rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-semibold text-[#991B1B] dark:bg-rose-950/60 dark:text-rose-200">
                Prioritas Keselamatan & Perlindungan Segera
              </span>
              <h2
                id="judul-modal-bantuan-darurat"
                className="mt-1.5 text-lg font-bold text-[var(--vx-text-primary)]"
              >
                Bantuan Darurat & Keselamatan Diri
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                VEXORA adalah alat bantu pemetaan situasi kerja non-klinis dan bukan layanan gawat
                darurat. Jika Anda menghadapi ancaman fisik langsung atau krisis keselamatan diri,
                gunakan kanal resmi berikut sesuai konteks situasi Anda:
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={penangan_tutup}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
          >
            Tutup
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <article className="rounded-xl border border-[#FECACA] bg-[#FEE2E2]/45 p-4 dark:border-rose-800/70 dark:bg-rose-950/30">
            <h3 className="text-sm font-bold text-[#991B1B] dark:text-rose-200">
              1. Darurat Keselamatan Fisik Langsung (Immediate Physical Emergency)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-primary)]">
              Jika Anda menghadapi ancaman kekerasan fisik langsung, bahaya keselamatan jiwa, atau
              kedaruratan medis di lokasi kerja maupun di luar kantor:
            </p>
            <ul className="mt-2 space-y-1 text-xs font-medium text-[var(--vx-text-primary)]">
              <li>
                • <strong>Panggilan Darurat Terintegrasi 112</strong> (bebas pulsa pada wilayah
                pemerintah daerah yang telah mendukung integrasi layanan 112).
              </li>
              <li>
                • <strong>Kepolisian RI (110)</strong> atau{" "}
                <strong>Ambulans / Gawat Darurat Medis (119)</strong> serta Instalasi Gawat Darurat
                (IGD) rumah sakit terdekat.
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-4">
            <h3 className="text-sm font-bold text-[var(--vx-text-primary)]">
              2. Tekanan Psikologis Berat / Risiko Membahayakan Diri (Kemenkes RI)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              Untuk krisis emosional akut atau dorongan menyakiti diri:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--vx-text-primary)]">
              <li>
                • <strong>Healing119.id / Hotline 119 ext. 8</strong> (Kementerian Kesehatan RI).
              </li>
              <li>
                • <strong>Batas Layanan:</strong> Merupakan layanan{" "}
                <em>pertolongan pertama psikologis</em> (Psychological First Aid) dan konseling
                krisis awal, <strong>bukan terapi psikologis jangka panjang</strong>.
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-4">
            <h3 className="text-sm font-bold text-[var(--vx-text-primary)]">
              3. Kekerasan terhadap Perempuan dan Anak (SAPA 129)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              Kanal resmi Kementerian Pemberdayaan Perempuan dan Perlindungan Anak (KemenPPPA):
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--vx-text-primary)]">
              <li>
                • <strong>Hotline SAPA 129</strong> atau <strong>WhatsApp 08-111-129-129</strong>.
              </li>
              <li>
                • <strong>Batas Mandat:</strong> Memiliki{" "}
                <em>
                  mandat khusus perlindungan perempuan dan anak, bukan saluran keluhan kerja umum
                </em>{" "}
                atau sengketa administrasi HR biasa.
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-4">
            <h3 className="text-sm font-bold text-[var(--vx-text-primary)]">
              4. Pelecehan atau Kekerasan Seksual di Tempat Kerja
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              Berdasarkan pedoman perlindungan pekerja (Kepmenaker No. 88 Tahun 2023 & UU No. 12
              Tahun 2022 tentang TPKS):
            </p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--vx-text-primary)]">
              <li>
                •{" "}
                <strong>
                  Satgas Pencegahan dan Penanganan Kekerasan Seksual di perusahaan, jika tersedia /
                  telah dibentuk
                </strong>
                .
              </li>
              <li>
                • Jika pelaku adalah atasan langsung atau kanal internal tidak aman, gunakan
                pendampingan eksternal seperti <strong>UPTD PPA daerah</strong>,{" "}
                <strong>LBH</strong>, <strong>Komnas Perempuan</strong>, atau aparat penegak hukum.
              </li>
            </ul>
          </article>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--vx-border-subtle)] pt-4">
          <p className="text-xs text-[var(--vx-text-secondary)]">
            Membuka jendela ini tidak mengirim notifikasi apa pun ke perusahaan atau server.
          </p>
          <button
            type="button"
            onClick={penangan_tutup}
            className="min-h-11 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
          >
            Saya Mengerti, Kembali ke Halaman
          </button>
        </div>
      </div>
    </div>
  );
}
