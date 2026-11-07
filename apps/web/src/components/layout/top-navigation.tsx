"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClearSessionModal } from "@/components/layout/clear-session-modal";
import { UrgentSupportModal } from "@/components/layout/urgent-support-modal";
import { Icon, type NamaIkon } from "@/components/ui/icons";
import { klien_api_voxera } from "@/lib/api-client";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

interface ItemNavigasi {
  href: string;
  label_topbar: string;
  label_sidebar: string;
  label_pendek: string;
  ikon: NamaIkon;
}

export const DAFTAR_TAUTAN_NAVIGASI: readonly ItemNavigasi[] = [
  {
    href: "/",
    label_topbar: "Beranda Masalah",
    label_sidebar: "Ringkasan Utama",
    label_pendek: "Beranda",
    ikon: "dashboard",
  },
  {
    href: "/navigate",
    label_topbar: "Navigator",
    label_sidebar: "Eksplorasi Situasi",
    label_pendek: "Navigator",
    ikon: "compass",
  },
  {
    href: "/journey",
    label_topbar: "Jalur Dukungan",
    label_sidebar: "Jalur Dukungan",
    label_pendek: "Jalur",
    ikon: "route",
  },
  {
    href: "/prepare",
    label_topbar: "Persiapan Bicara",
    label_sidebar: "Persiapan Percakapan",
    label_pendek: "Persiapan",
    ikon: "chat",
  },
  {
    href: "/scenarios",
    label_topbar: "Skenario Kerja",
    label_sidebar: "Skenario & Direktori",
    label_pendek: "Skenario",
    ikon: "book",
  },
  {
    href: "/my-journey",
    label_topbar: "Perjalanan Saya",
    label_sidebar: "Perjalanan Saya",
    label_pendek: "Perjalanan",
    ikon: "bookmark",
  },
] as const;

export function dapatkan_inisial_alias(nama: string): string {
  const bagian = nama.trim().split(/\s+/).filter(Boolean);
  if (bagian.length === 0) {
    return "VX";
  }
  if (bagian.length === 1) {
    return (bagian[0] ?? "VX").slice(0, 2).toUpperCase();
  }
  return `${bagian[0]?.[0] ?? "V"}${bagian[1]?.[0] ?? "X"}`.toUpperCase();
}

export function TopNavigation() {
  const pathname = usePathname();
  const {
    sesi_lokal,
    ada_data_lokal,
    bersihkan_sesi_lokal,
    pengguna,
    status_autentikasi,
    tetapkan_pengguna_terautentikasi,
    mode_tema,
    ubah_mode_tema,
  } = gunakan_konteks_aplikasi();

  const [modal_darurat_terbuka, atur_modal_darurat_terbuka] = useState<boolean>(false);
  const [modal_bersihkan_terbuka, atur_modal_bersihkan_terbuka] = useState<boolean>(false);
  const [menu_seluler_terbuka, atur_menu_seluler_terbuka] = useState<boolean>(false);
  const [menu_akun_terbuka, atur_menu_akun_terbuka] = useState<boolean>(false);
  const [pesan_notifikasi_sesi, atur_pesan_notifikasi_sesi] = useState<string | null>(null);

  useEffect(() => {
    atur_menu_seluler_terbuka(false);
    atur_menu_akun_terbuka(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu_seluler_terbuka && !menu_akun_terbuka) {
      return;
    }
    const tangani_escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        atur_menu_seluler_terbuka(false);
        atur_menu_akun_terbuka(false);
      }
    };
    window.addEventListener("keydown", tangani_escape);
    return () => window.removeEventListener("keydown", tangani_escape);
  }, [menu_seluler_terbuka, menu_akun_terbuka]);

  const tangani_konfirmasi_bersihkan = () => {
    bersihkan_sesi_lokal();
    atur_pesan_notifikasi_sesi("Sesi peramban lokal telah dibersihkan.");
    window.setTimeout(() => {
      atur_pesan_notifikasi_sesi(null);
    }, 3500);
  };

  const tangani_keluar_cepat = async () => {
    try {
      await klien_api_voxera.autentikasi.keluar();
    } catch {
      // Tetap lanjutkan pembersihan state autentikasi lokal
    }
    tetapkan_pengguna_terautentikasi(null);
    atur_menu_akun_terbuka(false);
  };

  const inisial_pengguna = pengguna ? dapatkan_inisial_alias(pengguna.nama_alias) : "SL";

  const href_cta_utama = sesi_lokal.perjalanan_dukungan_aktif ? "/journey" : "/navigate";
  const label_cta_utama = sesi_lokal.perjalanan_dukungan_aktif ? "Lihat Jalur" : "Mulai Navigasi";

  return (
    <>
      <header className="mb-3 border-b border-[var(--vx-border-subtle)] pb-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: VOXERA Wordmark */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-xl px-1.5 py-1 focus:outline-none"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A2552] text-sm font-extrabold tracking-tight text-white shadow-xs transition group-hover:bg-[#13356B]">
                VX
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-[var(--vx-text-primary)]">
                  VOXERA
                </span>
                <span className="hidden text-[11px] font-medium text-[var(--vx-text-secondary)] sm:inline">
                  Perlindungan & Kesejahteraan Kerja
                </span>
              </div>
            </Link>
          </div>

          {/* Middle: Compact Top Navigation Links */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 xl:flex">
            {DAFTAR_TAUTAN_NAVIGASI.map((tautan) => {
              const aktif =
                tautan.href === "/" ? pathname === "/" : pathname.startsWith(tautan.href);
              return (
                <Link
                  key={tautan.href}
                  href={tautan.href}
                  aria-current={aktif ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    aktif
                      ? "bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]"
                      : "text-[var(--vx-text-secondary)] hover:bg-[var(--vx-surface-secondary)]/60 hover:text-[var(--vx-text-primary)]"
                  }`}
                >
                  {tautan.label_topbar}
                </Link>
              );
            })}
          </nav>

          {/* Right: Action Controls */}
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={ubah_mode_tema}
              aria-label={
                mode_tema === "terang"
                  ? "Aktifkan tampilan tenang (gelap)"
                  : "Aktifkan tampilan terang"
              }
              className="hidden min-h-11 items-center gap-1.5 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)] md:inline-flex"
            >
              <Icon name={mode_tema === "terang" ? "moon" : "sun"} size={15} />
              <span className="hidden 2xl:inline">
                {mode_tema === "terang" ? "Mode Tenang" : "Mode Terang"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => atur_modal_bersihkan_terbuka(true)}
              className="hidden min-h-11 items-center gap-1.5 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)] md:inline-flex"
            >
              <Icon name="trash" size={14} />
              <span className="hidden lg:inline">Bersihkan Sesi</span>
              {ada_data_lokal ? (
                <span
                  aria-label="Ada data sesi lokal aktif"
                  className="h-2 w-2 rounded-full bg-[#305FA7]"
                />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => atur_modal_darurat_terbuka(true)}
              aria-label="Bantuan Darurat"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEE2E2]/85 px-2.5 py-1.5 text-xs font-semibold text-[#991B1B] transition hover:bg-[#FEE2E2] sm:px-3 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
            >
              <Icon name="lifebuoy" size={15} />
              <span className="hidden sm:inline">Bantuan Darurat</span>
            </button>

            {/* Account Status Control / Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => atur_menu_akun_terbuka((sebelumnya) => !sebelumnya)}
                aria-expanded={menu_akun_terbuka}
                aria-label={
                  status_autentikasi === "terautentikasi" && pengguna
                    ? `Menu akun ${pengguna.nama_alias}`
                    : "Status sesi lokal dan akun opsional"
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-2.5 py-1.5 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary)]"
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                    status_autentikasi === "terautentikasi" && pengguna
                      ? "bg-[#0A2552] text-white"
                      : "bg-[var(--vx-surface-secondary-alt)] text-[var(--vx-primary)]"
                  }`}
                >
                  {inisial_pengguna}
                </span>
                <span className="hidden max-w-[110px] truncate lg:inline">
                  {status_autentikasi === "terautentikasi" && pengguna
                    ? `Akun: ${pengguna.nama_alias}`
                    : "Sesi Lokal"}
                </span>
              </button>

              {menu_akun_terbuka ? (
                <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5 shadow-xl">
                  {status_autentikasi === "terautentikasi" && pengguna ? (
                    <div className="space-y-3">
                      <div className="border-b border-[var(--vx-border-subtle)] pb-2.5">
                        <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                          {pengguna.nama_alias}
                        </p>
                        <p className="truncate text-[11px] text-[var(--vx-text-secondary)]">
                          {pengguna.email}
                        </p>
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#E7F6EF] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
                          Akun Opsional Aktif
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Link
                          href="/my-journey"
                          onClick={() => atur_menu_akun_terbuka(false)}
                          className="inline-flex min-h-10 items-center justify-between rounded-xl bg-[var(--vx-surface-secondary)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
                        >
                          <span>Buka Perjalanan Saya</span>
                          <Icon name="chevron-right" size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void tangani_keluar_cepat()}
                          className="inline-flex min-h-10 items-center justify-between rounded-xl border border-[var(--vx-border-soft)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary)]"
                        >
                          <span>Keluar Akun (Jaga Sesi Lokal)</span>
                          <Icon name="logout" size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-b border-[var(--vx-border-subtle)] pb-2.5">
                        <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                          Mode Sesi Lokal Aktif
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--vx-text-secondary)]">
                          Seluruh fitur utama dapat digunakan tanpa akun. Masuk opsional hanya untuk
                          menyimpan langkah lintas perangkat.
                        </p>
                      </div>
                      <Link
                        href="/my-journey"
                        onClick={() => atur_menu_akun_terbuka(false)}
                        className="inline-flex min-h-10 w-full items-center justify-between rounded-xl bg-[#0C264F] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13356B]"
                      >
                        <span>Masuk / Simpan Progres</span>
                        <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Primary Rounded Navy Pill CTA (GeneX top-right style) */}
            <Link
              href={href_cta_utama}
              className="hidden min-h-11 items-center gap-2 rounded-full bg-[#0C264F] py-1.5 pr-2 pl-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#13356B] sm:inline-flex"
            >
              <span>{label_cta_utama}</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0C264F]">
                <Icon name="arrow-up-right" size={14} />
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => atur_menu_seluler_terbuka((sebelumnya) => !sebelumnya)}
              aria-expanded={menu_seluler_terbuka}
              aria-controls="panel-navigasi-seluler"
              aria-label={menu_seluler_terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#0A2552] p-2.5 text-white transition hover:bg-[#13356B] md:hidden"
            >
              <Icon name={menu_seluler_terbuka ? "close" : "menu"} size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Compact Navy Icon Rail (Matches GeneX mobile screenshots) */}
        <nav
          aria-label="Navigasi cepat seluler"
          className="mt-3 grid grid-cols-6 gap-1 rounded-2xl bg-[#0A2552] p-1 text-white md:hidden"
        >
          {DAFTAR_TAUTAN_NAVIGASI.map((item) => {
            const aktif = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={aktif ? "page" : undefined}
                className={`flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-semibold transition ${
                  aktif
                    ? "bg-[#1B3B73] text-white shadow-xs"
                    : "text-[#BDD0EA] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon name={item.ikon} size={15} />
                <span className="max-w-full truncate">{item.label_pendek}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Expandable Drawer */}
        {menu_seluler_terbuka ? (
          <nav
            id="panel-navigasi-seluler"
            aria-label="Navigasi seluler"
            className="mt-2.5 rounded-2xl bg-[#0A2552] p-3.5 text-white shadow-xl md:hidden"
          >
            <div className="grid grid-cols-1 gap-1">
              {DAFTAR_TAUTAN_NAVIGASI.map((tautan) => {
                const aktif =
                  tautan.href === "/" ? pathname === "/" : pathname.startsWith(tautan.href);
                return (
                  <Link
                    key={tautan.href}
                    href={tautan.href}
                    aria-current={aktif ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      aktif
                        ? "bg-[#1B3B73] text-white"
                        : "text-[#BDD0EA] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon name={tautan.ikon} size={17} />
                    <span>{tautan.label_topbar}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3">
              <button
                type="button"
                onClick={ubah_mode_tema}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                <Icon name={mode_tema === "terang" ? "moon" : "sun"} size={14} />
                <span>{mode_tema === "terang" ? "Mode Tenang" : "Mode Terang"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  atur_menu_seluler_terbuka(false);
                  atur_modal_bersihkan_terbuka(true);
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                <Icon name="trash" size={14} />
                <span>Bersihkan Sesi Lokal</span>
              </button>
            </div>
          </nav>
        ) : null}

        {pesan_notifikasi_sesi ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-2.5 rounded-xl border border-emerald-200 bg-[#E7F6EF] px-4 py-2 text-center text-xs font-semibold text-[#166534]"
          >
            {pesan_notifikasi_sesi}
          </div>
        ) : null}
      </header>

      <UrgentSupportModal
        terbuka={modal_darurat_terbuka}
        tutup={() => atur_modal_darurat_terbuka(false)}
      />

      <ClearSessionModal
        terbuka={modal_bersihkan_terbuka}
        ada_data_lokal={ada_data_lokal}
        tutup={() => atur_modal_bersihkan_terbuka(false)}
        konfirmasi_bersihkan={tangani_konfirmasi_bersihkan}
      />
    </>
  );
}
