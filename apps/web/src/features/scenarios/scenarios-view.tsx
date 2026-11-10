"use client";

import type {
  DimensiMaknaKerja,
  HasilRefleksiMaknaKerja,
  ItemDirektoriDukungan,
  KebutuhanSdtKerja,
  OrientasiMaknaKerja,
  SkenarioInteraktif,
  SupportTypeId,
} from "@voxera/contracts";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SKENARIO_FALLBACK_LOKAL } from "@/features/scenarios/scenarios-fallback.data";
import { klien_api_voxera } from "@/lib/api-client";
import {
  DAFTAR_OPSI_DIMENSI_MAKNA,
  DAFTAR_OPSI_KEBUTUHAN_SDT,
  DAFTAR_OPSI_ORIENTASI_MAKNA,
  DAFTAR_OPSI_TANTANGAN_DIGITAL,
  PETA_LABEL_MASALAH,
  PETA_LABEL_TIPE_DUKUNGAN,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

type TabSkenario = "skenario" | "refleksi" | "direktori";

export function ScenariosView() {
  const { sesi_lokal, perbarui_sesi_lokal } = gunakan_konteks_aplikasi();

  const [tab_aktif, atur_tab_aktif] = useState<TabSkenario>("skenario");
  const [daftar_skenario, atur_daftar_skenario] =
    useState<SkenarioInteraktif[]>(SKENARIO_FALLBACK_LOKAL);
  const [id_skenario_aktif, atur_id_skenario_aktif] = useState<string>("scn_1_workload_overtime");
  const [pilihan_opsi_per_skenario, atur_pilihan_opsi_per_skenario] = useState<
    Record<string, string>
  >({});

  const [daftar_direktori, atur_daftar_direktori] = useState<ItemDirektoriDukungan[]>([]);
  const [filter_tipe_dukungan, atur_filter_tipe_dukungan] = useState<SupportTypeId | "semua">(
    "semua",
  );

  const [orientasi_saat_ini, atur_orientasi_saat_ini] = useState<OrientasiMaknaKerja>(
    sesi_lokal.refleksi_makna_kerja.input.orientasi_saat_ini,
  );
  const [dimensi_makna_utama, atur_dimensi_makna_utama] = useState<DimensiMaknaKerja>(
    sesi_lokal.refleksi_makna_kerja.input.dimensi_makna_utama,
  );
  const [kebutuhan_sdt_prioritas, atur_kebutuhan_sdt_prioritas] = useState<KebutuhanSdtKerja>(
    sesi_lokal.refleksi_makna_kerja.input.kebutuhan_sdt_prioritas,
  );
  const [tantangan_kerja_digital, atur_tantangan_kerja_digital] = useState<
    | "information_overload_distraction"
    | "ai_workflow_adaptation"
    | "skill_development_need"
    | "role_clarity_in_digital_work"
  >(sesi_lokal.refleksi_makna_kerja.input.tantangan_kerja_digital);
  const [hasil_refleksi, atur_hasil_refleksi] = useState<HasilRefleksiMaknaKerja | null>(
    sesi_lokal.refleksi_makna_kerja.hasil,
  );
  const [sedang_memuat_refleksi, atur_sedang_memuat_refleksi] = useState<boolean>(false);

  useEffect(() => {
    let aktif = true;
    const muat_data = async () => {
      try {
        const [respons_skenario, respons_direktori] = await Promise.all([
          klien_api_voxera.alat_bantu.ambil_daftar_skenario(),
          klien_api_voxera.alat_bantu.ambil_direktori_dukungan(),
        ]);
        if (aktif) {
          if (respons_skenario.daftar_skenario.length > 0) {
            atur_daftar_skenario(respons_skenario.daftar_skenario);
            atur_id_skenario_aktif(respons_skenario.daftar_skenario[0]!.id_skenario);
          }
          atur_daftar_direktori(respons_direktori.daftar_layanan);
        }
      } catch {
        // Gunakan fallback skenario lokal jika layanan belum merespons
      }
    };
    void muat_data();
    return () => {
      aktif = false;
    };
  }, []);

  const skenario_aktif = useMemo(() => {
    return (
      daftar_skenario.find((item) => item.id_skenario === id_skenario_aktif) ?? daftar_skenario[0]!
    );
  }, [daftar_skenario, id_skenario_aktif]);

  const id_opsi_terpilih_aktif =
    pilihan_opsi_per_skenario[skenario_aktif.id_skenario] ?? skenario_aktif.daftar_opsi[0]?.id_opsi;

  const opsi_keputusan_aktif = useMemo(() => {
    return (
      skenario_aktif.daftar_opsi.find((opsi) => opsi.id_opsi === id_opsi_terpilih_aktif) ??
      skenario_aktif.daftar_opsi[0]!
    );
  }, [id_opsi_terpilih_aktif, skenario_aktif.daftar_opsi]);

  const direktori_tersaring = useMemo(() => {
    if (filter_tipe_dukungan === "semua") {
      return daftar_direktori;
    }
    return daftar_direktori.filter((item) => item.id_tipe_dukungan === filter_tipe_dukungan);
  }, [daftar_direktori, filter_tipe_dukungan]);

  const tangani_evaluasi_refleksi = async () => {
    atur_sedang_memuat_refleksi(true);
    const input_refleksi = {
      orientasi_saat_ini,
      dimensi_makna_utama,
      kebutuhan_sdt_prioritas,
      tantangan_kerja_digital,
    };
    try {
      const hasil = await klien_api_voxera.alat_bantu.evaluasi_refleksi_makna(input_refleksi);
      atur_hasil_refleksi(hasil);
      perbarui_sesi_lokal({
        refleksi_makna_kerja: {
          input: input_refleksi,
          hasil,
        },
      });
    } catch {
      // Biarkan pengguna mencoba ulang
    } finally {
      atur_sedang_memuat_refleksi(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header & 3-Tab Segmented Control */}
      <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="4 Skenario Keputusan Kerja Interaktif" nada="utama" />
          <StatusBadge label="Refleksi Makna Kerja • Direktori Kanal Resmi" nada="aman" />
        </div>
        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-2xl">
          Belajar lewat contoh situasi kerja
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
          Baca contoh situasi, pilih respons, lalu lihat hal yang perlu dipertimbangkan dan pilihan
          dukungan yang tersedia. Simulasi ini tidak mengubah atau melaporkan kondisi kerja Anda.
        </p>

        {/* Segmented Tab Bar */}
        <div
          role="tablist"
          aria-label="Modul eksplorasi skenario dan direktori"
          className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-[var(--vx-bg-workspace)] p-1.5 sm:grid-cols-3"
        >
          {[
            {
              id: "skenario" as const,
              label: "1. Simulasi 4 Skenario Keputusan",
              ikon: "book" as const,
            },
            {
              id: "refleksi" as const,
              label: "2. Refleksi Makna Kerja & SDT",
              ikon: "sparkle" as const,
            },
            {
              id: "direktori" as const,
              label: "3. Direktori Kanal Dukungan",
              ikon: "lifebuoy" as const,
            },
          ].map((tab) => {
            const aktif = tab_aktif === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={aktif}
                onClick={() => atur_tab_aktif(tab.id)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  aktif
                    ? "bg-[#0A2552] text-white shadow-xs"
                    : "text-[var(--vx-text-secondary)] hover:bg-[var(--vx-surface-primary)] hover:text-[var(--vx-text-primary)]"
                }`}
              >
                <Icon name={tab.ikon} size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab 1: 4 Interactive Workplace Decision Scenarios */}
      {tab_aktif === "skenario" ? (
        <section
          aria-labelledby="judul-daftar-skenario"
          className="grid grid-cols-1 gap-4 lg:grid-cols-12"
        >
          {/* Left 4 Cols: 4 Scenario Selector Cards */}
          <div className="space-y-2.5 lg:col-span-4">
            <h2
              id="judul-daftar-skenario"
              className="text-xs font-bold tracking-wider text-[var(--vx-primary)] uppercase"
            >
              Pilih Skenario Situasi (4)
            </h2>
            {daftar_skenario.map((skenario, indeks) => {
              const aktif = skenario.id_skenario === skenario_aktif.id_skenario;
              return (
                <button
                  key={skenario.id_skenario}
                  type="button"
                  onClick={() => atur_id_skenario_aktif(skenario.id_skenario)}
                  aria-pressed={aktif}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    aktif
                      ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] shadow-xs ring-2 ring-[#305FA7]/20"
                      : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] hover:border-[#305FA7]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge
                      label={PETA_LABEL_MASALAH[skenario.id_masalah_terkait]}
                      nada={aktif ? "utama" : "netral"}
                    />
                    <span className="text-[11px] font-bold text-[var(--vx-text-secondary)]">
                      Skenario {indeks + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-[var(--vx-text-primary)] sm:text-sm">
                    {skenario.judul}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right 8 Cols: Active Scenario Decision Workspace */}
          <div className="space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6 lg:col-span-8">
            <div>
              <StatusBadge
                label={PETA_LABEL_MASALAH[skenario_aktif.id_masalah_terkait]}
                nada="utama"
              />
              <h3 className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]">
                {skenario_aktif.judul}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
                {skenario_aktif.narasi_situasi}
              </p>
              <div className="mt-3 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5 text-xs text-[var(--vx-text-secondary)]">
                <strong className="text-[var(--vx-text-primary)]">Pelajaran Multidisiplin: </strong>
                {skenario_aktif.pelajaran_multidisiplin}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                {skenario_aktif.pertanyaan_keputusan}
              </p>
              <div className="mt-2.5 space-y-2.5">
                {skenario_aktif.daftar_opsi.map((opsi, indeks) => {
                  const terpilih = opsi.id_opsi === opsi_keputusan_aktif.id_opsi;
                  return (
                    <button
                      key={opsi.id_opsi}
                      type="button"
                      onClick={() =>
                        atur_pilihan_opsi_per_skenario((sebelumnya) => ({
                          ...sebelumnya,
                          [skenario_aktif.id_skenario]: opsi.id_opsi,
                        }))
                      }
                      aria-pressed={terpilih}
                      className={`w-full rounded-xl border p-3.5 text-left transition ${
                        terpilih
                          ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] ring-2 ring-[#305FA7]/20"
                          : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/60 hover:border-[#305FA7]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[var(--vx-text-primary)]">
                          Opsi {String.fromCharCode(65 + indeks)}: {opsi.label_tindakan}
                        </span>
                        <StatusBadge
                          label={terpilih ? "Sedang Ditinjau" : "Lihat Implikasi"}
                          nada={terpilih ? "utama" : "netral"}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {opsi_keputusan_aktif ? (
              <div className="space-y-3 rounded-2xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)]/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--vx-text-primary)]">
                    Evaluasi Dampak Pilihan Anda
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {opsi_keputusan_aktif.opsi_dukungan_relevan.map((tipe) => (
                      <StatusBadge key={tipe} label={PETA_LABEL_TIPE_DUKUNGAN[tipe]} nada="utama" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-[var(--vx-surface-primary)] p-3.5 text-xs">
                    <p className="font-bold text-[var(--vx-text-primary)]">Pertimbangan Utama:</p>
                    <p className="mt-1 leading-relaxed text-[var(--vx-text-secondary)]">
                      {opsi_keputusan_aktif.pertimbangan_utama}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--vx-surface-primary)] p-3.5 text-xs">
                    <p className="font-bold text-[var(--vx-text-primary)]">Implikasi Potensial:</p>
                    <p className="mt-1 leading-relaxed text-[var(--vx-text-secondary)]">
                      {opsi_keputusan_aktif.implikasi_potensial}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--vx-surface-primary)] p-3.5 text-xs">
                  <p className="text-[var(--vx-text-primary)]">
                    <strong>Pendekatan Konstruktif:</strong>{" "}
                    {opsi_keputusan_aktif.pendekatan_alternatif}
                  </p>
                  <Link
                    href={skenario_aktif.tautan_perjalanan_dukungan}
                    className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-[#0C264F] px-4 py-2 font-semibold text-white transition hover:bg-[#13356B]"
                  >
                    Petakan Situasi Serupa →
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Tab 2: Meaning of Work & SDT Reflection */}
      {tab_aktif === "refleksi" ? (
        <section
          aria-labelledby="judul-modul-makna-kerja"
          className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
        >
          <StatusBadge
            label="Modul Psikologi Kerja: Meaning of Work, SDT & Digital Era"
            nada="utama"
          />
          <h2
            id="judul-modul-makna-kerja"
            className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]"
          >
            Refleksi Makna Kerja, Kebutuhan Psikologis (SDT) & Kerja Digital
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
            Gunakan alat refleksi interaktif ini untuk memetakan orientasi kerja Anda (Job, Career,
            Calling), dimensi makna kerja, dan kebutuhan psikologis dasar (Otonomi, Kompetensi,
            Keterhubungan).
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
              <label
                htmlFor="skenario-orientasi"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Orientasi Kerja Saat Ini
              </label>
              <select
                id="skenario-orientasi"
                value={orientasi_saat_ini}
                onChange={(event) =>
                  atur_orientasi_saat_ini(event.target.value as OrientasiMaknaKerja)
                }
                className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-2.5 py-2 text-xs text-[var(--vx-text-primary)]"
              >
                {DAFTAR_OPSI_ORIENTASI_MAKNA.map((opsi) => (
                  <option key={opsi.nilai} value={opsi.nilai}>
                    {opsi.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
              <label
                htmlFor="skenario-dimensi"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Dimensi Makna Kerja Utama
              </label>
              <select
                id="skenario-dimensi"
                value={dimensi_makna_utama}
                onChange={(event) =>
                  atur_dimensi_makna_utama(event.target.value as DimensiMaknaKerja)
                }
                className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-2.5 py-2 text-xs text-[var(--vx-text-primary)]"
              >
                {DAFTAR_OPSI_DIMENSI_MAKNA.map((opsi) => (
                  <option key={opsi.nilai} value={opsi.nilai}>
                    {opsi.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
              <label
                htmlFor="skenario-sdt"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Kebutuhan SDT yang Perlu Diperkuat
              </label>
              <select
                id="skenario-sdt"
                value={kebutuhan_sdt_prioritas}
                onChange={(event) =>
                  atur_kebutuhan_sdt_prioritas(event.target.value as KebutuhanSdtKerja)
                }
                className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-2.5 py-2 text-xs text-[var(--vx-text-primary)]"
              >
                {DAFTAR_OPSI_KEBUTUHAN_SDT.map((opsi) => (
                  <option key={opsi.nilai} value={opsi.nilai}>
                    {opsi.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
              <label
                htmlFor="skenario-digital"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Fokus Adaptasi Kerja Digital
              </label>
              <select
                id="skenario-digital"
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
                className="mt-2 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] px-2.5 py-2 text-xs text-[var(--vx-text-primary)]"
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
              disabled={sedang_memuat_refleksi}
              onClick={() => void tangani_evaluasi_refleksi()}
              className="min-h-11 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
            >
              {sedang_memuat_refleksi
                ? "Menyusun Peta Refleksi..."
                : "Evaluasi Refleksi Makna Kerja"}
            </button>
          </div>

          {hasil_refleksi ? (
            <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)]/80 p-4 md:grid-cols-2">
              <div className="space-y-2 text-xs">
                <p className="font-bold text-[var(--vx-text-primary)]">
                  Ringkasan Orientasi & Dimensi Makna:
                </p>
                <p className="leading-relaxed text-[var(--vx-text-secondary)]">
                  {hasil_refleksi.ringkasan_refleksi_non_klinis}
                </p>
                <ul className="space-y-1 text-[11px] font-medium text-[var(--vx-primary)]">
                  {hasil_refleksi.kaitan_konsep_psikologi_kerja.map((konsep) => (
                    <li key={konsep}>• {konsep}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-[var(--vx-text-secondary)]">
                  {hasil_refleksi.catatan_batas_non_asesmen}
                </p>
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-[var(--vx-text-primary)]">
                  Langkah Pengembangan Konstruktif:
                </p>
                <ul className="space-y-1.5 text-[var(--vx-text-primary)]">
                  {hasil_refleksi.langkah_pengembangan_konstruktif.map((item) => (
                    <li key={item} className="rounded-xl bg-[var(--vx-surface-primary)] p-2.5">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Tab 3: Verified Support Channel Directory */}
      {tab_aktif === "direktori" ? (
        <section
          aria-labelledby="judul-direktori-dukungan"
          className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
        >
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <StatusBadge label="Direktori Kanal Resmi & Batas Mandat" nada="info" />
              <h2
                id="judul-direktori-dukungan"
                className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]"
              >
                Direktori Kanal Dukungan & Mandat Layanan
              </h2>
              <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                Setiap kanal mencantumkan batas kewenangannya secara jujur agar Anda memilih saluran
                yang tepat.
              </p>
            </div>
            <div>
              <label
                htmlFor="filter-direktori"
                className="block text-[11px] font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase"
              >
                Saring Berdasarkan Tipe Dukungan
              </label>
              <select
                id="filter-direktori"
                value={filter_tipe_dukungan}
                onChange={(event) =>
                  atur_filter_tipe_dukungan(event.target.value as SupportTypeId | "semua")
                }
                className="mt-1 min-h-10 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)]"
              >
                <option value="semua">Semua Kanal Dukungan</option>
                {Object.entries(PETA_LABEL_TIPE_DUKUNGAN).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {direktori_tersaring.map((layanan) => (
              <article
                key={layanan.kode_sumber_daya}
                className="flex flex-col justify-between rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/80 p-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <StatusBadge
                      label={PETA_LABEL_TIPE_DUKUNGAN[layanan.id_tipe_dukungan]}
                      nada="utama"
                    />
                    {layanan.kategori_layanan === "immediate_safety" ? (
                      <StatusBadge label="Layanan Krisis" nada="peringatan" />
                    ) : null}
                  </div>
                  <h3 className="mt-2.5 text-sm font-bold text-[var(--vx-text-primary)]">
                    {layanan.nama_layanan}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--vx-primary)]">
                    Kategori: {layanan.kategori_layanan}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                    {layanan.deskripsi_peran}
                  </p>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-[var(--vx-border-subtle)] pt-3 text-xs">
                  <p className="text-[var(--vx-text-primary)]">
                    <strong>Kerahasiaan:</strong> {layanan.harapan_kerahasiaan}
                  </p>
                  <p className="text-[11px] text-[var(--vx-text-secondary)]">
                    <strong>Kapan Tepat Digunakan:</strong>{" "}
                    {layanan.kapan_tepat_digunakan.join(" ")}
                  </p>
                  <p className="rounded-lg bg-[var(--vx-surface-primary)] p-2 text-[11px] text-[var(--vx-text-secondary)]">
                    <strong>Batas Mandat:</strong> {layanan.batas_kewenangan.join(" ")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <SaveBoundaryCard ringkas />
    </div>
  );
}
