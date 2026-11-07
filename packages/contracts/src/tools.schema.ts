import { z } from "zod";
import {
  skema_id_masalah_spesifik,
  skema_id_pilar,
  skema_id_tipe_dukungan,
  skema_tipe_penerima,
} from "./taxonomy.schema.js";

/**
 * 1. Unified 5-Prompt Conversation & Situation Preparation Contracts (Phase 2.5 D-03 & D-04).
 * Supports all 6 recipients (`manager`, `hr`, `psychologist`, `counselor`, `legal_professional`, `career_professional`).
 * Drafts remain strictly session-local (`session_local_only`) and are never persisted in PostgreSQL.
 */
export const skema_input_persiapan_percakapan = z.object({
  target_penerima: skema_tipe_penerima,
  id_masalah_terkait: skema_id_masalah_spesifik,
  apa_yang_terjadi_dan_waktu: z.string().min(10).max(1500),
  dampak_pada_pekerjaan_atau_kondisi: z.string().min(5).max(800),
  konteks_peran_tanpa_nama_wajib: z.string().max(500).default(""),
  dukungan_yang_dibutuhkan: z.string().min(5).max(600),
  hasil_yang_diharapkan: z.string().min(5).max(600),
});

export const skema_draf_percakapan = z.object({
  judul_draf: z.string().min(5),
  target_penerima: skema_tipe_penerima,
  id_masalah_terkait: skema_id_masalah_spesifik,
  pembuka_percakapan: z.string().min(10),
  ringkasan_situasi_dan_waktu: z.string().min(10),
  pernyataan_dampak: z.string().min(5),
  rincian_dukungan_dan_hasil: z.string().min(10),
  kalimat_penutup_konstruktif: z.string().min(10),
  panduan_khusus_penerima: z.array(z.string().min(5)).min(2),
  hal_yang_perlu_dihindari: z.array(z.string().min(5)).min(2),
  naskah_siap_salin: z.string().min(30),
  peringatan_privasi_penerima: z.string().min(10),
  kebijakan_penyimpanan: z.literal("session_local_only"),
});

/**
 * 2. Interactive Workplace Scenarios Contracts (Phase 2.5 Lean MVP F-06).
 * Explores psychological, organizational, and legal considerations without quiz scores or legal verdicts.
 */
export const skema_opsi_skenario = z.object({
  id_opsi: z.string().min(2),
  label_tindakan: z.string().min(5),
  pertimbangan_utama: z.string().min(10),
  implikasi_potensial: z.string().min(10),
  opsi_dukungan_relevan: z.array(skema_id_tipe_dukungan).min(1),
  pendekatan_alternatif: z.string().min(10),
});

export const skema_skenario_interaktif = z.object({
  id_skenario: z.string().min(3),
  judul: z.string().min(5),
  id_pilar: skema_id_pilar,
  id_masalah_terkait: skema_id_masalah_spesifik,
  narasi_situasi: z.string().min(20),
  pertanyaan_keputusan: z.string().min(10),
  daftar_opsi: z.array(skema_opsi_skenario).min(3),
  pelajaran_multidisiplin: z.string().min(15),
  tautan_perjalanan_dukungan: z.string().min(1),
});

export const skema_respons_daftar_skenario = z.object({
  daftar_skenario: z.array(skema_skenario_interaktif).min(3).max(5),
});

/**
 * 3. Course-Grounded Work Meaning & Digital Adaptation Reflection (Materi Kuliah Psikologi Kerja Pertemuan 1, 2 & 5).
 * Strictly non-scoring qualitative self-reflection (NOT a psychological screening instrument).
 */
export const daftar_orientasi_makna_kerja = [
  "job_orientation",
  "career_orientation",
  "calling_orientation",
  "exploring_transition",
] as const;

export const skema_orientasi_makna_kerja = z.enum(daftar_orientasi_makna_kerja);

export const daftar_dimensi_makna_kerja = [
  "positive_meaning_in_work",
  "meaning_making_through_work",
  "greater_good_motivations",
] as const;

export const skema_dimensi_makna_kerja = z.enum(daftar_dimensi_makna_kerja);

export const daftar_kebutuhan_sdt_kerja = [
  "autonomy_control",
  "competence_mastery",
  "relatedness_support",
] as const;

export const skema_kebutuhan_sdt_kerja = z.enum(daftar_kebutuhan_sdt_kerja);

export const skema_input_refleksi_makna_kerja = z.object({
  orientasi_saat_ini: skema_orientasi_makna_kerja,
  dimensi_makna_utama: skema_dimensi_makna_kerja,
  kebutuhan_sdt_prioritas: skema_kebutuhan_sdt_kerja,
  tantangan_kerja_digital: z.enum([
    "information_overload_distraction",
    "ai_workflow_adaptation",
    "skill_development_need",
    "role_clarity_in_digital_work",
  ]),
});

export const skema_hasil_refleksi_makna_kerja = z.object({
  ringkasan_refleksi_non_klinis: z.string().min(15),
  kaitan_konsep_psikologi_kerja: z.array(z.string().min(5)).min(2),
  langkah_pengembangan_konstruktif: z.array(z.string().min(10)).min(2),
  tautan_persiapan_percakapan: z.string().min(1),
  catatan_batas_non_asesmen: z.string().min(15),
});

/**
 * 4. Professional & Workplace Support Navigation Directory Contracts.
 */
export const skema_filter_direktori_dukungan = z.object({
  id_tipe_dukungan: skema_id_tipe_dukungan.optional(),
  kategori_layanan: z
    .enum(["psychological", "legal", "workplace_hr", "career", "immediate_safety"])
    .optional(),
});

export const skema_item_direktori_dukungan = z.object({
  kode_sumber_daya: z.string().min(3),
  nama_layanan: z.string().min(3),
  id_tipe_dukungan: skema_id_tipe_dukungan,
  kategori_layanan: z.enum([
    "psychological",
    "legal",
    "workplace_hr",
    "career",
    "immediate_safety",
  ]),
  deskripsi_peran: z.string().min(15),
  kapan_tepat_digunakan: z.array(z.string().min(5)).min(2),
  batas_kewenangan: z.array(z.string().min(5)).min(1),
  harapan_kerahasiaan: z.string().min(5),
  persiapan_sebelum_menghubungi: z.array(z.string().min(5)).min(2),
});

export const skema_respons_direktori_dukungan = z.object({
  daftar_layanan: z.array(skema_item_direktori_dukungan).min(1),
});

export type InputPersiapanPercakapan = z.infer<typeof skema_input_persiapan_percakapan>;
export type DrafPercakapan = z.infer<typeof skema_draf_percakapan>;
export type OpsiSkenario = z.infer<typeof skema_opsi_skenario>;
export type SkenarioInteraktif = z.infer<typeof skema_skenario_interaktif>;
export type ResponsDaftarSkenario = z.infer<typeof skema_respons_daftar_skenario>;
export type OrientasiMaknaKerja = z.infer<typeof skema_orientasi_makna_kerja>;
export type DimensiMaknaKerja = z.infer<typeof skema_dimensi_makna_kerja>;
export type KebutuhanSdtKerja = z.infer<typeof skema_kebutuhan_sdt_kerja>;
export type InputRefleksiMaknaKerja = z.infer<typeof skema_input_refleksi_makna_kerja>;
export type HasilRefleksiMaknaKerja = z.infer<typeof skema_hasil_refleksi_makna_kerja>;
export type FilterDirektoriDukungan = z.infer<typeof skema_filter_direktori_dukungan>;
export type ItemDirektoriDukungan = z.infer<typeof skema_item_direktori_dukungan>;
export type ResponsDirektoriDukungan = z.infer<typeof skema_respons_direktori_dukungan>;
