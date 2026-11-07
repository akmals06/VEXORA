"use client";

import Link from "next/link";
import { useState } from "react";
import { UrgentSupportModal } from "@/components/layout/urgent-support-modal";
import { dapatkan_ikon_domain_masalah, Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DAFTAR_KARTU_MASALAH_BERANDA,
  DAFTAR_PILAR_PRODUK,
  PETA_LABEL_KELAS_HASIL,
  PETA_LABEL_MASALAH,
  PETA_LABEL_PENERIMA,
  PETA_LABEL_TIPE_DUKUNGAN,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

export function HomeView() {
  const { sesi_lokal, pengguna, status_autentikasi } = gunakan_konteks_aplikasi();
  const [modal_darurat_terbuka, atur_modal_darurat_terbuka] = useState<boolean>(false);

  const perjalanan_aktif = sesi_lokal.perjalanan_dukungan_aktif;
  const draf_percakapan = sesi_lokal.draf_persiapan_percakapan;
  const ada_draf_percakapan =
    draf_percakapan.hasil_draf !== null ||
    draf_percakapan.apa_yang_terjadi_dan_waktu.trim().length > 0;

  const sapaan_pengguna =
    status_autentikasi === "terautentikasi" && pengguna ? `Halo, ${pengguna.nama_alias}.` : "Halo.";

  const total_langkah_aktif = perjalanan_aktif?.daftar_langkah_rekomendasi.length ?? 0;
  const jumlah_langkah_selesai = perjalanan_aktif
    ? perjalanan_aktif.daftar_langkah_rekomendasi.filter(
        (langkah) =>
          (sesi_lokal.status_langkah_lokal[langkah.kode_langkah] ?? langkah.status_langkah) ===
          "selesai",
      ).length
    : 0;
  const persentase_progres =
    total_langkah_aktif > 0
      ? Math.round((jumlah_langkah_selesai / total_langkah_aktif) * 100)
      : ada_draf_percakapan
        ? 40
        : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Bento Dashboard Grid (Matches GeneX 3-Column Bento Proportions: 5 / 3 / 4) */}
      <section
        aria-label="Ringkasan utama ruang kerja VOXERA"
        className="grid grid-cols-1 gap-4 lg:grid-cols-12"
      >
        {/* Left Hero Card: Greeting + Waveform Pathway Illustration + Primary Actions */}
        <div className="vx-hero-surface relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[var(--vx-border-soft)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Ruang Eksplorasi Aman & Rahasia" nada="utama" />
              <StatusBadge
                label={
                  status_autentikasi === "terautentikasi" && pengguna
                    ? `Akun: ${pengguna.nama_alias}`
                    : "Mode Sesi Lokal"
                }
                nada="aman"
              />
            </div>

            <p className="mt-3.5 text-sm font-bold text-[var(--vx-primary)]">{sapaan_pengguna}</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-[28px] sm:leading-[1.2]">
              Apa yang sedang Anda hadapi di tempat kerja?
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
              Jelajahi situasi kerja Anda secara tenang dan terstruktur, pahami opsi aman, dan
              siapkan langkah berikutnya. Tanpa paksaan login dan bukan kanal pengawasan HR.
            </p>
          </div>

          {/* Soft Blue Layered Abstract Pathway Visual (Matches GeneX Hero Graphic Balance) */}
          <div
            aria-hidden="true"
            className="my-4 overflow-hidden rounded-2xl border border-[#C9DCF4]/80 bg-gradient-to-r from-[#E3EEFC] via-[#EEF5FD] to-[#DAE8FA] p-3.5 dark:border-[#28477A] dark:from-[#132C56] dark:via-[#173566] dark:to-[#10274D]"
          >
            <svg
              viewBox="0 0 420 96"
              className="h-20 w-full text-[#305FA7] dark:text-[#6B9CE8]"
              fill="none"
            >
              <path
                d="M12 66 C 72 22, 128 22, 188 54 C 248 84, 312 18, 408 38"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M12 42 C 78 78, 140 72, 202 38 C 264 6, 330 74, 408 56"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              <circle cx="56" cy="40" r="5" fill="currentColor" />
              <circle cx="144" cy="36" r="6" fill="#0A2552" className="dark:fill-white" />
              <circle cx="232" cy="62" r="5" fill="currentColor" />
              <circle cx="332" cy="34" r="6" fill="#0A2552" className="dark:fill-white" />
            </svg>
            <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-[#16243A] dark:text-[#DBEAFE]">
              <span>1. Pahami Situasi</span>
              <span>2. Cek Opsi Aman</span>
              <span>3. Siapkan Komunikasi</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/navigate"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#13356B]"
            >
              <span>Mulai Pemetaan Situasi</span>
              <Icon name="arrow-right" size={15} />
            </Link>
            <button
              type="button"
              onClick={() => atur_modal_darurat_terbuka(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEE2E2]/80 px-4 py-2.5 text-xs font-semibold text-[#991B1B] transition hover:bg-[#FEE2E2] dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
            >
              <Icon name="lifebuoy" size={14} />
              <span>Bantuan Darurat & Keselamatan</span>
            </button>
          </div>
        </div>

        {/* Middle Column Stack: Active Situation Summary + Circular Readiness Ring (Matches GeneX Middle Column) */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Top Metric Card: Current Session Focus */}
          <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[var(--vx-text-secondary)]">
                  Status Pemetaan Sesi
                </p>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                  <Icon name="compass" size={15} />
                </span>
              </div>

              <p className="mt-2 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)]">
                {perjalanan_aktif
                  ? PETA_LABEL_MASALAH[perjalanan_aktif.id_masalah_utama]
                  : "Siap Memetakan"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                {perjalanan_aktif
                  ? `Fokus: ${PETA_LABEL_TIPE_DUKUNGAN[perjalanan_aktif.jalur_dukungan_utama]}`
                  : "Pilih salah satu dari 10 kategori situasi kerja di bawah untuk membuka jalur dukungan."}
              </p>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--vx-surface-secondary)]">
                <div
                  className="h-full rounded-full bg-[#305FA7] transition-all"
                  style={{
                    width: `${perjalanan_aktif ? Math.max(25, persentase_progres) : 12}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[var(--vx-text-secondary)]">
                <span>Identifikasi</span>
                <span>Opsi Aman</span>
                <span>Tindakan</span>
              </div>
            </div>
          </div>

          {/* Bottom Metric Card: Progress Ring (Matches GeneX Longevity Score 85% Card Structure) */}
          <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--vx-text-secondary)]">
                  Kesiapan Langkah
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--vx-text-primary)]">
                  {persentase_progres}%
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--vx-text-secondary)]">
                  {total_langkah_aktif > 0
                    ? `${jumlah_langkah_selesai} dari ${total_langkah_aktif} langkah selesai`
                    : "Belum ada langkah aktif"}
                </p>
              </div>

              <div className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center">
                <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-[#E8F0FA] dark:stroke-[#1E3B6B]"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-[#305FA7] dark:stroke-[#6395E6]"
                    strokeWidth="6"
                    strokeDasharray="163.36"
                    strokeDashoffset={163.36 - (163.36 * persentase_progres) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                  <Icon name="check" size={15} />
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--vx-border-subtle)] pt-2.5 text-[11px] font-semibold">
              <span className="text-[var(--vx-text-secondary)]">Progres Langkah</span>
              <Link
                href={perjalanan_aktif ? "/journey" : "/navigate"}
                className="text-[var(--vx-primary)] hover:underline"
              >
                {perjalanan_aktif ? "Buka Jalur ›" : "Mulai Sekarang ›"}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column Card: Action Channels & Recommendations (Matches GeneX Appointments Column) */}
        <div className="flex flex-col justify-between rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)]/75 p-4 shadow-[var(--vx-shadow-card)] sm:p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[var(--vx-text-primary)]">
                Kanal & Rencana Tindakan Cepat
              </h2>
              <StatusBadge label="Non-Adjudikatif" nada="netral" />
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Action Item 1 */}
              <div className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5 shadow-2xs">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDE9F7] text-[#0A2552]">
                    <Icon name="chat" size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                      Persiapan Bicara Terstruktur
                    </p>
                    <p className="text-[11px] text-[var(--vx-primary)]">
                      6 Penerima (Manajer, HR, Psikolog, Konselor, LBH, Mentor)
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--vx-text-secondary)]">
                      {ada_draf_percakapan
                        ? `Draf aktif untuk: ${PETA_LABEL_PENERIMA[draf_percakapan.target_penerima]}`
                        : "Susun poin fakta, dampak, dan permintaan konkret."}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Link
                    href="/prepare"
                    className="inline-flex min-h-8 items-center rounded-full bg-[#0C264F] px-3.5 py-1 text-[11px] font-semibold text-white transition hover:bg-[#13356B]"
                  >
                    Siapkan Draf
                  </Link>
                </div>
              </div>

              {/* Action Item 2 */}
              <div className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5 shadow-2xs">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDE9F7] text-[#0A2552]">
                    <Icon name="book" size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                      Simulasi Skenario & Direktori
                    </p>
                    <p className="text-[11px] text-[var(--vx-primary)]">
                      4 Skenario Keputusan + Refleksi Makna Kerja
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--vx-text-secondary)]">
                      Pelajari konsekuensi tindakan sebelum mengambil langkah nyata.
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Link
                    href="/scenarios"
                    className="inline-flex min-h-8 items-center rounded-full bg-[#0C264F] px-3.5 py-1 text-[11px] font-semibold text-white transition hover:bg-[#13356B]"
                  >
                    Eksplorasi Skenario
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compact Recommendation Card (Matches GeneX Recommendations Strip) */}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="shield" size={15} />
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                  Prinsip Keamanan Pekerja
                </p>
                <p className="text-[11px] text-[var(--vx-text-secondary)]">
                  Bukan diagnosis klinis & bukan vonis hukum
                </p>
              </div>
            </div>
            <Link
              href="/my-journey"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
              aria-label="Buka Perjalanan Saya"
            >
              <Icon name="arrow-up-right" size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Active Session Continuation Banner */}
      {perjalanan_aktif || ada_draf_percakapan ? (
        <section
          aria-labelledby="judul-lanjutkan-sesi"
          className="rounded-[20px] border border-[#B6CBE8] bg-[var(--vx-surface-secondary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5"
        >
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label="Sesi Lokal Aktif" nada="aman" />
                {perjalanan_aktif ? (
                  <StatusBadge
                    label={PETA_LABEL_KELAS_HASIL[perjalanan_aktif.kelas_hasil_utama]}
                    nada="utama"
                  />
                ) : null}
              </div>
              <h2
                id="judul-lanjutkan-sesi"
                className="text-base font-bold text-[var(--vx-text-primary)]"
              >
                {perjalanan_aktif
                  ? `Jalur Aktif: ${perjalanan_aktif.judul_perjalanan}`
                  : "Anda memiliki Draf Persiapan Percakapan yang tersimpan di peramban ini"}
              </h2>
              <p className="text-xs text-[var(--vx-text-secondary)]">
                {perjalanan_aktif
                  ? `${PETA_LABEL_MASALAH[perjalanan_aktif.id_masalah_utama]} • Dukungan utama: ${PETA_LABEL_TIPE_DUKUNGAN[perjalanan_aktif.jalur_dukungan_utama]}`
                  : "Lanjutkan menyusun poin bicara Anda sebelum berdiskusi dengan pihak terkait."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {perjalanan_aktif ? (
                <Link
                  href="/journey"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#0C264F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  <span>Lanjutkan Jalur Dukungan</span>
                  <Icon name="arrow-right" size={14} />
                </Link>
              ) : null}
              <Link
                href="/prepare"
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
              >
                {ada_draf_percakapan ? "Buka Draf Percakapan" : "Siapkan Percakapan"}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Lower Bento Workspace Grid: 10 Issue Cards (Left 7 cols) + 5 Pillars & Workflow Curve (Right 5 cols) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left 7 Columns: 10 Approved Issue Cards */}
        <section
          aria-labelledby="judul-kategori-masalah"
          className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5 lg:col-span-7"
        >
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                Langkah 1: Identifikasi Situasi
              </p>
              <h2
                id="judul-kategori-masalah"
                className="mt-0.5 text-lg font-extrabold tracking-tight text-[var(--vx-text-primary)]"
              >
                Pilih Situasi yang Paling Mendekati Kondisi Anda (10 Kategori)
              </h2>
            </div>
            <Link
              href="/navigate?issue=unsure"
              className="text-xs font-semibold text-[var(--vx-primary)] hover:underline"
            >
              Masalah terasa bercampur? Mulai dari sini ›
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DAFTAR_KARTU_MASALAH_BERANDA.map((kartu) => {
              const adalah_unsure = kartu.id === "unsure";
              const nama_ikon = dapatkan_ikon_domain_masalah(kartu.id);

              return (
                <Link
                  key={kartu.id}
                  href={`/navigate?issue=${kartu.id}`}
                  className={`group flex flex-col justify-between rounded-2xl border p-3.5 transition focus:outline-none ${
                    adalah_unsure
                      ? "border-[#B6CBE8] bg-[var(--vx-surface-secondary)]/85 hover:border-[#305FA7]"
                      : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/65 hover:border-[#305FA7] hover:bg-[var(--vx-surface-primary)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                        <Icon name={nama_ikon} size={16} />
                      </span>
                      <StatusBadge
                        label={kartu.tag_kategori}
                        nada={adalah_unsure ? "utama" : "netral"}
                      />
                    </div>

                    <h3 className="mt-2.5 text-sm font-bold text-[var(--vx-text-primary)] group-hover:text-[var(--vx-primary)]">
                      {kartu.judul}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                      {kartu.subjudul_singkat}
                    </p>
                  </div>

                  <div className="mt-3 border-t border-[var(--vx-border-subtle)] pt-2.5">
                    <p className="text-[11px] text-[var(--vx-text-secondary)]">
                      <span className="font-semibold text-[var(--vx-text-primary)]">Contoh: </span>
                      {kartu.contoh_cepat}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[var(--vx-primary)]">
                      <span>Mulai Pemetaan</span>
                      <Icon name="chevron-right" size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Right 5 Columns Stack: 5 Product Pillars Card + Workflow Continuity Curve Card */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* 5 Product Pillars Card (Matches GeneX Supplements Plan Card) */}
          <section
            aria-labelledby="judul-pilar-produk"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                  Arsitektur Perlindungan Pekerja
                </p>
                <h2
                  id="judul-pilar-produk"
                  className="mt-0.5 text-base font-extrabold text-[var(--vx-text-primary)]"
                >
                  5 Pilar Dukungan Terintegrasi VOXERA
                </h2>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="layers" size={16} />
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {DAFTAR_PILAR_PRODUK.map((pilar, indeks) => (
                <article
                  key={pilar.id}
                  className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/70 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0A2552] text-[11px] font-bold text-white">
                        0{indeks + 1}
                      </span>
                      <h3 className="text-xs font-bold text-[var(--vx-text-primary)]">
                        {pilar.judul}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[var(--vx-surface-secondary)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--vx-primary)]">
                      Aktif
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                    {pilar.deskripsi}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--vx-primary)]">
                    Landasan: {pilar.fokus_disiplin}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Workflow Stages Curve Card (Matches GeneX Bottom-Right Health Analytics Card) */}
          <section
            aria-labelledby="judul-alur-kerja"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2
                  id="judul-alur-kerja"
                  className="text-sm font-bold text-[var(--vx-text-primary)]"
                >
                  Tahapan Navigasi & Penguatan Kapasitas
                </h2>
                <p className="text-xs text-[var(--vx-text-secondary)]">
                  Alur bertahap dari identifikasi masalah hingga evaluasi tindak lanjut
                </p>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="sparkle" size={15} />
              </span>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl bg-[var(--vx-bg-workspace)] p-3">
              <svg viewBox="0 0 360 110" className="h-24 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="vx-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#305FA7" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#305FA7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 86 C 65 82, 95 48, 145 56 C 195 64, 235 18, 285 26 C 315 32, 335 45, 350 38 L 350 102 L 10 102 Z"
                  fill="url(#vx-area-grad)"
                />
                <path
                  d="M10 86 C 65 82, 95 48, 145 56 C 195 64, 235 18, 285 26 C 315 32, 335 45, 350 38"
                  stroke="#305FA7"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="56" r="4" fill="#0A2552" />
                <circle cx="268" cy="24" r="5" fill="#305FA7" />
              </svg>
              <div className="mt-1 grid grid-cols-5 text-center text-[10px] font-semibold text-[var(--vx-text-secondary)]">
                <span>1. Pilih</span>
                <span>2. Petakan</span>
                <span>3. Jalur</span>
                <span>4. Draf</span>
                <span>5. Pantau</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Save Boundary Transparency Card */}
      <SaveBoundaryCard ringkas />

      <UrgentSupportModal
        terbuka={modal_darurat_terbuka}
        tutup={() => atur_modal_darurat_terbuka(false)}
      />
    </div>
  );
}
