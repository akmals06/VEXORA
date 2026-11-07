import { z } from "zod";
import {
  skema_id_masalah_spesifik,
  skema_id_tipe_dukungan,
  skema_kelas_hasil,
  skema_status_langkah,
  skema_status_perjalanan,
} from "./taxonomy.schema.js";

/**
 * 1. Minimal Optional Continuity Account Contracts (Phase 2.5 Option B).
 * Used strictly for optional non-sensitive journey progress continuity.
 */
export const skema_daftar_akun = z.object({
  email: z.email(),
  nama_alias: z.string().min(2).max(80),
  kata_sandi: z.string().min(8).max(128),
});

export const skema_masuk_akun = z.object({
  email: z.email(),
  kata_sandi: z.string().min(8).max(128),
});

export const skema_profil_pengguna = z.object({
  id_pengguna: z.uuid(),
  email: z.email(),
  nama_alias: z.string(),
  dibuat_pada: z.iso.datetime(),
});

/**
 * Response payload for register, login, and active session status check (`GET /api/v1/auth/session`).
 * Never exposes the raw session token in JSON; the opaque session token is transported
 * exclusively via an HttpOnly cookie (`__Host-voxera_session` in production, `voxera_session` on localhost HTTP).
 */
export const skema_respons_autentikasi = z.object({
  kedaluwarsa_pada: z.iso.datetime(),
  pengguna: skema_profil_pengguna,
});

export const skema_respons_operasi = z.object({
  berhasil: z.literal(true),
  pesan: z.string().min(3),
});

/**
 * 2. Non-Sensitive Structured Support Journey & Follow-Up Step Continuity Contracts (Option B).
 * Strictly excludes free-text psychological notes, conversation drafts, and incident narratives.
 */
export const skema_input_langkah_tersimpan = z.object({
  urutan_langkah: z.number().int().min(1).max(10),
  kode_langkah: z.string().min(2).max(80),
  id_tipe_dukungan: skema_id_tipe_dukungan,
  status_langkah: skema_status_langkah.default("belum_dimulai"),
});

export const skema_simpan_perjalanan = z.object({
  id_masalah_utama: skema_id_masalah_spesifik,
  id_subkategori: z.string().min(2).max(100),
  kelas_hasil_utama: skema_kelas_hasil,
  jalur_dukungan_utama: skema_id_tipe_dukungan,
  daftar_langkah: z.array(skema_input_langkah_tersimpan).min(1).max(10),
});

export const skema_langkah_tindak_lanjut = z.object({
  id_langkah: z.uuid(),
  id_perjalanan: z.uuid(),
  urutan_langkah: z.number().int().min(1),
  kode_langkah: z.string(),
  id_tipe_dukungan: skema_id_tipe_dukungan,
  status_langkah: skema_status_langkah,
  diperbarui_pada: z.iso.datetime(),
});

export const skema_perbarui_status_langkah = z.object({
  status_langkah: skema_status_langkah,
});

export const skema_perbarui_status_perjalanan = z.object({
  status_perjalanan: skema_status_perjalanan,
});

export const skema_perjalanan_tersimpan = z.object({
  id_perjalanan: z.uuid(),
  id_pengguna: z.uuid(),
  id_masalah_utama: skema_id_masalah_spesifik,
  id_subkategori: z.string(),
  kelas_hasil_utama: skema_kelas_hasil,
  jalur_dukungan_utama: skema_id_tipe_dukungan,
  status_perjalanan: skema_status_perjalanan,
  daftar_langkah: z.array(skema_langkah_tindak_lanjut),
  dibuat_pada: z.iso.datetime(),
  diperbarui_pada: z.iso.datetime(),
});

export const skema_ringkasan_perjalanan_saya = z.object({
  pengguna: skema_profil_pengguna,
  daftar_perjalanan: z.array(skema_perjalanan_tersimpan),
});

export type DaftarAkun = z.infer<typeof skema_daftar_akun>;
export type MasukAkun = z.infer<typeof skema_masuk_akun>;
export type ProfilPengguna = z.infer<typeof skema_profil_pengguna>;
export type ResponsAutentikasi = z.infer<typeof skema_respons_autentikasi>;
export type ResponsOperasi = z.infer<typeof skema_respons_operasi>;
export type InputLangkahTersimpan = z.infer<typeof skema_input_langkah_tersimpan>;
export type SimpanPerjalanan = z.infer<typeof skema_simpan_perjalanan>;
export type LangkahTindakLanjut = z.infer<typeof skema_langkah_tindak_lanjut>;
export type PerbaruiStatusLangkah = z.infer<typeof skema_perbarui_status_langkah>;
export type PerbaruiStatusPerjalanan = z.infer<typeof skema_perbarui_status_perjalanan>;
export type PerjalananTersimpan = z.infer<typeof skema_perjalanan_tersimpan>;
export type RingkasanPerjalananSaya = z.infer<typeof skema_ringkasan_perjalanan_saya>;
