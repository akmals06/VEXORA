"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    label_topbar: "Beranda",
    label_sidebar: "Beranda",
    label_pendek: "Beranda",
    ikon: "dashboard",
  },
  {
    href: "/navigate",
    label_topbar: "Petakan Situasi",
    label_sidebar: "Petakan Situasi",
    label_pendek: "Pemetaan",
    ikon: "compass",
  },
  {
    href: "/journey",
    label_topbar: "Langkah Berikutnya",
    label_sidebar: "Langkah Berikutnya",
    label_pendek: "Langkah",
    ikon: "route",
  },
  {
    href: "/prepare",
    label_topbar: "Siapkan Percakapan",
    label_sidebar: "Siapkan Percakapan",
    label_pendek: "Siapkan",
    ikon: "chat",
  },
  {
    href: "/scenarios",
    label_topbar: "Lihat Contoh",
    label_sidebar: "Contoh & Dukungan",
    label_pendek: "Contoh",
    ikon: "book",
  },
  {
    href: "/my-journey",
    label_topbar: "Progres & Privasi",
    label_sidebar: "Progres & Privasi",
    label_pendek: "Progres",
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
  const [pesan_notifikasi_sesi, atur_pesan_notifikasi_sesi] = useState<string | null>(null);
  const wadah_menu_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    atur_menu_seluler_terbuka(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu_seluler_terbuka) {
      return;
    }
    const tangani_escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        atur_menu_seluler_terbuka(false);
      }
    };
    window.addEventListener("keydown", tangani_escape);
    return () => window.removeEventListener("keydown", tangani_escape);
  }, [menu_seluler_terbuka]);

  useEffect(() => {
    if (!menu_seluler_terbuka) {
      return;
    }

    const tangani_klik_di_luar = (event: PointerEvent) => {
      if (event.target instanceof Node && !wadah_menu_ref.current?.contains(event.target)) {
        atur_menu_seluler_terbuka(false);
      }
    };

    document.addEventListener("pointerdown", tangani_klik_di_luar);
    return () => document.removeEventListener("pointerdown", tangani_klik_di_luar);
  }, [menu_seluler_terbuka]);

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
  };

  const inisial_pengguna = pengguna ? dapatkan_inisial_alias(pengguna.nama_alias) : "SL";

  const href_cta_utama = sesi_lokal.perjalanan_dukungan_aktif ? "/journey" : "/navigate";
  const label_cta_utama = sesi_lokal.perjalanan_dukungan_aktif ? "Lihat Jalur" : "Mulai Navigasi";

  return (
    <>
      <header>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: VEXORA Wordmark */}
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
                  VEXORA
                </span>
                <span className="hidden text-[11px] font-medium text-[var(--vx-text-secondary)] sm:inline">
                  Perlindungan & Kesejahteraan Kerja
                </span>
              </div>
            </Link>
          </div>

          <nav
            aria-label="Navigasi utama"
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
          >
            {DAFTAR_TAUTAN_NAVIGASI.map((tautan) => {
              const aktif =
                tautan.href === "/" ? pathname === "/" : pathname.startsWith(tautan.href);
              return (
                <Link
                  key={tautan.href}
                  href={tautan.href}
                  aria-current={aktif ? "page" : undefined}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition 2xl:px-3 2xl:text-sm ${
                    aktif
                      ? "bg-[#E9F0FA] text-[#0A2552]"
                      : "text-[var(--vx-text-secondary)] hover:bg-[var(--vx-surface-secondary)] hover:text-[var(--vx-text-primary)]"
                  }`}
                >
                  <Icon name={tautan.ikon} size={15} />
                  <span>{tautan.label_topbar}</span>
                </Link>
              );
            })}
          </nav>

          {/* Hamburger menu on every screen size */}
          <div ref={wadah_menu_ref} className="relative">
            <button
              type="button"
              onClick={() => atur_menu_seluler_terbuka((sebelumnya) => !sebelumnya)}
              aria-expanded={menu_seluler_terbuka}
              aria-controls="panel-navigasi-seluler"
              aria-label={menu_seluler_terbuka ? "Tutup menu" : "Buka menu"}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-[#0A2552] px-3.5 text-white transition hover:bg-[#13356B]"
            >
              <Icon name={menu_seluler_terbuka ? "close" : "menu"} size={18} />
              <span className="hidden text-sm font-semibold sm:inline">Menu</span>
            </button>

            {menu_seluler_terbuka ? (
              <nav
                id="panel-navigasi-seluler"
                aria-label="Menu utama"
                className="vx-navbar-editorial absolute right-0 top-14 z-40 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border p-3.5 text-[var(--vx-text-primary)] shadow-xl"
              >
                <div className="xl:hidden">
                  <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--vx-text-secondary)]">
                    Navigasi
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {DAFTAR_TAUTAN_NAVIGASI.map((tautan) => {
                      const aktif =
                        tautan.href === "/" ? pathname === "/" : pathname.startsWith(tautan.href);
                      return (
                        <Link
                          key={tautan.href}
                          href={tautan.href}
                          aria-current={aktif ? "page" : undefined}
                          onClick={() => atur_menu_seluler_terbuka(false)}
                          className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                            aktif
                              ? "bg-[#E9F0FA] text-[#0A2552]"
                              : "text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary)]"
                          }`}
                        >
                          <Icon name={tautan.ikon} size={17} />
                          <span>{tautan.label_topbar}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--vx-border-subtle)] pt-3">
                  <button
                    type="button"
                    onClick={ubah_mode_tema}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--vx-surface-secondary)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
                  >
                    <Icon name={mode_tema === "terang" ? "moon" : "sun"} size={14} />
                    <span>{mode_tema === "terang" ? "Dark mode" : "Light mode"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => atur_modal_bersihkan_terbuka(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--vx-surface-secondary)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
                  >
                    <Icon name="trash" size={14} />
                    <span>Bersihkan Sesi Lokal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => atur_modal_darurat_terbuka(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-200"
                  >
                    <Icon name="lifebuoy" size={14} />
                    <span>Bantuan Darurat</span>
                  </button>
                  <div className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--vx-border-soft)] px-3 py-2 text-xs font-semibold">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--vx-surface-secondary-alt)] text-[var(--vx-primary)]">
                      {inisial_pengguna}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{pengguna?.nama_alias ?? "Sesi Lokal"}</span>
                      <span className="block text-[10px] font-normal text-[var(--vx-text-secondary)]">
                        {ada_data_lokal
                          ? "Progres tersimpan di perangkat ini"
                          : "Belum ada progres lokal"}
                      </span>
                    </span>
                  </div>
                  {status_autentikasi === "terautentikasi" && pengguna ? (
                    <button
                      type="button"
                      onClick={() => void tangani_keluar_cepat()}
                      className="col-span-2 inline-flex min-h-10 items-center justify-between rounded-xl border border-[var(--vx-border-soft)] px-3 py-2 text-xs font-semibold hover:bg-[var(--vx-surface-secondary)]"
                    >
                      <span>Keluar Akun</span>
                      <Icon name="logout" size={14} />
                    </button>
                  ) : null}
                  <Link
                    href={href_cta_utama}
                    onClick={() => atur_menu_seluler_terbuka(false)}
                    className="col-span-2 inline-flex min-h-11 items-center justify-between rounded-xl bg-[#0C264F] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#13356B]"
                  >
                    <span>{label_cta_utama}</span>
                    <Icon name="arrow-up-right" size={15} />
                  </Link>
                </div>
              </nav>
            ) : null}
          </div>
        </div>

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
