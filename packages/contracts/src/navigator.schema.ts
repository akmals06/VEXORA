import { z } from "zod";
import {
  skema_alasan_rujukan_profesional,
  skema_id_masalah,
  skema_id_masalah_spesifik,
  skema_id_pilar,
  skema_id_tipe_dukungan,
  skema_kategori_dukungan_psikologis,
  skema_kelas_hasil,
  skema_kode_peringatan_penjaga,
  skema_lapisan_batas_psikologis,
  skema_status_langkah,
} from "./taxonomy.schema.js";

export const skema_opsi_pertanyaan_cabang = z.object({
  id_opsi: z.string().min(2),
  label: z.string().min(3),
  penjelasan_konteks: z.string().min(5).optional(),
});

export const skema_pertanyaan_cabang_domain = z.object({
  id_pertanyaan: z.string().min(2),
  teks_pertanyaan: z.string().min(5),
  alasan_ditanyakan: z.string().min(10),
  daftar_opsi: z.array(skema_opsi_pertanyaan_cabang).min(2),
});

export const skema_item_katalog_masalah = z.object({
  id_masalah: skema_id_masalah,
  judul: z.string().min(3),
  ringkasan_situasi: z.string().min(10),
  contoh_situasi: z.array(z.string().min(5)).min(2),
  id_pilar_utama: skema_id_pilar,
  kelas_hasil_default: skema_kelas_hasil,
  skrining_psikologis_relevan: z.boolean(),
  daftar_pertanyaan_cabang: z.array(skema_pertanyaan_cabang_domain).min(1),
  landasan_akademik_hukum: z.array(z.string().min(3)).min(1),
});

export const skema_respons_katalog_masalah = z.object({
  daftar_masalah: z.array(skema_item_katalog_masalah).length(10),
});

/**
 * Domain-Specific Interactive Issue Navigator Input (Restored per Phase 2.5 D-02).
 * Does not force universal urgency, supervisor trust, or documentation readiness fields;
 * domain-specific step answers are passed in `jawaban_cabang`.
 */
export const skema_input_navigator = z
  .object({
    id_masalah: skema_id_masalah,
    id_masalah_terdisambiguasi: skema_id_masalah_spesifik.optional(),
    id_subkategori: z.string().min(2).max(100),
    jawaban_cabang: z.record(z.string().min(1), z.string().min(1)),
    tujuan_langkah_berikutnya: z.enum([
      "understand_situation",
      "prepare_conversation",
      "explore_support_options",
      "request_professional_support",
    ]),
    meminta_dukungan_psikolog_konselor: z.boolean().default(false),
    melaporkan_hambatan_fungsi_harian: z.boolean().default(false),
  })
  .refine(
    (nilai) => nilai.id_masalah !== "unsure" || nilai.id_masalah_terdisambiguasi !== undefined,
    {
      message:
        "id_masalah_terdisambiguasi wajib diisi ketika pengguna memilih kategori awal 'unsure'.",
      path: ["id_masalah_terdisambiguasi"],
    },
  );

export const skema_peringatan_penjaga = z.object({
  kode: skema_kode_peringatan_penjaga,
  judul: z.string().min(3),
  pesan: z.string().min(10),
  lapisan_batas: skema_lapisan_batas_psikologis,
});

export const skema_langkah_perjalanan_dukungan = z.object({
  urutan_langkah: z.number().int().min(1).max(10),
  kode_langkah: z.string().min(2).max(80),
  judul_langkah: z.string().min(3),
  deskripsi_langkah: z.string().min(10),
  alasan_relevansi: z.string().min(10),
  id_tipe_dukungan: skema_id_tipe_dukungan,
  tautan_fitur_internal: z.string().min(1),
  status_langkah: skema_status_langkah.default("belum_dimulai"),
});

/**
 * Optional Psychological Well-Being Check Recommendation (Phase 2.5 P-01 to P-05).
 * Always optional (`wajib_diisi: false`), instrument-agnostic, and never gates workplace support.
 */
export const skema_rekomendasi_skrining_psikologis = z.object({
  direkomendasikan_secara_kondisional: z.boolean(),
  wajib_diisi: z.literal(false),
  status_instrumen: z.enum(["menunggu_instrumen_tim_psikologi", "instrumen_terkonfigurasi"]),
  penjelasan_batas_non_klinis: z.string().min(15),
  alasan_relevansi_kontekstual: z.string().min(10),
  kebijakan_penyimpanan: z.literal("in_session_only_never_persisted"),
});

/**
 * Non-Clinical Psychological Support Item (Phase 2.5 P-06).
 */
export const skema_item_dukungan_psikologis = z.object({
  kategori: skema_kategori_dukungan_psikologis,
  judul: z.string().min(3),
  panduan_praktis: z.string().min(10),
  batasan_etik: z.string().min(10),
});

/**
 * Professional Referral Recommendation (Phase 2.5 P-07 & P-08).
 * Triggered strictly by approved P-07 conditions, never auto-inferred solely from workplace problem type.
 */
export const skema_rekomendasi_rujukan_profesional = z.object({
  direkomendasikan: z.boolean(),
  alasan_pemicu: z.array(skema_alasan_rujukan_profesional),
  penjelasan_peran_konselor_psikolog: z.string().min(15),
  catatan_kerahasiaan: z.string().min(10),
  tautan_persiapan_konsultasi: z.string().min(1),
});

/**
 * Personalized Support Journey Output (Phase 2.5 Approved Sequence).
 * Keeps Workplace Context and Psychological Support Context cleanly separated.
 */
export const skema_perjalanan_dukungan = z.object({
  id_masalah_utama: skema_id_masalah_spesifik,
  id_subkategori: z.string().min(2),
  judul_perjalanan: z.string().min(5),
  kelas_hasil_utama: skema_kelas_hasil,
  kelas_hasil_sekunder: z.array(skema_kelas_hasil),
  apakah_atasan_dilewati: z.boolean(),
  ringkasan_konteks_kerja: z.string().min(15),
  jalur_dukungan_utama: skema_id_tipe_dukungan,
  jalur_dukungan_sekunder: z.array(skema_id_tipe_dukungan).min(1),
  rekomendasi_skrining_psikologis: skema_rekomendasi_skrining_psikologis,
  dukungan_psikologis_non_klinis: z.array(skema_item_dukungan_psikologis).min(1),
  rekomendasi_rujukan_profesional: skema_rekomendasi_rujukan_profesional,
  daftar_langkah_rekomendasi: z.array(skema_langkah_perjalanan_dukungan).min(2),
  daftar_peringatan_penjaga: z.array(skema_peringatan_penjaga).min(2),
  landasan_akademik_hukum: z.array(z.string().min(3)).min(1),
});

/**
 * Instrument-Agnostic Psychological Assessment Placeholder / Configuration Boundary (P-01, P-04, P-05).
 * Does not invent items, Likert scales, or severity bands; strictly session-local.
 */
export const skema_batas_konfigurasi_skrining = z.object({
  status_ketersediaan: z.enum(["menunggu_persetujuan_tim_psikologi", "instrumen_disetujui_aktif"]),
  id_instrumen: z.string().nullable(),
  nama_instrumen: z.string().nullable(),
  konstruk_psikologis: z.string().nullable(),
  peringatan_bukan_diagnosis: z.string().min(15),
  penyimpanan_diizinkan: z.literal("session_local_only"),
  dapat_dilewati_kapan_saja: z.literal(true),
});

export type OpsiPertanyaanCabang = z.infer<typeof skema_opsi_pertanyaan_cabang>;
export type PertanyaanCabangDomain = z.infer<typeof skema_pertanyaan_cabang_domain>;
export type ItemKatalogMasalah = z.infer<typeof skema_item_katalog_masalah>;
export type ResponsKatalogMasalah = z.infer<typeof skema_respons_katalog_masalah>;
export type InputNavigator = z.infer<typeof skema_input_navigator>;
export type PeringatanPenjaga = z.infer<typeof skema_peringatan_penjaga>;
export type LangkahPerjalananDukungan = z.infer<typeof skema_langkah_perjalanan_dukungan>;
export type RekomendasiSkriningPsikologis = z.infer<typeof skema_rekomendasi_skrining_psikologis>;
export type ItemDukunganPsikologis = z.infer<typeof skema_item_dukungan_psikologis>;
export type RekomendasiRujukanProfesional = z.infer<typeof skema_rekomendasi_rujukan_profesional>;
export type PerjalananDukungan = z.infer<typeof skema_perjalanan_dukungan>;
export type BatasKonfigurasiSkrining = z.infer<typeof skema_batas_konfigurasi_skrining>;
