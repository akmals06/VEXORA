import type { Response } from "express";
import { konfigurasi_env } from "../config/env.js";

export const NAMA_COOKIE_SESI_PRODUKSI = "__Host-voxera_session";
export const NAMA_COOKIE_SESI_LOKAL = "voxera_session";
export const DURASI_SESI_DETIK = 7 * 24 * 60 * 60; // 7 hari (604800 detik)
export const DURASI_SESI_MS = DURASI_SESI_DETIK * 1000;

/**
 * Mengembalikan nama cookie sesi sesuai lingkungan:
 * - Production (HTTPS): __Host-voxera_session
 * - Development / Test (localhost HTTP): voxera_session
 */
export function dapatkan_nama_cookie_sesi(lingkungan: string = konfigurasi_env.NODE_ENV): string {
  return lingkungan === "production" ? NAMA_COOKIE_SESI_PRODUKSI : NAMA_COOKIE_SESI_LOKAL;
}

/**
 * Mengurai header Cookie mentah dan mengekstrak nilai cookie sesi untuk lingkungan aktif.
 */
export function baca_token_dari_header_cookie(
  header_cookie: string | undefined,
  lingkungan: string = konfigurasi_env.NODE_ENV,
): string | null {
  if (!header_cookie || header_cookie.trim().length === 0) {
    return null;
  }

  const nama_target = dapatkan_nama_cookie_sesi(lingkungan);
  const daftar_pasangan = header_cookie.split(";");

  for (const pasangan of daftar_pasangan) {
    const indeks_sama_dengan = pasangan.indexOf("=");
    if (indeks_sama_dengan <= 0) {
      continue;
    }
    const nama = pasangan.slice(0, indeks_sama_dengan).trim();
    const nilai = pasangan.slice(indeks_sama_dengan + 1).trim();
    if (nama === nama_target && nilai.length > 0) {
      try {
        return decodeURIComponent(nilai);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Memformat atribut Set-Cookie untuk sesi autentikasi (tanpa atribut Domain agar memenuhi syarat __Host-).
 */
export function buat_string_set_cookie_sesi(
  token_mentah: string,
  lingkungan: string = konfigurasi_env.NODE_ENV,
): string {
  const nama_cookie = dapatkan_nama_cookie_sesi(lingkungan);
  const bagian = [
    `${nama_cookie}=${encodeURIComponent(token_mentah)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${DURASI_SESI_DETIK}`,
  ];

  if (lingkungan === "production") {
    bagian.push("Secure");
  }

  return bagian.join("; ");
}

/**
 * Memformat atribut Set-Cookie untuk menghapus/mengakhiri cookie sesi pada peramban.
 */
export function buat_string_hapus_cookie_sesi(
  lingkungan: string = konfigurasi_env.NODE_ENV,
): string {
  const nama_cookie = dapatkan_nama_cookie_sesi(lingkungan);
  const bagian = [
    `${nama_cookie}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (lingkungan === "production") {
    bagian.push("Secure");
  }

  return bagian.join("; ");
}

export function pasang_header_tanpa_cache(res: Response): void {
  res.setHeader("Cache-Control", "no-store");
}

export function pasang_cookie_sesi(
  res: Response,
  token_mentah: string,
  lingkungan: string = konfigurasi_env.NODE_ENV,
): void {
  pasang_header_tanpa_cache(res);
  res.setHeader("Set-Cookie", buat_string_set_cookie_sesi(token_mentah, lingkungan));
}

export function hapus_cookie_sesi(
  res: Response,
  lingkungan: string = konfigurasi_env.NODE_ENV,
): void {
  pasang_header_tanpa_cache(res);
  res.setHeader("Set-Cookie", buat_string_hapus_cookie_sesi(lingkungan));
}
