"use client";

import type {
  FollowUpStepStatus,
  InputNavigator,
  IssueId,
  ItemKatalogMasalah,
  SpecificIssueId,
} from "@voxera/contracts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { UrgentSupportModal } from "@/components/layout/urgent-support-modal";
import { dapatkan_ikon_domain_masalah, Icon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { KATALOG_FALLBACK_LOKAL } from "@/features/navigator/navigator-fallback.data";
import { GalatApiKlien, klien_api_voxera } from "@/lib/api-client";
import {
  DAFTAR_KARTU_MASALAH_BERANDA,
  DAFTAR_OPSI_DISAMBIGUASI_UNSURE,
  PETA_LABEL_MASALAH,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

type TahapNavigator = 1 | 2 | 3;
type TujuanLangkahBerikutnya =
  | "understand_situation"
  | "prepare_conversation"
  | "explore_support_options"
  | "request_professional_support";

export function IssueNavigatorView() {
  const router = useRouter();
  const search_params = useSearchParams();
  const { sesi_lokal, perbarui_sesi_lokal } = gunakan_konteks_aplikasi();

  const [daftar_katalog, atur_daftar_katalog] =
    useState<ItemKatalogMasalah[]>(KATALOG_FALLBACK_LOKAL);
  const [sedang_memuat_katalog, atur_sedang_memuat_katalog] = useState<boolean>(true);
  const [tahap_aktif, atur_tahap_aktif] = useState<TahapNavigator>(1);
  const perlu_scroll_ke_langkah_2 = useRef(false);

  const [id_masalah, atur_id_masalah] = useState<IssueId>(
    sesi_lokal.progres_navigator.id_masalah ?? "workload_pressure",
  );
  const [kategori_dipilih, atur_kategori_dipilih] = useState<boolean>(
    sesi_lokal.progres_navigator.id_masalah !== null,
  );
  const [id_masalah_terdisambiguasi, atur_id_masalah_terdisambiguasi] = useState<
    SpecificIssueId | undefined
  >(sesi_lokal.progres_navigator.id_masalah_terdisambiguasi);
  const [kelompok_orientasi_unsure, atur_kelompok_orientasi_unsure] = useState<
    "workload_or_role" | "interpersonal_or_safety" | "rights_or_career" | undefined
  >(undefined);
  const [jawaban_cabang, atur_jawaban_cabang] = useState<Record<string, string>>(
    sesi_lokal.progres_navigator.jawaban_cabang,
  );
  const [tujuan_langkah_berikutnya, atur_tujuan_langkah_berikutnya] =
    useState<TujuanLangkahBerikutnya>(sesi_lokal.progres_navigator.tujuan_langkah_berikutnya);
  const [melaporkan_hambatan_fungsi_harian, atur_melaporkan_hambatan_fungsi] = useState<boolean>(
    sesi_lokal.progres_navigator.melaporkan_hambatan_fungsi_harian,
  );
  const [meminta_dukungan_psikolog_konselor, atur_meminta_dukungan_psikolog] = useState<boolean>(
    sesi_lokal.progres_navigator.meminta_dukungan_psikolog_konselor,
  );

  const [sedang_mengevaluasi, atur_sedang_mengevaluasi] = useState<boolean>(false);
  const [pesan_galat, atur_pesan_galat] = useState<string | null>(null);
  const [modal_darurat_terbuka, atur_modal_darurat_terbuka] = useState<boolean>(false);

  useEffect(() => {
    let aktif = true;
    const muat_katalog = async () => {
      try {
        const respons = await klien_api_voxera.navigator.ambil_katalog();
        if (aktif && respons.daftar_masalah.length > 0) {
          atur_daftar_katalog(respons.daftar_masalah);
        }
      } catch {
        // Gunakan katalog fallback lokal apabila backend belum merespons
      } finally {
        if (aktif) {
          atur_sedang_memuat_katalog(false);
        }
      }
    };

    void muat_katalog();
    return () => {
      aktif = false;
    };
  }, []);

  const issue_dari_query = search_params.get("issue");
  useEffect(() => {
    if (!issue_dari_query) {
      return;
    }
    const valid = DAFTAR_KARTU_MASALAH_BERANDA.some((item) => item.id === issue_dari_query);
    if (valid) {
      const id_terpilih = issue_dari_query as IssueId;
      atur_id_masalah(id_terpilih);
      atur_kategori_dipilih(true);
      if (id_terpilih !== "unsure") {
        atur_id_masalah_terdisambiguasi(undefined);
        atur_tahap_aktif(2);
      } else {
        atur_tahap_aktif(1);
      }
    }
  }, [issue_dari_query]);

  useEffect(() => {
    if (tahap_aktif !== 2 || !perlu_scroll_ke_langkah_2.current) {
      return;
    }

    perlu_scroll_ke_langkah_2.current = false;
    document.getElementById("bagian-langkah-2")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [tahap_aktif]);

  const id_masalah_efektif: IssueId =
    id_masalah === "unsure" && id_masalah_terdisambiguasi ? id_masalah_terdisambiguasi : id_masalah;

  const item_katalog_aktif = useMemo(() => {
    return (
      daftar_katalog.find((item) => item.id_masalah === id_masalah_efektif) ??
      daftar_katalog.find((item) => item.id_masalah === id_masalah) ??
      KATALOG_FALLBACK_LOKAL[0]!
    );
  }, [daftar_katalog, id_masalah_efektif, id_masalah]);

  const daftar_opsi_unsure_tersaring = useMemo(() => {
    if (!kelompok_orientasi_unsure) {
      return DAFTAR_OPSI_DISAMBIGUASI_UNSURE;
    }
    return DAFTAR_OPSI_DISAMBIGUASI_UNSURE.filter(
      (opsi) => opsi.kelompok_orientasi === kelompok_orientasi_unsure,
    );
  }, [kelompok_orientasi_unsure]);

  const simpan_progres_sementara = (indeks_langkah_baru: number) => {
    perbarui_sesi_lokal((sebelumnya) => ({
      ...sebelumnya,
      progres_navigator: {
        id_masalah,
        id_masalah_terdisambiguasi:
          id_masalah === "unsure" ? id_masalah_terdisambiguasi : undefined,
        indeks_langkah: indeks_langkah_baru,
        jawaban_cabang,
        tujuan_langkah_berikutnya,
        meminta_dukungan_psikolog_konselor,
        melaporkan_hambatan_fungsi_harian,
      },
    }));
  };

  const tangani_ganti_domain = (id_baru: IssueId) => {
    atur_id_masalah(id_baru);
    atur_kategori_dipilih(true);
    atur_pesan_galat(null);
    atur_jawaban_cabang({});
    if (id_baru !== "unsure") {
      atur_id_masalah_terdisambiguasi(undefined);
    }
    perbarui_sesi_lokal((sebelumnya) => ({
      ...sebelumnya,
      progres_navigator: {
        ...sebelumnya.progres_navigator,
        id_masalah: id_baru,
        id_masalah_terdisambiguasi: undefined,
        indeks_langkah: 1,
        jawaban_cabang: {},
      },
    }));
  };

  const tangani_lanjut_ke_tahap_2 = () => {
    if (!kategori_dipilih) {
      atur_pesan_galat("Pilih satu situasi terlebih dahulu untuk melanjutkan.");
      return;
    }
    if (id_masalah === "unsure" && !id_masalah_terdisambiguasi) {
      atur_pesan_galat(
        "Silakan pilih satu pernyataan situasi yang paling mendekati kondisi Anda pada kartu pemilahan di bawah.",
      );
      return;
    }
    atur_pesan_galat(null);
    simpan_progres_sementara(1);
    perlu_scroll_ke_langkah_2.current = true;
    atur_tahap_aktif(2);
  };

  const tangani_lanjut_ke_tahap_3 = () => {
    atur_pesan_galat(null);
    simpan_progres_sementara(2);
    atur_tahap_aktif(3);
  };

  const tangani_kirim_evaluasi = async () => {
    if (id_masalah === "unsure" && !id_masalah_terdisambiguasi) {
      atur_pesan_galat(
        "Pilih satu pernyataan spesifik terlebih dahulu agar jalur dukungan yang disarankan akurat.",
      );
      atur_tahap_aktif(1);
      return;
    }

    atur_sedang_mengevaluasi(true);
    atur_pesan_galat(null);

    const pertanyaan_pertama = item_katalog_aktif.daftar_pertanyaan_cabang[0];
    const jawaban_pertama = pertanyaan_pertama
      ? (jawaban_cabang[pertanyaan_pertama.id_pertanyaan] ??
        pertanyaan_pertama.daftar_opsi[0]?.id_opsi ??
        "umum")
      : "umum";

    const jawaban_cabang_lengkap: Record<string, string> = {
      ...jawaban_cabang,
    };
    for (const pertanyaan of item_katalog_aktif.daftar_pertanyaan_cabang) {
      if (!jawaban_cabang_lengkap[pertanyaan.id_pertanyaan]) {
        const opsi_bawaan = pertanyaan.daftar_opsi[0]?.id_opsi;
        if (opsi_bawaan) {
          jawaban_cabang_lengkap[pertanyaan.id_pertanyaan] = opsi_bawaan;
        }
      }
    }

    const muatan_input: InputNavigator = {
      id_masalah,
      id_masalah_terdisambiguasi: id_masalah === "unsure" ? id_masalah_terdisambiguasi : undefined,
      id_subkategori: jawaban_pertama,
      jawaban_cabang: jawaban_cabang_lengkap,
      tujuan_langkah_berikutnya,
      meminta_dukungan_psikolog_konselor,
      melaporkan_hambatan_fungsi_harian,
    };

    try {
      const hasil_perjalanan = await klien_api_voxera.navigator.evaluasi_perjalanan(muatan_input);
      const peta_status_langkah_awal: Record<string, FollowUpStepStatus> = {};
      for (const langkah of hasil_perjalanan.daftar_langkah_rekomendasi) {
        peta_status_langkah_awal[langkah.kode_langkah] = langkah.status_langkah;
      }

      perbarui_sesi_lokal({
        progres_navigator: {
          id_masalah,
          id_masalah_terdisambiguasi:
            id_masalah === "unsure" ? id_masalah_terdisambiguasi : undefined,
          indeks_langkah: 3,
          jawaban_cabang: jawaban_cabang_lengkap,
          tujuan_langkah_berikutnya,
          meminta_dukungan_psikolog_konselor,
          melaporkan_hambatan_fungsi_harian,
        },
        perjalanan_dukungan_aktif: hasil_perjalanan,
        status_langkah_lokal: peta_status_langkah_awal,
      });

      router.push("/journey");
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        atur_pesan_galat(galat.pesan);
      } else {
        atur_pesan_galat(
          "Gagal memproses pemetaan situasi saat ini. Silakan periksa koneksi layanan API dan coba kembali.",
        );
      }
    } finally {
      atur_sedang_mengevaluasi(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Banner */}
      <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Navigator Masalah Kerja Terstruktur" nada="utama" />
            <StatusBadge label="Tanpa Input Kronologi Sensitif" nada="aman" />
            {sedang_memuat_katalog ? (
              <StatusBadge label="Menyinkronkan katalog..." nada="netral" />
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => atur_modal_darurat_terbuka(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEE2E2]/80 px-3.5 py-1.5 text-xs font-semibold text-[#991B1B] transition hover:bg-[#FEE2E2] dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
          >
            <Icon name="lifebuoy" size={14} />
            <span>Butuh Bantuan Darurat Sekarang?</span>
          </button>
        </div>

        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-2xl">
          Pemetaan Situasi & Kebutuhan Dukungan Kerja
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
          Jawab pilihan singkat untuk memahami konteks, lalu lihat beberapa langkah yang dapat
          dipertimbangkan. Anda bisa kembali ke tahap sebelumnya kapan saja; tidak perlu menulis
          nama atau kronologi sensitif.
        </p>

        <p className="mt-4 text-xs font-bold text-[var(--vx-primary)]" aria-live="polite">
          Langkah {tahap_aktif} dari 3
        </p>
        <ol
          aria-label="Tahapan Navigator Masalah"
          className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3"
        >
          {[
            { nomor: 1 as const, judul: "Pilih situasi" },
            { nomor: 2 as const, judul: "Pahami konteks" },
            { nomor: 3 as const, judul: "Pilih kebutuhan" },
          ].map((item) => {
            const aktif = tahap_aktif === item.nomor;
            const selesai = tahap_aktif > item.nomor;
            return (
              <li key={item.nomor}>
                <button
                  type="button"
                  disabled={
                    item.nomor > 1 &&
                    (!kategori_dipilih || (id_masalah === "unsure" && !id_masalah_terdisambiguasi))
                  }
                  onClick={() => {
                    if (
                      item.nomor === 1 ||
                      (kategori_dipilih && (id_masalah !== "unsure" || id_masalah_terdisambiguasi))
                    ) {
                      atur_tahap_aktif(item.nomor);
                    }
                  }}
                  aria-current={aktif ? "step" : undefined}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${
                    aktif
                      ? "border-[#0A2552] bg-[#0A2552] text-white shadow-xs"
                      : selesai
                        ? "border-[#B6CBE8] bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]"
                        : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] text-[var(--vx-text-secondary)]"
                  }`}
                >
                  <span>{item.judul}</span>
                  {selesai ? <span className="text-[11px] font-bold">Selesai</span> : null}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-[var(--vx-text-secondary)]">
          Pilihan Anda disimpan sementara di sesi peramban ini agar Anda bisa melanjutkan atau
          kembali mengubah jawaban.
        </p>
      </section>

      {pesan_galat ? (
        <div
          role="alert"
          className="rounded-2xl border border-[#FECACA] bg-[#FEE2E2]/80 p-4 text-xs font-semibold text-[#991B1B] dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
        >
          {pesan_galat}
        </div>
      ) : null}

      {/* 2-Column Dashboard Workspace: Left 8 Cols Active Step Card | Right 4 Cols Session Context */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Main Column */}
        <div className="lg:col-span-8">
          {tahap_aktif === 1 ? (
            <section
              aria-labelledby="judul-tahap-1"
              className="space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
            >
              <div>
                <h2
                  id="judul-tahap-1"
                  className="text-lg font-extrabold text-[var(--vx-text-primary)]"
                >
                  Langkah 1: Pilih situasi
                </h2>
                <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                  Pilih satu kategori yang paling mendekati. Jika beberapa hal terasa bercampur,
                  pilih <strong>Belum yakin</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {DAFTAR_KARTU_MASALAH_BERANDA.map((kartu) => {
                  const terpilih = kategori_dipilih && id_masalah === kartu.id;
                  const nama_ikon = dapatkan_ikon_domain_masalah(kartu.id);
                  return (
                    <button
                      key={kartu.id}
                      type="button"
                      onClick={() => tangani_ganti_domain(kartu.id)}
                      aria-pressed={terpilih}
                      className={`flex flex-col justify-between rounded-2xl border p-3.5 text-left transition ${
                        terpilih
                          ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] ring-2 ring-[#305FA7]/25"
                          : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/65 hover:border-[#305FA7] hover:bg-[var(--vx-surface-primary)]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--vx-surface-primary)] text-[var(--vx-primary)] shadow-2xs">
                            <Icon name={nama_ikon} size={15} />
                          </span>
                          <StatusBadge
                            label={kartu.tag_kategori}
                            nada={terpilih ? "utama" : "netral"}
                          />
                        </div>
                        <p className="mt-2.5 text-sm font-bold text-[var(--vx-text-primary)]">
                          {kartu.judul}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                          {kartu.subjudul_singkat}
                        </p>
                      </div>
                      <p className="mt-2.5 text-[11px] font-bold text-[var(--vx-primary)]">
                        {terpilih ? "✓ Kategori Terpilih" : "Pilih kategori ini"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {id_masalah === "unsure" ? (
                <div className="mt-4 space-y-4 rounded-2xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)]/75 p-4 sm:p-5">
                  <div>
                    <StatusBadge label="Alur Disambiguasi Terarah (Unsure Flow)" nada="utama" />
                    <h3 className="mt-2 text-base font-bold text-[var(--vx-text-primary)]">
                      Langkah 1B: Bantu Kami Memilah Situasi Campuran Anda
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                      Ketika masalah terasa bercampur, memilih satu titik masuk yang paling mendesak
                      membantu Anda mengambil langkah pertama yang terfokus.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase">
                      1. Kelompok Fokus Dominan (Opsional untuk Menyaring)
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {[
                        {
                          id: "workload_or_role" as const,
                          label: "Beban Kerja, Peran & Kelelahan Emosi",
                        },
                        {
                          id: "interpersonal_or_safety" as const,
                          label: "Relasi, Intimidasi & Keadilan Perlakuan",
                        },
                        {
                          id: "rights_or_career" as const,
                          label: "Hak Kontrak/Upah, Karier & Kerja Digital",
                        },
                      ].map((kelompok) => {
                        const aktif = kelompok_orientasi_unsure === kelompok.id;
                        return (
                          <button
                            key={kelompok.id}
                            type="button"
                            onClick={() =>
                              atur_kelompok_orientasi_unsure(aktif ? undefined : kelompok.id)
                            }
                            aria-pressed={aktif}
                            className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                              aktif
                                ? "border-[#0A2552] bg-[#0A2552] text-white"
                                : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] text-[var(--vx-text-primary)] hover:bg-[var(--vx-surface-secondary-alt)]"
                            }`}
                          >
                            {kelompok.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-wider text-[var(--vx-text-secondary)] uppercase">
                      2. Pilih Satu Pernyataan yang Paling Mendesak Hari Ini
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2.5">
                      {daftar_opsi_unsure_tersaring.map((opsi) => {
                        const terpilih = id_masalah_terdisambiguasi === opsi.id_masalah_spesifik;
                        return (
                          <button
                            key={opsi.id_masalah_spesifik}
                            type="button"
                            onClick={() => {
                              atur_id_masalah_terdisambiguasi(opsi.id_masalah_spesifik);
                              atur_pesan_galat(null);
                            }}
                            aria-pressed={terpilih}
                            className={`rounded-xl border p-3.5 text-left transition ${
                              terpilih
                                ? "border-[#0A2552] bg-[var(--vx-surface-primary)] ring-2 ring-[#305FA7]/30"
                                : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)]/90 hover:border-[#305FA7]"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[var(--vx-text-primary)] sm:text-sm">
                                {opsi.judul_pernyataan}
                              </span>
                              <StatusBadge
                                label={PETA_LABEL_MASALAH[opsi.id_masalah_spesifik]}
                                nada={terpilih ? "utama" : "netral"}
                              />
                            </div>
                            <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                              {opsi.penjelasan_bantu}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--vx-border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={tangani_lanjut_ke_tahap_2}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  <span>Lanjut: pahami konteks →</span>
                </button>
              </div>
            </section>
          ) : null}

          {tahap_aktif === 2 ? (
            <section
              id="bagian-langkah-2"
              aria-labelledby="judul-tahap-2"
              className="scroll-mt-28 space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <StatusBadge
                    label={`Situasi: ${PETA_LABEL_MASALAH[id_masalah_efektif]}`}
                    nada="utama"
                  />
                  <h2
                    id="judul-tahap-2"
                    className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]"
                  >
                    Langkah 2: Pahami konteks situasi
                  </h2>
                  <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                    Pilih jawaban yang paling mendekati. Ini membantu menyesuaikan pilihan langkah
                    yang akan ditampilkan.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {item_katalog_aktif.daftar_pertanyaan_cabang.map((pertanyaan, indeks) => {
                  const jawaban_saat_ini =
                    jawaban_cabang[pertanyaan.id_pertanyaan] ?? pertanyaan.daftar_opsi[0]?.id_opsi;
                  return (
                    <fieldset
                      key={pertanyaan.id_pertanyaan}
                      className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/70 p-4"
                    >
                      <legend className="text-xs font-bold text-[var(--vx-text-primary)] sm:text-sm">
                        {indeks + 1}. {pertanyaan.teks_pertanyaan}
                      </legend>
                      <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                        {pertanyaan.alasan_ditanyakan}
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {pertanyaan.daftar_opsi.map((opsi) => {
                          const terpilih = jawaban_saat_ini === opsi.id_opsi;
                          return (
                            <button
                              key={opsi.id_opsi}
                              type="button"
                              onClick={() =>
                                atur_jawaban_cabang((sebelumnya) => ({
                                  ...sebelumnya,
                                  [pertanyaan.id_pertanyaan]: opsi.id_opsi,
                                }))
                              }
                              aria-pressed={terpilih}
                              className={`min-h-11 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition ${
                                terpilih
                                  ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] font-semibold text-[var(--vx-primary)] ring-2 ring-[#305FA7]/20"
                                  : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] text-[var(--vx-text-primary)] hover:border-[#305FA7]"
                              }`}
                            >
                              <span className="block font-bold">{opsi.label}</span>
                              {opsi.penjelasan_konteks ? (
                                <span className="mt-0.5 block text-[11px] font-normal text-[var(--vx-text-secondary)]">
                                  {opsi.penjelasan_konteks}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--vx-border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={() => atur_tahap_aktif(1)}
                  className="min-h-11 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
                >
                  ← Kembali ke situasi
                </button>
                <button
                  type="button"
                  onClick={tangani_lanjut_ke_tahap_3}
                  className="min-h-11 rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  Lanjut: pilih kebutuhan →
                </button>
              </div>
            </section>
          ) : null}

          {tahap_aktif === 3 ? (
            <section
              aria-labelledby="judul-tahap-3"
              className="space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6"
            >
              <div>
                <StatusBadge label="Tujuan Langkah & Dukungan Profesional" nada="utama" />
                <h2
                  id="judul-tahap-3"
                  className="mt-2 text-lg font-extrabold text-[var(--vx-text-primary)]"
                >
                  Langkah 3: Pilih bantuan yang Anda butuhkan
                </h2>
                <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                  Pilih hal yang paling ingin Anda dapatkan. Bagian dukungan profesional bersifat
                  opsional dan tidak menghasilkan diagnosis.
                </p>
              </div>

              <div className="space-y-4">
                <fieldset className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/70 p-4">
                  <legend className="text-xs font-bold text-[var(--vx-text-primary)] sm:text-sm">
                    1. Apa tujuan langkah utama yang paling Anda butuhkan dari pemetaan ini?
                  </legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      {
                        nilai: "understand_situation" as const,
                        label: "Memahami situasi, hak kerja & opsi langkah aman",
                      },
                      {
                        nilai: "prepare_conversation" as const,
                        label: "Menyiapkan poin percakapan terstruktur (Manajer/HR/Ahli)",
                      },
                      {
                        nilai: "explore_support_options" as const,
                        label: "Menjelajahi kanal dukungan organisasi, serikat, atau koping kerja",
                      },
                      {
                        nilai: "request_professional_support" as const,
                        label: "Menyiapkan konsultasi profesional (Psikolog, Konselor, atau LBH)",
                      },
                    ].map((opsi) => {
                      const terpilih = tujuan_langkah_berikutnya === opsi.nilai;
                      return (
                        <button
                          key={opsi.nilai}
                          type="button"
                          onClick={() => atur_tujuan_langkah_berikutnya(opsi.nilai)}
                          aria-pressed={terpilih}
                          className={`min-h-11 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                            terpilih
                              ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)] ring-2 ring-[#305FA7]/20"
                              : "border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] text-[var(--vx-text-primary)]"
                          }`}
                        >
                          {opsi.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="rounded-2xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/70 p-4">
                  <p className="text-xs font-bold text-[var(--vx-text-primary)] sm:text-sm">
                    2. Indikator Kebutuhan Dukungan Profesional (Opsional)
                  </p>
                  <p className="mt-1 text-xs text-[var(--vx-text-secondary)]">
                    Centang jika salah satu kondisi berikut sesuai dengan keadaan Anda saat ini:
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3 text-xs text-[var(--vx-text-primary)]">
                      <input
                        type="checkbox"
                        checked={melaporkan_hambatan_fungsi_harian}
                        onChange={(event) => atur_melaporkan_hambatan_fungsi(event.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0A2552] focus:ring-[#305FA7]"
                      />
                      <span>
                        Situasi kerja ini mulai mengganggu fungsi keseharian saya (misalnya kualitas
                        tidur, konsentrasi dasar, atau ketenangan di luar jam kerja).
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-3 text-xs text-[var(--vx-text-primary)]">
                      <input
                        type="checkbox"
                        checked={meminta_dukungan_psikolog_konselor}
                        onChange={(event) => atur_meminta_dukungan_psikolog(event.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0A2552] focus:ring-[#305FA7]"
                      />
                      <span>
                        Saya secara eksplisit ingin menyertakan panduan persiapan konsultasi menuju
                        psikolog atau konselor profesional.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--vx-border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={() => atur_tahap_aktif(2)}
                  className="min-h-11 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-4 py-2 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
                >
                  ← Kembali ke konteks
                </button>
                <button
                  type="button"
                  disabled={sedang_mengevaluasi}
                  onClick={() => void tangani_kirim_evaluasi()}
                  className="min-h-11 rounded-full bg-[#0C264F] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#13356B] disabled:opacity-60"
                >
                  {sedang_mengevaluasi ? "Menyusun Jalur Dukungan..." : "Lihat pilihan langkah →"}
                </button>
              </div>
            </section>
          ) : null}
        </div>

        {/* Right 4 Columns: Session Summary + Privacy Guarantee + Urgent Support Card */}
        <aside className="space-y-4 lg:col-span-4">
          {/* Session Summary Card */}
          <div className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)] sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[var(--vx-text-primary)]">
                Ringkasan Sesi Pemetaan
              </h2>
              <StatusBadge label={`Tahap ${tahap_aktif}/3`} nada="utama" />
            </div>

            <dl className="mt-3.5 space-y-2.5 text-xs">
              <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
                <dt className="font-semibold text-[var(--vx-text-secondary)]">Situasi dipilih</dt>
                <dd className="mt-0.5 font-bold text-[var(--vx-text-primary)]">
                  {kategori_dipilih ? PETA_LABEL_MASALAH[id_masalah_efektif] : "Belum dipilih"}
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
                <dt className="font-semibold text-[var(--vx-text-secondary)]">
                  Pertanyaan Dijawab
                </dt>
                <dd className="mt-0.5 font-bold text-[var(--vx-text-primary)]">
                  {Object.keys(jawaban_cabang).length} dari{" "}
                  {item_katalog_aktif.daftar_pertanyaan_cabang.length} konteks
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--vx-bg-workspace)] p-3">
                <dt className="font-semibold text-[var(--vx-text-secondary)]">
                  Dukungan Profesional Sukarela
                </dt>
                <dd className="mt-0.5 font-bold text-[var(--vx-text-primary)]">
                  {meminta_dukungan_psikolog_konselor || melaporkan_hambatan_fungsi_harian
                    ? "Disertakan dalam rekomendasi"
                    : "Fokus navigasi & koping kerja"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)]/85 p-4 shadow-[var(--vx-shadow-card)] sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--vx-surface-primary)] text-[var(--vx-primary)]">
                <Icon name="lock" size={16} />
              </span>
              <h2 className="text-sm font-bold text-[var(--vx-text-primary)]">
                Jaminan Privasi Sesi
              </h2>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
              Jawaban disimpan sementara di peramban ini. Jawaban tidak dikirim ke atasan atau HR
              perusahaan.
            </p>
          </div>

          {/* Urgent Support Quick Card */}
          <div className="rounded-[20px] border border-[#FECACA] bg-[#FEE2E2]/45 p-4 shadow-[var(--vx-shadow-card)] dark:border-rose-800/70 dark:bg-rose-950/30 sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#991B1B]">
                <Icon name="lifebuoy" size={16} />
              </span>
              <h2 className="text-sm font-bold text-[#991B1B] dark:text-rose-200">
                Bantuan Segera
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--vx-text-primary)]">
              Jika situasi Anda melibatkan bahaya fisik langsung atau krisis keselamatan, akses
              kontak darurat resmi tanpa perlu menyelesaikan kuesioner ini.
            </p>
            <button
              type="button"
              onClick={() => atur_modal_darurat_terbuka(true)}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-800"
            >
              Lihat Kontak Darurat Resmi
            </button>
          </div>
        </aside>
      </div>

      <UrgentSupportModal
        terbuka={modal_darurat_terbuka}
        tutup={() => atur_modal_darurat_terbuka(false)}
      />
    </div>
  );
}
