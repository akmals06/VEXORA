"use client";

import type {
  BatasKonfigurasiSkrining,
  DimensiMaknaKerja,
  FollowUpStepStatus,
  ItemDirektoriDukungan,
  KebutuhanSdtKerja,
  OrientasiMaknaKerja,
} from "@voxera/contracts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { KartuBatasSkriningPsikologis } from "@/features/journey/screening-boundary-card";
import { GalatApiKlien, klien_api_voxera } from "@/lib/api-client";
import {
  DAFTAR_OPSI_DIMENSI_MAKNA,
  DAFTAR_OPSI_KEBUTUHAN_SDT,
  DAFTAR_OPSI_ORIENTASI_MAKNA,
  DAFTAR_OPSI_TANTANGAN_DIGITAL,
  PETA_GAYA_PERINGATAN_PENJAGA,
  PETA_LABEL_ALASAN_RUJUKAN,
  PETA_LABEL_KATEGORI_PSIKOLOGIS,
  PETA_LABEL_KELAS_HASIL,
  PETA_LABEL_LAPISAN_BATAS,
  PETA_LABEL_MASALAH,
  PETA_LABEL_STATUS_LANGKAH,
  PETA_LABEL_TIPE_DUKUNGAN,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

export function SupportJourneyView() {
  const { sesi_lokal, perbarui_sesi_lokal, pengguna, status_autentikasi } =
    gunakan_konteks_aplikasi();

  const perjalanan_aktif = sesi_lokal.perjalanan_dukungan_aktif;
  const refleksi_tersimpan = sesi_lokal.refleksi_makna_kerja;

  const [batas_skrining, atur_batas_skrining] = useState<BatasKonfigurasiSkrining | null>(null);
  const [direktori_pendukung, atur_direktori_pendukung] = useState<ItemDirektoriDukungan[]>([]);

  const [orientasi_saat_ini, atur_orientasi_saat_ini] = useState<OrientasiMaknaKerja>(
    refleksi_tersimpan.input.orientasi_saat_ini,
  );
  const [dimensi_makna_utama, atur_dimensi_makna_utama] = useState<DimensiMaknaKerja>(
    refleksi_tersimpan.input.dimensi_makna_utama,
  );
  const [kebutuhan_sdt_prioritas, atur_kebutuhan_sdt_prioritas] = useState<KebutuhanSdtKerja>(
    refleksi_tersimpan.input.kebutuhan_sdt_prioritas,
  );
  const [tantangan_kerja_digital, atur_tantangan_kerja_digital] = useState<
    | "information_overload_distraction"
    | "ai_workflow_adaptation"
    | "skill_development_need"
    | "role_clarity_in_digital_work"
  >(refleksi_tersimpan.input.tantangan_kerja_digital);
  const [sedang_mengevaluasi_refleksi, atur_sedang_mengevaluasi_refleksi] =
    useState<boolean>(false);

  const [sedang_menyimpan_ke_akun, atur_sedang_menyimpan_ke_akun] = useState<boolean>(false);
  const [pesan_simpan_akun, atur_pesan_simpan_akun] = useState<{
    tipe: "sukses" | "info" | "galat";
    teks: string;
  } | null>(null);

  useEffect(() => {
    let aktif = true;

    const muat_data_pendukung = async () => {
      try {
        const [respons_skrining, respons_direktori] = await Promise.all([
          klien_api_voxera.navigator.ambil_batas_skrining(),
          klien_api_voxera.alat_bantu.ambil_direktori_dukungan(
            perjalanan_aktif
              ? { id_tipe_dukungan: perjalanan_aktif.jalur_dukungan_utama }
              : undefined,
          ),
        ]);
        if (aktif) {
          atur_batas_skrining(respons_skrining);
          atur_direktori_pendukung(respons_direktori.daftar_layanan);
        }
      } catch {
        // Tetap tampilkan perjalanan utama dari sesi lokal meskipun layanan pendukung gagal dimuat
      }
    };

    void muat_data_pendukung();
    return () => {
      aktif = false;
    };
  }, [perjalanan_aktif]);

  if (!perjalanan_aktif) {
    return (
      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-6 text-center shadow-[var(--vx-shadow-card)] sm:p-10 lg:col-span-8">
            <StatusBadge label="Belum Ada Jalur Dukungan Aktif" nada="peringatan" />
            <h1 className="mt-3 text-xl font-extrabold text-[var(--vx-text-primary)] sm:text-2xl">
              Mulai Pemetaan Situasi Terlebih Dahulu
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
              Pilih kategori situasi terlebih dahulu. Setelah pemetaan, halaman ini akan menampilkan
              daftar langkah yang bisa Anda tinjau dan tandai sesuai progres.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/navigate"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
              >
                <span>Buka Navigator Masalah →</span>
              </Link>
              <Link
                href="/scenarios"
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
              >
                Lihat Skenario Kerja Interaktif
              </Link>
            </div>
          </section>

          <aside className="space-y-4 lg:col-span-4">
            <KartuBatasSkriningPsikologis batas_skrining={batas_skrining} />
          </aside>
        </div>

        <SaveBoundaryCard ringkas />
      </div>
    );
  }

  const ubah_status_langkah = (kode_langkah: string, status_baru: FollowUpStepStatus) => {
    perbarui_sesi_lokal((sebelumnya) => ({
      ...sebelumnya,
      status_langkah_lokal: {
        ...sebelumnya.status_langkah_lokal,
        [kode_langkah]: status_baru,
      },
    }));
  };

  const tangani_evaluasi_refleksi = async () => {
    atur_sedang_mengevaluasi_refleksi(true);
    const input_refleksi = {
      orientasi_saat_ini,
      dimensi_makna_utama,
      kebutuhan_sdt_prioritas,
      tantangan_kerja_digital,
    };
    try {
      const hasil = await klien_api_voxera.alat_bantu.evaluasi_refleksi_makna(input_refleksi);
      perbarui_sesi_lokal({
        refleksi_makna_kerja: {
          input: input_refleksi,
          hasil,
        },
      });
    } catch {
      // Biarkan pengguna mencoba ulang jika API belum siap
    } finally {
      atur_sedang_mengevaluasi_refleksi(false);
    }
  };

  const tangani_simpan_ke_perjalanan_saya = async () => {
    if (status_autentikasi !== "terautentikasi" || !pengguna) {
      atur_pesan_simpan_akun({
        tipe: "info",
        teks: "Progres Anda sudah tersimpan aman di sesi peramban ini. Jika ingin menyimpannya lintas perangkat, silakan masuk ke akun opsional di halaman Perjalanan Saya.",
      });
      return;
    }

    atur_sedang_menyimpan_ke_akun(true);
    atur_pesan_simpan_akun(null);

    try {
      const langkah_terstruktur = perjalanan_aktif.daftar_langkah_rekomendasi
        .slice(0, 10)
        .map((langkah) => ({
          urutan_langkah: langkah.urutan_langkah,
          kode_langkah: langkah.kode_langkah,
          id_tipe_dukungan: langkah.id_tipe_dukungan,
          status_langkah:
            sesi_lokal.status_langkah_lokal[langkah.kode_langkah] ?? langkah.status_langkah,
        }));

      await klien_api_voxera.perjalanan_saya.simpan_perjalanan({
        id_masalah_utama: perjalanan_aktif.id_masalah_utama,
        id_subkategori: perjalanan_aktif.id_subkategori,
        kelas_hasil_utama: perjalanan_aktif.kelas_hasil_utama,
        jalur_dukungan_utama: perjalanan_aktif.jalur_dukungan_utama,
        daftar_langkah: langkah_terstruktur,
      });

      atur_pesan_simpan_akun({
        tipe: "sukses",
        teks: "Ringkasan terstruktur perjalanan ini berhasil disimpan ke akun Perjalanan Saya (tanpa catatan bebas atau data sensitif).",
      });
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        atur_pesan_simpan_akun({
          tipe: "galat",
          teks: galat.pesan,
        });
      } else {
        atur_pesan_simpan_akun({
          tipe: "galat",
          teks: "Tidak dapat menyimpan ke akun saat ini. Data Anda tetap aman di sesi peramban lokal.",
        });
      }
    } finally {
      atur_sedang_menyimpan_ke_akun(false);
    }
  };

  const adalah_jalur_karier_atau_digital =
    perjalanan_aktif.id_masalah_utama === "career_growth" ||
    perjalanan_aktif.id_masalah_utama === "digital_adaptation";

  const total_langkah = perjalanan_aktif.daftar_langkah_rekomendasi.length;
  const langkah_selesai = perjalanan_aktif.daftar_langkah_rekomendasi.filter(
    (langkah) =>
      (sesi_lokal.status_langkah_lokal[langkah.kode_langkah] ?? langkah.status_langkah) ===
      "selesai",
  ).length;
  const persentase_selesai =
    total_langkah > 0 ? Math.round((langkah_selesai / total_langkah) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 2-Column Dashboard Layout: Main 8 Cols | Right 4 Cols */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Main Column (8 Cols) */}
        <div className="space-y-4 lg:col-span-8">
          {/* 1. Current Issue & Pathway Summary Header Card */}
          <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={PETA_LABEL_MASALAH[perjalanan_aktif.id_masalah_utama]}
                nada="utama"
              />
              <StatusBadge
                label={PETA_LABEL_KELAS_HASIL[perjalanan_aktif.kelas_hasil_utama]}
                nada="aman"
              />
              {perjalanan_aktif.apakah_atasan_dilewati ? (
                <StatusBadge
                  label="Penjaga Pelaporan Aktif (Melewati Atasan Langsung)"
                  nada="peringatan"
                />
              ) : null}
            </div>

            <h1 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-2xl">
              {perjalanan_aktif.judul_perjalanan}
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
              {perjalanan_aktif.ringkasan_konteks_kerja}
            </p>
            <p className="mt-2 text-xs text-[var(--vx-text-secondary)]">
              Tandai setiap langkah saat Anda siap. Progres tersimpan di peramban ini.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                <p className="text-[11px] font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase">
                  Jalur Dukungan Utama
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--vx-primary)] sm:text-sm">
                  {PETA_LABEL_TIPE_DUKUNGAN[perjalanan_aktif.jalur_dukungan_utama]}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                <p className="text-[11px] font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase">
                  Jalur Pendukung Pelengkap
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {perjalanan_aktif.jalur_dukungan_sekunder.map((tipe) => (
                    <StatusBadge key={tipe} label={PETA_LABEL_TIPE_DUKUNGAN[tipe]} nada="netral" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-[var(--vx-border-subtle)] pt-4">
              <Link
                href="/prepare"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#0C264F] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#13356B]"
              >
                <span>Siapkan Percakapan →</span>
              </Link>
              <button
                type="button"
                disabled={sedang_menyimpan_ke_akun}
                onClick={() => void tangani_simpan_ke_perjalanan_saya()}
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)] disabled:opacity-60"
              >
                {sedang_menyimpan_ke_akun ? "Menyimpan..." : "Simpan ke Perjalanan Saya"}
              </button>
              <Link
                href={`/navigate?issue=${perjalanan_aktif.id_masalah_utama}`}
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-secondary)] transition hover:text-[var(--vx-text-primary)]"
              >
                Sesuaikan Jawaban Navigator
              </Link>
            </div>

            <p className="mt-2 text-[11px] text-[var(--vx-text-secondary)]">
              Progres otomatis tersimpan di peramban. Tombol simpan hanya menyimpan ringkasan
              terstruktur ke akun opsional.
            </p>

            {pesan_simpan_akun ? (
              <div
                role="status"
                className={`mt-3 rounded-xl border p-3.5 text-xs ${
                  pesan_simpan_akun.tipe === "sukses"
                    ? "border-emerald-200 bg-[#E7F6EF] text-[#166534]"
                    : pesan_simpan_akun.tipe === "info"
                      ? "border-[#B6CBE8] bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]"
                      : "border-[#FECACA] bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                <p>{pesan_simpan_akun.teks}</p>
                {pesan_simpan_akun.tipe === "info" ? (
                  <Link href="/my-journey" className="mt-1.5 inline-block font-bold underline">
                    Buka halaman Perjalanan Saya →
                  </Link>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* 2. Ordered Next Steps Card (Placed FIRST in body for immediate practical action) */}
          <section
            aria-labelledby="judul-langkah-tindakan"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                  Rencana Tindakan Praktis
                </p>
                <h2
                  id="judul-langkah-tindakan"
                  className="mt-0.5 text-lg font-extrabold text-[var(--vx-text-primary)]"
                >
                  Pilihan langkah yang bisa Anda coba
                </h2>
              </div>
              <StatusBadge label={`${langkah_selesai}/${total_langkah} Selesai`} nada="aman" />
            </div>
            <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
              Tandai progres Anda di bawah ini. Status langkah disimpan secara lokal di peramban ini
              dan dapat disinkronkan ke akun opsional jika Anda memilih menyimpannya.
            </p>

            <ol className="mt-4 space-y-3">
              {perjalanan_aktif.daftar_langkah_rekomendasi.map((langkah) => {
                const status_saat_ini: FollowUpStepStatus =
                  sesi_lokal.status_langkah_lokal[langkah.kode_langkah] ?? langkah.status_langkah;

                return (
                  <li
                    key={langkah.kode_langkah}
                    className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/80 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#0A2552] text-xs font-bold text-white">
                            {langkah.urutan_langkah}
                          </span>
                          <h3 className="text-sm font-bold text-[var(--vx-text-primary)]">
                            {langkah.judul_langkah}
                          </h3>
                          <StatusBadge
                            label={PETA_LABEL_STATUS_LANGKAH[status_saat_ini]}
                            nada={
                              status_saat_ini === "selesai"
                                ? "aman"
                                : status_saat_ini === "sedang_berjalan"
                                  ? "utama"
                                  : "netral"
                            }
                          />
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                          {langkah.deskripsi_langkah}
                        </p>
                        <p className="text-[11px] font-medium text-[var(--vx-primary)]">
                          Relevansi: {langkah.alasan_relevansi}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {(
                          [
                            "belum_dimulai",
                            "sedang_berjalan",
                            "selesai",
                            "dilewati",
                          ] as FollowUpStepStatus[]
                        ).map((opsi_status) => {
                          const aktif = status_saat_ini === opsi_status;
                          return (
                            <button
                              key={opsi_status}
                              type="button"
                              onClick={() => ubah_status_langkah(langkah.kode_langkah, opsi_status)}
                              aria-pressed={aktif}
                              className={`min-h-9 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                                aktif
                                  ? "border-[#0A2552] bg-[#0A2552] text-white"
                                  : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] text-[var(--vx-text-secondary)] hover:border-[#305FA7] hover:text-[var(--vx-text-primary)]"
                              }`}
                            >
                              {PETA_LABEL_STATUS_LANGKAH[opsi_status]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* 3. Guardrails & Reporting Safety Card */}
          <section
            aria-labelledby="judul-penjaga-jalur"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <h2
              id="judul-penjaga-jalur"
              className="text-base font-extrabold text-[var(--vx-text-primary)]"
            >
              Penjaga Keamanan Pelaporan & Batas Etik
            </h2>
            <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
              Aturan perlindungan ini aktif secara otomatis berdasarkan konteks situasi yang Anda
              pilih.
            </p>
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {perjalanan_aktif.daftar_peringatan_penjaga.map((penjaga) => {
                const gaya = PETA_GAYA_PERINGATAN_PENJAGA[penjaga.kode];
                return (
                  <article
                    key={penjaga.kode}
                    className={`rounded-2xl border p-4 ${gaya.aksen_kartu}`}
                  >
                    <span className="inline-block rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-900">
                      {gaya.lencana}
                    </span>
                    <h3 className="mt-2 text-xs font-bold sm:text-sm">{penjaga.judul}</h3>
                    <p className="mt-1 text-xs leading-relaxed opacity-90">{penjaga.pesan}</p>
                    <p className="mt-1.5 text-[10px] font-semibold opacity-80">
                      {PETA_LABEL_LAPISAN_BATAS[penjaga.lapisan_batas]}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 4. Non-Clinical Psychological Support & Referral Preparation Card */}
          <section
            aria-labelledby="judul-dukungan-psikologis"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <StatusBadge label="Lapisan 3: Dukungan Psikologis Non-Klinis" nada="utama" />
                <h2
                  id="judul-dukungan-psikologis"
                  className="mt-2 text-base font-extrabold text-[var(--vx-text-primary)]"
                >
                  Dukungan Psikologis Non-Klinis & Regulasi Kerja
                </h2>
              </div>
              {perjalanan_aktif.rekomendasi_rujukan_profesional.direkomendasikan ? (
                <StatusBadge
                  label="Persiapan Konsultasi Profesional Disarankan"
                  nada="peringatan"
                />
              ) : (
                <StatusBadge label="Fokus Regulasi & Koping Non-Klinis" nada="aman" />
              )}
            </div>

            <div className="mt-3.5 space-y-2.5">
              {perjalanan_aktif.dukungan_psikologis_non_klinis.map((item) => (
                <article
                  key={item.judul}
                  className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-[var(--vx-text-primary)]">{item.judul}</h3>
                    <StatusBadge
                      label={PETA_LABEL_KATEGORI_PSIKOLOGIS[item.kategori]}
                      nada="netral"
                    />
                  </div>
                  <p className="mt-1.5 leading-relaxed text-[var(--vx-text-primary)]">
                    {item.panduan_praktis}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--vx-text-secondary)]">
                    Batas etik: {item.batasan_etik}
                  </p>
                </article>
              ))}
            </div>

            {perjalanan_aktif.rekomendasi_rujukan_profesional.direkomendasikan &&
            perjalanan_aktif.rekomendasi_rujukan_profesional.alasan_pemicu.length > 0 ? (
              <div className="mt-3.5 rounded-xl border border-amber-300 bg-[#FEF3C7]/60 p-3.5 text-xs text-[#92400E] dark:border-amber-700/80 dark:bg-amber-950/30 dark:text-amber-100">
                <p className="font-bold">
                  Alasan Disarankannya Persiapan Rujukan Profesional (Sukarela):
                </p>
                <ul className="mt-1.5 space-y-1">
                  {perjalanan_aktif.rekomendasi_rujukan_profesional.alasan_pemicu.map((alasan) => (
                    <li key={alasan}>• {PETA_LABEL_ALASAN_RUJUKAN[alasan]}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-3.5 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)]/70 p-3.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              <p>
                <strong>Peran Konselor & Psikolog:</strong>{" "}
                {
                  perjalanan_aktif.rekomendasi_rujukan_profesional
                    .penjelasan_peran_konselor_psikolog
                }
              </p>
              <p className="mt-1.5">
                <strong>Kerahasiaan:</strong>{" "}
                {perjalanan_aktif.rekomendasi_rujukan_profesional.catatan_kerahasiaan}
              </p>
            </div>
          </section>

          {/* 5. Legal & Academic Grounding Card */}
          <section
            aria-labelledby="judul-landasan-akademik-hukum"
            className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Landasan Psikologi Kerja" nada="utama" />
              <StatusBadge label="Literasi Regulasi (Non-Adjudikatif)" nada="info" />
            </div>
            <h2
              id="judul-landasan-akademik-hukum"
              className="mt-2 text-base font-extrabold text-[var(--vx-text-primary)]"
            >
              Landasan Akademik Psikologi Kerja & Regulasi Ketenagakerjaan
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-[var(--vx-text-primary)]">
              {perjalanan_aktif.landasan_akademik_hukum.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3 leading-relaxed"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Meaning of Work & SDT Reflection Interactive Card (When on Career / Digital Path) */}
          {adalah_jalur_karier_atau_digital ? (
            <section
              aria-labelledby="judul-refleksi-makna"
              className="rounded-[20px] border border-[#B6CBE8] bg-[var(--vx-surface-secondary)]/85 p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
            >
              <StatusBadge
                label="Alat Refleksi Karier & Makna Kerja (Meaning of Work & SDT)"
                nada="utama"
              />
              <h2
                id="judul-refleksi-makna"
                className="mt-2 text-base font-extrabold text-[var(--vx-text-primary)]"
              >
                Refleksi Makna Kerja, Kebutuhan SDT & Adaptasi Digital
              </h2>
              <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                Sesuaikan orientasi kerja dan kebutuhan psikologis yang paling ingin Anda perkuat
                saat ini:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5">
                  <label
                    htmlFor="select-orientasi-makna"
                    className="block text-xs font-bold text-[var(--vx-text-primary)]"
                  >
                    1. Orientasi Kerja Saat Ini
                  </label>
                  <select
                    id="select-orientasi-makna"
                    value={orientasi_saat_ini}
                    onChange={(event) =>
                      atur_orientasi_saat_ini(event.target.value as OrientasiMaknaKerja)
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
                  >
                    {DAFTAR_OPSI_ORIENTASI_MAKNA.map((opsi) => (
                      <option key={opsi.nilai} value={opsi.nilai}>
                        {opsi.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5">
                  <label
                    htmlFor="select-dimensi-makna"
                    className="block text-xs font-bold text-[var(--vx-text-primary)]"
                  >
                    2. Dimensi Makna Kerja Prioritas
                  </label>
                  <select
                    id="select-dimensi-makna"
                    value={dimensi_makna_utama}
                    onChange={(event) =>
                      atur_dimensi_makna_utama(event.target.value as DimensiMaknaKerja)
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
                  >
                    {DAFTAR_OPSI_DIMENSI_MAKNA.map((opsi) => (
                      <option key={opsi.nilai} value={opsi.nilai}>
                        {opsi.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5">
                  <label
                    htmlFor="select-kebutuhan-sdt"
                    className="block text-xs font-bold text-[var(--vx-text-primary)]"
                  >
                    3. Kebutuhan Psikologis Dasar (SDT) yang Perlu Diperkuat
                  </label>
                  <select
                    id="select-kebutuhan-sdt"
                    value={kebutuhan_sdt_prioritas}
                    onChange={(event) =>
                      atur_kebutuhan_sdt_prioritas(event.target.value as KebutuhanSdtKerja)
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
                  >
                    {DAFTAR_OPSI_KEBUTUHAN_SDT.map((opsi) => (
                      <option key={opsi.nilai} value={opsi.nilai}>
                        {opsi.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3.5">
                  <label
                    htmlFor="select-tantangan-digital"
                    className="block text-xs font-bold text-[var(--vx-text-primary)]"
                  >
                    4. Tantangan Era Kerja Digital
                  </label>
                  <select
                    id="select-tantangan-digital"
                    value={tantangan_kerja_digital}
                    onChange={(event) =>
                      atur_tantangan_kerja_digital(
                        event.target.value as
                          | "information_overload_distraction"
                          | "ai_workflow_adaptation"
                          | "skill_development_need"
                          | "role_clarity_in_digital_work",
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
                  >
                    {DAFTAR_OPSI_TANTANGAN_DIGITAL.map((opsi) => (
                      <option key={opsi.nilai} value={opsi.nilai}>
                        {opsi.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  disabled={sedang_mengevaluasi_refleksi}
                  onClick={() => void tangani_evaluasi_refleksi()}
                  className="min-h-11 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  {sedang_mengevaluasi_refleksi
                    ? "Menyusun Refleksi..."
                    : "Hasilkan Peta Refleksi Makna Kerja"}
                </button>
              </div>

              {refleksi_tersimpan.hasil ? (
                <div className="mt-4 space-y-3 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4">
                  <h3 className="text-sm font-bold text-[var(--vx-text-primary)]">
                    Ringkasan Refleksi Anda
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                    {refleksi_tersimpan.hasil.ringkasan_refleksi_non_klinis}
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--vx-text-primary)]">
                    {refleksi_tersimpan.hasil.langkah_pengembangan_konstruktif.map((langkah) => (
                      <li key={langkah}>• {langkah}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        {/* Right Column (4 Cols): Progress Ring, Screening Boundary, Support Directory, Save Boundary */}
        <aside className="space-y-4 lg:col-span-4">
          {/* 1. Journey Progress Card */}
          <div className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--vx-text-secondary)]">
                  Progres Jalur Dukungan
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[var(--vx-text-primary)]">
                  {persentase_selesai}%
                </p>
                <p className="mt-0.5 text-xs text-[var(--vx-text-secondary)]">
                  {langkah_selesai} dari {total_langkah} langkah selesai
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
                    strokeDashoffset={163.36 - (163.36 * persentase_selesai) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                  <Icon name="route" size={15} />
                </span>
              </div>
            </div>
          </div>

          {/* 2. Compact Psychological Screening Boundary Card */}
          <KartuBatasSkriningPsikologis batas_skrining={batas_skrining} />

          {/* 3. Relevant Support Directory Channels Card */}
          {direktori_pendukung.length > 0 ? (
            <section
              id="support-directory"
              aria-labelledby="judul-direktori-relevan"
              className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)]"
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="judul-direktori-relevan"
                  className="text-sm font-bold text-[var(--vx-text-primary)]"
                >
                  Kanal Direktori Dukungan yang Relevan
                </h2>
                <Link
                  href="/scenarios"
                  className="text-xs font-semibold text-[var(--vx-primary)] hover:underline"
                >
                  Semua →
                </Link>
              </div>
              <div className="mt-3 space-y-2.5">
                {direktori_pendukung.map((layanan) => (
                  <article
                    key={layanan.kode_sumber_daya}
                    className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5 text-xs"
                  >
                    <p className="font-bold text-[var(--vx-text-primary)]">
                      {layanan.nama_layanan}
                    </p>
                    <p className="mt-1 text-[var(--vx-text-secondary)]">
                      {layanan.deskripsi_peran}
                    </p>
                    <p className="mt-1.5 font-semibold text-[var(--vx-primary)]">
                      Kerahasiaan: {layanan.harapan_kerahasiaan}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--vx-text-secondary)]">
                      Batas: {layanan.batas_kewenangan.join(" ")}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <SaveBoundaryCard ringkas />
        </aside>
      </div>
    </div>
  );
}
