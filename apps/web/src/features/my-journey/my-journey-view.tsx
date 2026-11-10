"use client";

import type { FollowUpStepStatus, JourneyStatus, PerjalananTersimpan } from "@voxera/contracts";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GalatApiKlien, klien_api_voxera } from "@/lib/api-client";
import {
  PETA_LABEL_KELAS_HASIL,
  PETA_LABEL_MASALAH,
  PETA_LABEL_STATUS_LANGKAH,
  PETA_LABEL_STATUS_PERJALANAN,
  PETA_LABEL_TIPE_DUKUNGAN,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

type ModeFormAuth = "masuk" | "daftar";

export function MyJourneyView() {
  const {
    sesi_lokal,
    bersihkan_sesi_lokal,
    pengguna,
    status_autentikasi,
    tetapkan_pengguna_terautentikasi,
  } = gunakan_konteks_aplikasi();

  const [mode_form, atur_mode_form] = useState<ModeFormAuth>("masuk");
  const [email, atur_email] = useState<string>("");
  const [kata_sandi, atur_kata_sandi] = useState<string>("");
  const [nama_alias, atur_nama_alias] = useState<string>("");
  const [tampilkan_kata_sandi, atur_tampilkan_kata_sandi] = useState<boolean>(false);
  const [sedang_memproses_auth, atur_sedang_memproses_auth] = useState<boolean>(false);
  const [pesan_auth, atur_pesan_auth] = useState<{
    tipe: "sukses" | "galat" | "peringatan_db";
    teks: string;
  } | null>(null);

  const [daftar_perjalanan_akun, atur_daftar_perjalanan_akun] = useState<PerjalananTersimpan[]>([]);
  const [sedang_memuat_perjalanan, atur_sedang_memuat_perjalanan] = useState<boolean>(false);
  const [modal_hapus_akun_terbuka, atur_modal_hapus_akun_terbuka] = useState<boolean>(false);
  const [bersihkan_lokal_saat_hapus_akun, atur_bersihkan_lokal_saat_hapus_akun] =
    useState<boolean>(false);
  const [sedang_menghapus_akun, atur_sedang_menghapus_akun] = useState<boolean>(false);

  const muat_ringkasan_akun = useCallback(async () => {
    if (status_autentikasi !== "terautentikasi") {
      atur_daftar_perjalanan_akun([]);
      return;
    }
    atur_sedang_memuat_perjalanan(true);
    try {
      const respons = await klien_api_voxera.perjalanan_saya.ambil_ringkasan();
      atur_daftar_perjalanan_akun(respons.daftar_perjalanan);
    } catch (galat) {
      if (galat instanceof GalatApiKlien && galat.status === 503) {
        atur_pesan_auth({
          tipe: "peringatan_db",
          teks: "Penyimpanan akun lintas perangkat sedang tidak tersedia sementara. Seluruh progres sesi lokal Anda di peramban ini tetap aman dan dapat digunakan sepenuhnya.",
        });
      }
    } finally {
      atur_sedang_memuat_perjalanan(false);
    }
  }, [status_autentikasi]);

  useEffect(() => {
    void muat_ringkasan_akun();
  }, [muat_ringkasan_akun]);

  useEffect(() => {
    if (!modal_hapus_akun_terbuka) {
      return;
    }
    const tangani_escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        atur_modal_hapus_akun_terbuka(false);
      }
    };
    window.addEventListener("keydown", tangani_escape);
    return () => window.removeEventListener("keydown", tangani_escape);
  }, [modal_hapus_akun_terbuka]);

  const tangani_submit_auth = async (event: React.FormEvent) => {
    event.preventDefault();
    atur_sedang_memproses_auth(true);
    atur_pesan_auth(null);

    try {
      const respons =
        mode_form === "daftar"
          ? await klien_api_voxera.autentikasi.daftar({
              email,
              kata_sandi,
              nama_alias,
            })
          : await klien_api_voxera.autentikasi.masuk({
              email,
              kata_sandi,
            });

      tetapkan_pengguna_terautentikasi(respons.pengguna);
      atur_kata_sandi("");
      atur_pesan_auth({
        tipe: "sukses",
        teks: `Selamat datang, ${respons.pengguna.nama_alias}. Akun kontinuitas opsional Anda telah aktif.`,
      });
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        if (galat.status === 503 || galat.kode === "LAYANAN_DATABASE_TIDAK_TERSEDIA") {
          atur_pesan_auth({
            tipe: "peringatan_db",
            teks: "Database penyimpanan akun sedang tidak aktif di lingkungan ini (503). Anda tetap dapat menggunakan seluruh fitur VEXORA secara penuh melalui Sesi Peramban Lokal di bawah ini.",
          });
        } else if (galat.status === 429) {
          const info_tunggu = galat.retry_after_detik
            ? ` Silakan tunggu sekitar ${galat.retry_after_detik} detik sebelum mencoba kembali.`
            : " Silakan tunggu beberapa saat sebelum mencoba kembali.";
          atur_pesan_auth({
            tipe: "galat",
            teks: `${galat.message}${info_tunggu}`,
          });
        } else {
          atur_pesan_auth({
            tipe: "galat",
            teks: galat.message,
          });
        }
      } else {
        atur_pesan_auth({
          tipe: "galat",
          teks: "Tidak dapat terhubung ke layanan autentikasi saat ini. Silakan lanjutkan menggunakan Sesi Lokal.",
        });
      }
    } finally {
      atur_sedang_memproses_auth(false);
    }
  };

  const tangani_keluar = async () => {
    try {
      await klien_api_voxera.autentikasi.keluar();
    } catch {
      // Tetap lanjutkan pembersihan state autentikasi lokal
    }
    tetapkan_pengguna_terautentikasi(null);
    atur_daftar_perjalanan_akun([]);
    atur_pesan_auth({
      tipe: "sukses",
      teks: "Anda telah keluar dari akun opsional. Data sesi peramban lokal Anda tetap utuh kecuali Anda memilih tombol Bersihkan Sesi.",
    });
  };

  const tangani_konfirmasi_hapus_akun = async () => {
    atur_sedang_menghapus_akun(true);
    try {
      await klien_api_voxera.autentikasi.hapus_akun();
      tetapkan_pengguna_terautentikasi(null);
      atur_daftar_perjalanan_akun([]);
      if (bersihkan_lokal_saat_hapus_akun) {
        bersihkan_sesi_lokal();
      }
      atur_modal_hapus_akun_terbuka(false);
      atur_pesan_auth({
        tipe: "sukses",
        teks: bersihkan_lokal_saat_hapus_akun
          ? "Akun beserta seluruh perjalanan tersimpan di server dan data sesi peramban lokal telah dihapus permanen."
          : "Akun beserta seluruh perjalanan tersimpan di server telah dihapus permanen. Data sesi peramban lokal Anda tetap dipertahankan.",
      });
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        atur_pesan_auth({ tipe: "galat", teks: galat.message });
      }
    } finally {
      atur_sedang_menghapus_akun(false);
    }
  };

  const tangani_simpan_sesi_lokal_ke_akun = async () => {
    const perjalanan_lokal = sesi_lokal.perjalanan_dukungan_aktif;
    if (!perjalanan_lokal) {
      return;
    }

    try {
      const langkah_terstruktur = perjalanan_lokal.daftar_langkah_rekomendasi
        .slice(0, 12)
        .map((langkah) => ({
          urutan_langkah: langkah.urutan_langkah,
          kode_langkah: langkah.kode_langkah,
          id_tipe_dukungan: langkah.id_tipe_dukungan,
          status_langkah:
            sesi_lokal.status_langkah_lokal[langkah.kode_langkah] ?? langkah.status_langkah,
        }));

      await klien_api_voxera.perjalanan_saya.simpan_perjalanan({
        id_masalah_utama: perjalanan_lokal.id_masalah_utama,
        id_subkategori: perjalanan_lokal.id_subkategori,
        kelas_hasil_utama: perjalanan_lokal.kelas_hasil_utama,
        jalur_dukungan_utama: perjalanan_lokal.jalur_dukungan_utama,
        daftar_langkah: langkah_terstruktur,
      });

      await muat_ringkasan_akun();
      atur_pesan_auth({
        tipe: "sukses",
        teks: "Jalur dukungan aktif dari sesi lokal berhasil disinkronkan ke akun Anda.",
      });
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        atur_pesan_auth({ tipe: "galat", teks: galat.message });
      }
    }
  };

  const tangani_ubah_status_perjalanan_akun = async (
    id_perjalanan: string,
    status_perjalanan: JourneyStatus,
  ) => {
    try {
      const diperbarui = await klien_api_voxera.perjalanan_saya.perbarui_status_perjalanan(
        id_perjalanan,
        { status_perjalanan },
      );
      atur_daftar_perjalanan_akun((sebelumnya) =>
        sebelumnya.map((item) => (item.id_perjalanan === id_perjalanan ? diperbarui : item)),
      );
    } catch {
      // Abaikan kegagalan sementara
    }
  };

  const tangani_ubah_status_langkah_akun = async (
    id_perjalanan: string,
    id_langkah: string,
    status_langkah: FollowUpStepStatus,
  ) => {
    try {
      const langkah_diperbarui = await klien_api_voxera.perjalanan_saya.perbarui_status_langkah(
        id_perjalanan,
        id_langkah,
        { status_langkah },
      );
      atur_daftar_perjalanan_akun((sebelumnya) =>
        sebelumnya.map((item) =>
          item.id_perjalanan === id_perjalanan
            ? {
                ...item,
                daftar_langkah: item.daftar_langkah.map((l) =>
                  l.id_langkah === id_langkah ? langkah_diperbarui : l,
                ),
              }
            : item,
        ),
      );
    } catch {
      // Abaikan kegagalan sementara
    }
  };

  const tangani_hapus_perjalanan_akun = async (id_perjalanan: string) => {
    try {
      await klien_api_voxera.perjalanan_saya.hapus_perjalanan(id_perjalanan);
      atur_daftar_perjalanan_akun((sebelumnya) =>
        sebelumnya.filter((item) => item.id_perjalanan !== id_perjalanan),
      );
    } catch {
      // Abaikan kegagalan sementara
    }
  };

  const perjalanan_lokal = sesi_lokal.perjalanan_dukungan_aktif;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Banner */}
      <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="Kontinuitas Perjalanan & Kontrol Privasi" nada="utama" />
          <StatusBadge
            label={
              status_autentikasi === "terautentikasi" && pengguna
                ? `Akun Aktif: ${pengguna.nama_alias}`
                : "Mode Sesi Peramban Lokal (Tanpa Akun)"
            }
            nada="aman"
          />
        </div>
        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-2xl">
          Progres dan privasi Anda
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
          Anda bisa memakai semua fitur tanpa akun. Progres tersimpan di peramban pada perangkat
          ini. Akun opsional memungkinkan ringkasan langkah dilanjutkan di perangkat lain; catatan
          bebas dan draf percakapan tidak disimpan ke server.
        </p>
      </section>

      {pesan_auth ? (
        <div
          role="status"
          className={`rounded-2xl border p-4 text-xs ${
            pesan_auth.tipe === "sukses"
              ? "border-emerald-200 bg-[#E7F6EF] text-[#166534]"
              : pesan_auth.tipe === "peringatan_db"
                ? "border-amber-300 bg-[#FEF3C7]/85 text-[#92400E]"
                : "border-[#FECACA] bg-[#FEE2E2] text-[#991B1B]"
          }`}
        >
          <p className="font-bold">
            {pesan_auth.tipe === "peringatan_db"
              ? "Mode Sesi Lokal Tetap Aktif Penuh"
              : pesan_auth.tipe === "sukses"
                ? "Status Kontinuitas Diperbarui"
                : "Pemberitahuan Layanan Akun"}
          </p>
          <p className="mt-1 leading-relaxed">{pesan_auth.teks}</p>
          {pesan_auth.tipe === "peringatan_db" ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={perjalanan_lokal ? "/journey" : "/navigate"}
                className="inline-flex min-h-9 items-center rounded-full bg-[#0C264F] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Lanjutkan di Sesi Lokal
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Main Content: Logged-Out 2-Column Dashboard vs Logged-In Continuity Workspace */}
      {status_autentikasi === "terautentikasi" && pengguna ? (
        <div className="space-y-4">
          {/* Account Header & Session Controls */}
          <section
            aria-labelledby="judul-akun-aktif"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <StatusBadge label="Akun Kontinuitas Terhubung" nada="aman" />
                <h2
                  id="judul-akun-aktif"
                  className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]"
                >
                  Profil Alias: {pengguna.nama_alias}
                </h2>
                <p className="text-xs text-[var(--vx-text-secondary)]">
                  Email masuk: {pengguna.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void tangani_keluar()}
                  className="min-h-11 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
                >
                  Keluar Sesi (Logout)
                </button>
                <button
                  type="button"
                  onClick={() => atur_modal_hapus_akun_terbuka(true)}
                  className="min-h-11 rounded-full border border-[#FECACA] bg-[#FEE2E2]/80 px-4 py-2 text-xs font-semibold text-[#991B1B] transition hover:bg-[#FEE2E2]"
                >
                  Hapus Akun Permanen
                </button>
              </div>
            </div>

            {perjalanan_lokal ? (
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)] p-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold text-[var(--vx-text-primary)]">
                    Jalur Aktif di Peramban Ini: {perjalanan_lokal.judul_perjalanan}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--vx-text-secondary)]">
                    Simpan kode jalur dan daftar langkah tindak lanjut ini ke akun Anda agar dapat
                    diakses lintas perangkat.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void tangani_simpan_sesi_lokal_ke_akun()}
                  className="min-h-11 shrink-0 rounded-full bg-[#0C264F] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  Simpan Jalur Aktif Ini ke Akun
                </button>
              </div>
            ) : null}
          </section>

          {/* Saved Journeys List */}
          <section
            aria-labelledby="judul-daftar-tersimpan"
            className="space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="judul-daftar-tersimpan"
                className="text-base font-extrabold text-[var(--vx-text-primary)]"
              >
                Riwayat Perjalanan Terstruktur di Akun ({daftar_perjalanan_akun.length})
              </h2>
              {sedang_memuat_perjalanan ? (
                <StatusBadge label="Memuat data akun..." nada="netral" />
              ) : null}
            </div>

            {daftar_perjalanan_akun.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-6 text-center">
                <p className="text-xs text-[var(--vx-text-secondary)]">
                  Belum ada ringkasan perjalanan yang disimpan ke akun ini. Gunakan Navigator
                  Masalah lalu klik <strong>Simpan ke Perjalanan Saya</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {daftar_perjalanan_akun.map((perjalanan) => (
                  <article
                    key={perjalanan.id_perjalanan}
                    className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/80 p-4 sm:p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 border-b border-[var(--vx-border-subtle)] pb-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={PETA_LABEL_MASALAH[perjalanan.id_masalah_utama]}
                            nada="utama"
                          />
                          <StatusBadge
                            label={PETA_LABEL_KELAS_HASIL[perjalanan.kelas_hasil_utama]}
                            nada="aman"
                          />
                          <StatusBadge
                            label={PETA_LABEL_STATUS_PERJALANAN[perjalanan.status_perjalanan]}
                            nada="info"
                          />
                        </div>
                        <h3 className="mt-2 text-base font-bold text-[var(--vx-text-primary)]">
                          {PETA_LABEL_MASALAH[perjalanan.id_masalah_utama]} (
                          {perjalanan.id_subkategori ?? "Umum"})
                        </h3>
                        <p className="mt-0.5 text-xs text-[var(--vx-text-secondary)]">
                          Dukungan utama:{" "}
                          {PETA_LABEL_TIPE_DUKUNGAN[perjalanan.jalur_dukungan_utama]}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor={`status-${perjalanan.id_perjalanan}`} className="sr-only">
                          Status Perjalanan
                        </label>
                        <select
                          id={`status-${perjalanan.id_perjalanan}`}
                          value={perjalanan.status_perjalanan}
                          onChange={(event) =>
                            void tangani_ubah_status_perjalanan_akun(
                              perjalanan.id_perjalanan,
                              event.target.value as JourneyStatus,
                            )
                          }
                          className="min-h-10 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--vx-text-primary)]"
                        >
                          {(["aktif", "ditindaklanjuti", "diarsipkan"] as JourneyStatus[]).map(
                            (st) => (
                              <option key={st} value={st}>
                                {PETA_LABEL_STATUS_PERJALANAN[st]}
                              </option>
                            ),
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            void tangani_hapus_perjalanan_akun(perjalanan.id_perjalanan)
                          }
                          className="min-h-10 rounded-full border border-[#FECACA] bg-[#FEE2E2]/80 px-3 py-1.5 text-xs font-semibold text-[#991B1B]"
                        >
                          Hapus Ringkasan
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase">
                        Langkah Tindak Lanjut Terstruktur
                      </p>
                      {perjalanan.daftar_langkah.map((langkah) => (
                        <div
                          key={langkah.id_langkah}
                          className="flex flex-col justify-between gap-2 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3 sm:flex-row sm:items-center"
                        >
                          <span className="text-xs font-medium text-[var(--vx-text-primary)]">
                            {langkah.urutan_langkah}. {langkah.kode_langkah} (
                            {PETA_LABEL_TIPE_DUKUNGAN[langkah.id_tipe_dukungan]})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(
                              [
                                "belum_dimulai",
                                "sedang_berjalan",
                                "selesai",
                                "dilewati",
                              ] as FollowUpStepStatus[]
                            ).map((st) => {
                              const aktif = langkah.status_langkah === st;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() =>
                                    void tangani_ubah_status_langkah_akun(
                                      perjalanan.id_perjalanan,
                                      langkah.id_langkah,
                                      st,
                                    )
                                  }
                                  className={`min-h-8 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                    aktif
                                      ? "border-[#0A2552] bg-[#0A2552] text-white"
                                      : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] text-[var(--vx-text-secondary)]"
                                  }`}
                                >
                                  {PETA_LABEL_STATUS_LANGKAH[st]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div id="session-privacy">
            <SaveBoundaryCard />
          </div>
        </div>
      ) : (
        /* Logged-Out 2-Column Dashboard: Left 7 Cols Local Session & Save Boundary | Right 5 Cols Auth Card */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left 7 Cols */}
          <div className="space-y-4 lg:col-span-7">
            <div id="session-privacy">
              <SaveBoundaryCard />
            </div>

            <section
              aria-labelledby="judul-sesi-lokal"
              className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2
                  id="judul-sesi-lokal"
                  className="text-base font-extrabold text-[var(--vx-text-primary)]"
                >
                  Progres Sesi Peramban Lokal Anda Saat Ini
                </h2>
                <StatusBadge label="Tersimpan di Peramban Ini (voxera_session_v1)" nada="aman" />
              </div>

              {perjalanan_lokal ? (
                <div className="mt-3.5 rounded-2xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[var(--vx-text-primary)]">
                        {perjalanan_lokal.judul_perjalanan}
                      </p>
                      <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                        Kategori: {PETA_LABEL_MASALAH[perjalanan_lokal.id_masalah_utama]} •{" "}
                        {perjalanan_lokal.daftar_langkah_rekomendasi.length} langkah
                        direkomendasikan
                      </p>
                    </div>
                    <Link
                      href="/journey"
                      className="inline-flex min-h-10 items-center rounded-full bg-[#0C264F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                    >
                      Buka Jalur Dukungan →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-3.5 rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-4">
                  <p className="text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                    Belum ada jalur dukungan aktif di sesi peramban ini. Anda dapat langsung memulai
                    pemetaan situasi tanpa harus masuk atau mendaftar akun terlebih dahulu.
                  </p>
                  <Link
                    href="/navigate"
                    className="mt-3 inline-flex min-h-10 items-center rounded-full bg-[#0C264F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                  >
                    Mulai Pemetaan Tanpa Akun →
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Right 5 Cols: Optional Sign In / Sign Up Card */}
          <section
            aria-labelledby="judul-form-auth"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6 lg:col-span-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="grid w-full grid-cols-2 gap-1.5 rounded-xl bg-[var(--vx-bg-workspace)] p-1">
                <button
                  type="button"
                  onClick={() => {
                    atur_mode_form("masuk");
                    atur_pesan_auth(null);
                  }}
                  aria-pressed={mode_form === "masuk"}
                  className={`min-h-10 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    mode_form === "masuk"
                      ? "bg-[#0A2552] text-white shadow-2xs"
                      : "text-[var(--vx-text-secondary)] hover:text-[var(--vx-text-primary)]"
                  }`}
                >
                  Masuk ke Akun Kontinuitas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    atur_mode_form("daftar");
                    atur_pesan_auth(null);
                  }}
                  aria-pressed={mode_form === "daftar"}
                  className={`min-h-10 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    mode_form === "daftar"
                      ? "bg-[#0A2552] text-white shadow-2xs"
                      : "text-[var(--vx-text-secondary)] hover:text-[var(--vx-text-primary)]"
                  }`}
                >
                  Buat Akun Baru (Alias)
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <h2 id="judul-form-auth" className="text-sm font-bold text-[var(--vx-text-primary)]">
                {mode_form === "masuk"
                  ? "Masuk untuk Melanjutkan Perjalanan"
                  : "Daftar Akun Kontinuitas dengan Nama Alias"}
              </h2>
              <StatusBadge label="Cookie HttpOnly + CSRF" nada="info" />
            </div>

            <form
              onSubmit={(event) => void tangani_submit_auth(event)}
              className="mt-4 space-y-3.5"
            >
              {mode_form === "daftar" ? (
                <div>
                  <label
                    htmlFor="auth-alias"
                    className="block text-xs font-bold text-[var(--vx-text-primary)]"
                  >
                    Nama Alias / Panggilan (Bukan Nama Asli Wajib)
                  </label>
                  <input
                    id="auth-alias"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Contoh: Raka_TimProduk"
                    value={nama_alias}
                    onChange={(event) => atur_nama_alias(event.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3.5 py-2 text-xs text-[var(--vx-text-primary)]"
                  />
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-bold text-[var(--vx-text-primary)]"
                >
                  Alamat Email (Disarankan Email Pribadi, Bukan Email Kantor)
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="nama@emailpribadi.com"
                  value={email}
                  onChange={(event) => atur_email(event.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3.5 py-2 text-xs text-[var(--vx-text-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-bold text-[var(--vx-text-primary)]"
                >
                  Kata Sandi (Min. 8 Karakter, Huruf & Angka)
                </label>
                <div className="relative mt-1.5 flex items-center">
                  <input
                    id="auth-password"
                    type={tampilkan_kata_sandi ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    placeholder="Minimal 8 karakter huruf & angka"
                    value={kata_sandi}
                    onChange={(event) => atur_kata_sandi(event.target.value)}
                    className="min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] py-2 pr-11 pl-3.5 text-xs text-[var(--vx-text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => atur_tampilkan_kata_sandi((sebelumnya) => !sebelumnya)}
                    aria-label={
                      tampilkan_kata_sandi ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    className="absolute right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--vx-text-secondary)] hover:bg-[var(--vx-surface-secondary)] hover:text-[var(--vx-text-primary)]"
                  >
                    <Icon name={tampilkan_kata_sandi ? "eye-off" : "eye"} size={15} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sedang_memproses_auth}
                  className="min-h-11 w-full rounded-full bg-[#0C264F] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B] disabled:opacity-60"
                >
                  {sedang_memproses_auth
                    ? "Memproses..."
                    : mode_form === "masuk"
                      ? "Masuk ke Perjalanan Saya"
                      : "Buat Akun & Aktifkan Kontinuitas"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {modal_hapus_akun_terbuka ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071735]/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-modal-hapus-akun"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-2xl sm:p-6">
            <h2
              id="judul-modal-hapus-akun"
              className="text-base font-bold text-[var(--vx-text-primary)]"
            >
              Hapus Akun Kontinuitas Secara Permanen?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              Tindakan ini akan menghapus profil akun Anda, seluruh sesi login aktif, dan seluruh
              ringkasan perjalanan terstruktur yang tersimpan di database server secara permanen.
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3 text-xs text-[var(--vx-text-primary)]">
              <input
                type="checkbox"
                checked={bersihkan_lokal_saat_hapus_akun}
                onChange={(event) => atur_bersihkan_lokal_saat_hapus_akun(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0A2552] focus:ring-[#305FA7]"
              />
              <span>
                Sekaligus bersihkan seluruh data sesi peramban lokal (<code>voxera_session_v1</code>
                ) di perangkat ini.
              </span>
            </label>

            <div className="mt-5 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => atur_modal_hapus_akun_terbuka(false)}
                className="min-h-11 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={sedang_menghapus_akun}
                onClick={() => void tangani_konfirmasi_hapus_akun()}
                className="min-h-11 rounded-full bg-[#991B1B] px-5 py-2 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
              >
                {sedang_menghapus_akun ? "Menghapus Akun..." : "Ya, Hapus Akun Permanen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
