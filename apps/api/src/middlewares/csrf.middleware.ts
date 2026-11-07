import type { NextFunction, Request, Response } from "express";
import {
  dapatkan_daftar_origin_diizinkan,
  type KonfigurasiEnvApi,
  konfigurasi_env,
} from "../config/env.js";
import { GalatHttp } from "../utils/http-error.js";

const METODE_PERUBAHAN_STATUS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function ekstrak_origin_dari_referer(header_referer: string | undefined): string | null {
  if (!header_referer || header_referer.trim().length === 0) {
    return null;
  }
  try {
    const url_terurai = new URL(header_referer);
    if (url_terurai.protocol !== "http:" && url_terurai.protocol !== "https:") {
      return null;
    }
    return url_terurai.origin;
  } catch {
    return null;
  }
}

export interface OpsiVerifikasiCsrf {
  konfigurasi?: KonfigurasiEnvApi;
  wajib_json_bila_ada_body?: boolean;
}

/**
 * Middleware perlindungan CSRF berlapis untuk seluruh permintaan yang mengubah state
 * (POST, PUT, PATCH, DELETE) pada jalur yang mengandalkan cookie HttpOnly:
 * 1. Memvalidasi header Origin secara ketat terhadap daftar origin yang diizinkan (CORS_ORIGIN).
 * 2. Menggunakan fallback Referer yang aman apabila peramban tidak menyertakan header Origin.
 * 3. Menolak Origin bernilai "null", kosong, atau tidak cocok dengan status 403 AKSES_DITOLAK.
 * 4. Memastikan Content-Type adalah application/json apabila request mengirimkan body.
 */
export function buat_verifikasi_origin_csrf(opsi: OpsiVerifikasiCsrf = {}) {
  const konfigurasi = opsi.konfigurasi ?? konfigurasi_env;
  const wajib_json = opsi.wajib_json_bila_ada_body ?? true;

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!METODE_PERUBAHAN_STATUS.has(req.method.toUpperCase())) {
      next();
      return;
    }

    const daftar_origin_valid = new Set(dapatkan_daftar_origin_diizinkan(konfigurasi));
    const header_origin = req.headers.origin;
    const header_referer =
      typeof req.headers.referer === "string" ? req.headers.referer : undefined;

    let origin_efektif: string | null = null;
    if (typeof header_origin === "string" && header_origin.trim().length > 0) {
      origin_efektif = header_origin.trim();
    } else {
      origin_efektif = ekstrak_origin_dari_referer(header_referer);
    }

    if (
      !origin_efektif ||
      origin_efektif.toLowerCase() === "null" ||
      !daftar_origin_valid.has(origin_efektif)
    ) {
      next(
        new GalatHttp(
          403,
          "AKSES_DITOLAK",
          "Permintaan ditolak karena asal permintaan (Origin) tidak valid atau tidak diizinkan.",
        ),
      );
      return;
    }

    if (wajib_json) {
      const panjang_konten = Number(req.headers["content-length"] ?? "0");
      const memiliki_isi_body =
        panjang_konten > 0 ||
        (req.body !== undefined &&
          req.body !== null &&
          typeof req.body === "object" &&
          Object.keys(req.body as Record<string, unknown>).length > 0);

      if (memiliki_isi_body) {
        const tipe_konten = (req.headers["content-type"] ?? "").toLowerCase();
        if (!tipe_konten.startsWith("application/json")) {
          next(
            new GalatHttp(
              403,
              "AKSES_DITOLAK",
              "Permintaan perubahan status wajib menggunakan Content-Type application/json.",
            ),
          );
          return;
        }
      }
    }

    next();
  };
}

export const verifikasi_origin_csrf = buat_verifikasi_origin_csrf();
