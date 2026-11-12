"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UrgentSupportModal } from "@/components/layout/urgent-support-modal";
import { Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DAFTAR_KARTU_MASALAH_BERANDA,
  DAFTAR_PILAR_PRODUK,
  PETA_LABEL_KELAS_HASIL,
  PETA_LABEL_MASALAH,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

const IKON_SITUASI = [
  "briefcase",
  "users",
  "alert-triangle",
  "scale",
  "layers",
  "book",
  "sparkle",
  "cpu",
  "heart-handshake",
  "help-circle",
] as const;

const AKSEN_SITUASI = [
  "#EAF3FF text-[#2463A6]",
  "#F3ECFF text-[#7656B3]",
  "#FFF0F0 text-[#B54D59]",
  "#F3F0FF text-[#6C5AB2]",
  "#EEF5FF text-[#426A9D]",
  "#EAF8F2 text-[#328265]",
  "#FFF5E6 text-[#A96E1F]",
  "#EAF5FF text-[#3176A4]",
  "#FFF0F4 text-[#B55072]",
  "#F1F4F8 text-[#61738C]",
] as const;

export function HomeView() {
  const { sesi_lokal, pengguna, status_autentikasi } = gunakan_konteks_aplikasi();
  const [modal_darurat_terbuka, atur_modal_darurat_terbuka] = useState<boolean>(false);

  const perjalanan_aktif = sesi_lokal.perjalanan_dukungan_aktif;
  const draf_percakapan = sesi_lokal.draf_persiapan_percakapan;
  const ada_draf_percakapan =
    draf_percakapan.hasil_draf !== null ||
    draf_percakapan.apa_yang_terjadi_dan_waktu.trim().length > 0;
  const jumlah_langkah_selesai = Object.values(sesi_lokal.status_langkah_lokal).filter(
    (status) => status === "selesai",
  ).length;
  const total_langkah = perjalanan_aktif?.daftar_langkah_rekomendasi.length ?? 0;
  const progres_persen =
    total_langkah > 0 ? Math.round((jumlah_langkah_selesai / total_langkah) * 100) : 0;

  const sapaan_pengguna =
    status_autentikasi === "terautentikasi" && pengguna ? `Halo, ${pengguna.nama_alias}.` : "Halo.";

  return (
    <div className="space-y-4 sm:space-y-5">
      <section
        aria-label="Mulai menggunakan VEXORA"
        className="vx-hero-surface overflow-hidden rounded-3xl border border-[var(--vx-border-soft)] p-4 shadow-[var(--vx-shadow-card)] sm:p-6 lg:p-7"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-center lg:gap-6">
          <div className="max-w-3xl py-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Selamat datang di VEXORA 👋" nada="utama" />
            </div>
            <p className="mt-3 text-sm font-bold text-[var(--vx-primary)]">{sapaan_pengguna}</p>
            <h1 className="mt-1 max-w-2xl text-3xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-4xl sm:leading-tight">
              Rekan dukungan kerja Anda.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--vx-text-secondary)] sm:text-base">
              Pahami situasi, jelajahi pilihan dukungan, dan siapkan langkah berikutnya dengan ritme
              Anda sendiri.
            </p>
            <div className="mt-5 rounded-2xl border border-[#C9DDF7] bg-white/75 p-4 sm:p-5">
              <h2 className="text-lg font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-xl">
                Apa yang sedang Anda hadapi di tempat kerja?
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--vx-text-secondary)]">
                Ceritakan situasinya lewat beberapa pilihan singkat untuk menemukan opsi dukungan
                yang sesuai.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/navigate"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#123C78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0C2E61] sm:justify-start"
                >
                  <span>Jelajahi situasi</span>
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link
                  href="/navigate?issue=unsure"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--vx-border-soft)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary)] sm:justify-start"
                >
                  Saya belum yakin
                </Link>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                Tidak perlu menyebut nama atau menuliskan detail sensitif untuk memulai.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[480px] space-y-3 lg:max-w-none">
            <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#EAF2FD] sm:h-[300px] lg:h-[330px]">
              <Image
                src="/images/teamwork-meeting.png"
                alt="Rekan kerja berdiskusi dan berkolaborasi di kantor"
                width={2500}
                height={2500}
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="h-full w-full object-contain"
              />
            </div>
            {perjalanan_aktif ? (
              <aside className="rounded-2xl border border-[var(--vx-border-soft)] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                      <Icon name="route" size={18} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-[var(--vx-text-secondary)]">
                        Perjalanan Anda
                      </p>
                      <p className="text-sm font-extrabold text-[var(--vx-text-primary)]">
                        {perjalanan_aktif.judul_perjalanan}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/journey"
                    aria-label="Lanjutkan perjalanan"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
                  >
                    <Icon name="arrow-right" size={16} />
                  </Link>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--vx-text-secondary)]">
                  <span>
                    {jumlah_langkah_selesai} dari {total_langkah} langkah selesai
                  </span>
                  <span>{progres_persen}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--vx-surface-secondary)]">
                  <div
                    className="h-full rounded-full bg-[#2D75C7] transition-all"
                    style={{ width: `${progres_persen}%` }}
                  />
                </div>
              </aside>
            ) : (
              <Link
                href="/prepare"
                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-[#FFF8E8] p-4 text-amber-950 transition hover:border-amber-300 hover:bg-[#FFF4D8] dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
              >
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200">
                    <Icon name="chat" size={17} />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold opacity-70">
                      Langkah berikutnya
                    </span>
                    <span className="block text-sm font-extrabold">
                      {ada_draf_percakapan ? "Lanjutkan draf percakapan" : "Siapkan percakapan"}
                    </span>
                  </span>
                </span>
                <Icon name="chevron-right" size={16} />
              </Link>
            )}
            <Link
              href="/my-journey#session-privacy"
              className="flex items-start gap-3 rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 transition hover:border-[#9EBCE2]"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="lock" size={17} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-[var(--vx-text-primary)]">
                  Privasi Anda
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                  Catatan pribadi tinggal di peramban ini dan tidak dikirim ke server.
                </span>
              </span>
              <Icon
                name="arrow-up-right"
                size={15}
                className="ml-auto shrink-0 text-[var(--vx-primary)]"
              />
            </Link>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="judul-pilih-situasi"
        className="rounded-3xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--vx-primary)]">
              Mulai dari yang paling relevan
            </p>
            <h2
              id="judul-pilih-situasi"
              className="mt-1 text-lg font-extrabold text-[var(--vx-text-primary)]"
            >
              Pilih situasi kerja
            </h2>
          </div>
          <span className="text-xs text-[var(--vx-text-secondary)]">
            Anda dapat mengubah pilihan kapan saja
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {DAFTAR_KARTU_MASALAH_BERANDA.map((item, index) => {
            return (
              <Link
                key={item.id}
                href={`/navigate?issue=${item.id}`}
                className="group flex min-h-[76px] items-center gap-2.5 rounded-xl border border-[var(--vx-border-subtle)] bg-[var(--vx-surface-primary)] p-3 transition hover:-translate-y-0.5 hover:border-[#9EBCE2] hover:shadow-md"
              >
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${AKSEN_SITUASI[index]}`}
                >
                  <Icon name={IKON_SITUASI[index]} size={17} />
                </span>
                <span className="min-w-0 text-xs font-bold leading-snug text-[var(--vx-text-primary)] group-hover:text-[var(--vx-primary)]">
                  {item.judul}
                </span>
                <Icon
                  name="chevron-right"
                  size={14}
                  className="ml-auto text-[var(--vx-text-secondary)]"
                />
              </Link>
            );
          })}
        </div>
      </section>
      {/* Lanjutkan aktivitas sebelumnya bila ada */}
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
                  ? `Anda sedang menyusun: ${perjalanan_aktif.judul_perjalanan}`
                  : "Draf percakapan Anda masih tersimpan di peramban ini"}
              </h2>
              <p className="text-xs text-[var(--vx-text-secondary)]">
                {perjalanan_aktif
                  ? `${PETA_LABEL_MASALAH[perjalanan_aktif.id_masalah_utama]} • Lihat dan lanjutkan pilihan langkah Anda.`
                  : "Lanjutkan menyusun poin bicara. Draf hanya tersimpan di sesi peramban ini."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {perjalanan_aktif ? (
                <Link
                  href="/journey"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#0C264F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  <span>Lihat langkah saya</span>
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

      <div className="space-y-4">
        <section aria-label="Fitur lainnya" className="grid gap-3 md:grid-cols-2">
          <Link
            href="/prepare"
            className="group rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 transition hover:border-[#9BB8E0] hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="chat" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[var(--vx-text-primary)] group-hover:text-[var(--vx-primary)]">
                  Siapkan percakapan
                </h2>
                <p className="text-xs text-[var(--vx-text-secondary)]">
                  Susun poin bicara sebelum berdiskusi dengan pihak lain.
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[var(--vx-text-secondary)]">
              Draf hanya disimpan di sesi peramban ini.
            </p>
          </Link>
          <Link
            href="/scenarios"
            className="group rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 transition hover:border-[#9BB8E0] hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="book" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[var(--vx-text-primary)] group-hover:text-[var(--vx-primary)]">
                  Lihat contoh situasi
                </h2>
                <p className="text-xs text-[var(--vx-text-secondary)]">
                  Coba simulasi pilihan dan lihat direktori dukungan.
                </p>
              </div>
            </div>
          </Link>
        </section>

        <details className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5">
          <summary className="cursor-pointer text-sm font-bold text-[var(--vx-text-primary)]">
            Tentang VEXORA dan cara kerjanya
            <span className="mt-1 block text-xs font-normal text-[var(--vx-text-secondary)]">
              Pelajari dukungan yang tersedia dan batas layanan.
            </span>
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
                    5 Pilar Dukungan Terintegrasi VEXORA
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

            {/* Penjelasan tahapan singkat */}
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
                    Cara kerja VEXORA
                  </h2>
                  <p className="text-xs text-[var(--vx-text-secondary)]">
                    Dari memilih situasi sampai meninjau langkah berikutnya.
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
                  <span>1. Pilih situasi</span>
                  <span>2. Pahami konteks</span>
                  <span>3. Lihat opsi</span>
                  <span>4. Siapkan bicara</span>
                  <span>5. Tinjau lagi</span>
                </div>
              </div>
            </section>
          </div>
        </details>
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
