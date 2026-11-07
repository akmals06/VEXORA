"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DAFTAR_TAUTAN_NAVIGASI, dapatkan_inisial_alias } from "@/components/layout/top-navigation";
import { Icon } from "@/components/ui/icons";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sesi_lokal, pengguna, status_autentikasi } = gunakan_konteks_aplikasi();

  const inisial_pengguna =
    status_autentikasi === "terautentikasi" && pengguna
      ? dapatkan_inisial_alias(pengguna.nama_alias)
      : "SL";

  const jumlah_langkah_selesai = Object.values(sesi_lokal.status_langkah_lokal).filter(
    (status) => status === "selesai",
  ).length;

  return (
    <aside
      aria-label="Navigasi samping dashboard"
      className="hidden w-[224px] shrink-0 flex-col justify-between rounded-[20px] bg-[var(--vx-bg-sidebar)] p-3.5 text-[var(--vx-text-sidebar)] md:flex lg:w-[244px]"
    >
      <div>
        <div className="mb-3 px-2.5 pt-1">
          <p className="text-[11px] font-semibold tracking-wider text-[var(--vx-text-sidebar-muted)] uppercase">
            Menu Ruang Kerja
          </p>
        </div>

        <nav aria-label="Menu modul VOXERA" className="space-y-1">
          {DAFTAR_TAUTAN_NAVIGASI.map((item) => {
            const aktif = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={aktif ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  aktif
                    ? "bg-[var(--vx-bg-sidebar-active)] text-white shadow-xs"
                    : "text-[var(--vx-text-sidebar-muted)] hover:bg-[var(--vx-bg-sidebar-hover)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name={item.ikon} size={16} />
                  <span>{item.label_sidebar}</span>
                </span>
                <Icon
                  name="chevron-right"
                  size={13}
                  className={aktif ? "opacity-90" : "opacity-45"}
                />
              </Link>
            );
          })}

          <Link
            href="/my-journey#session-privacy"
            className="flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--vx-text-sidebar-muted)] transition hover:bg-[var(--vx-bg-sidebar-hover)] hover:text-white"
          >
            <span className="flex items-center gap-2.5">
              <Icon name="shield" size={16} />
              <span>Privasi & Batas Data</span>
            </span>
            <Icon name="chevron-right" size={13} className="opacity-45" />
          </Link>
        </nav>
      </div>

      <div className="mt-6 space-y-2.5 border-t border-white/10 pt-3.5">
        <div className="rounded-xl bg-white/8 p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--vx-text-sidebar-muted)]">
            <span>Status Sesi</span>
            <span className="font-semibold text-white">
              {sesi_lokal.perjalanan_dukungan_aktif
                ? `${jumlah_langkah_selesai} langkah selesai`
                : "Siap mulai"}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-[var(--vx-text-sidebar-muted)]">
            Catatan pribadi tetap di peramban Anda dan tidak pernah dikirim ke HR.
          </p>
        </div>

        <Link
          href="/my-journey"
          className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 transition hover:bg-white/15"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#305FA7] text-xs font-bold text-white ring-2 ring-white/20">
            {inisial_pengguna}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              {status_autentikasi === "terautentikasi" && pengguna
                ? pengguna.nama_alias
                : "Sesi Lokal Privat"}
            </p>
            <p className="truncate text-[11px] text-[var(--vx-text-sidebar-muted)]">
              {status_autentikasi === "terautentikasi" && pengguna
                ? "Akun opsional: Aktif ›"
                : "Tanpa akun: Aktif ›"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
