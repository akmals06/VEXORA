import type { NextFunction, Request, RequestHandler, Response } from "express";
import { konfigurasi_env } from "../config/env.js";
import {
  type KonteksSesiTerautentikasi,
  LayananAutentikasi,
} from "../modules/auth/auth.service.js";
import {
  baca_token_dari_header_cookie,
  hapus_cookie_sesi,
  pasang_header_tanpa_cache,
} from "../utils/cookie.js";
import { GalatHttp } from "../utils/http-error.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      konteks_autentikasi?: KonteksSesiTerautentikasi;
    }
  }
}

export function buat_middleware_autentikasi(
  layanan_autentikasi: LayananAutentikasi = new LayananAutentikasi(),
  lingkungan: string = konfigurasi_env.NODE_ENV,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    pasang_header_tanpa_cache(res);

    const token_mentah = baca_token_dari_header_cookie(req.headers.cookie, lingkungan);
    if (!token_mentah) {
      next(new GalatHttp(401, "AUTENTIKASI_GAGAL", "Sesi tidak valid atau telah berakhir."));
      return;
    }

    try {
      const konteks = await layanan_autentikasi.resolusi_sesi_aktif(token_mentah);
      req.konteks_autentikasi = konteks;
      next();
    } catch (galat) {
      if (galat instanceof GalatHttp && galat.kode_status === 401) {
        hapus_cookie_sesi(res, lingkungan);
      }
      next(galat);
    }
  };
}

export function ambil_konteks_autentikasi(req: Request): KonteksSesiTerautentikasi {
  if (!req.konteks_autentikasi) {
    throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Sesi tidak valid atau telah berakhir.");
  }
  return req.konteks_autentikasi;
}

export const wajib_autentikasi: RequestHandler = buat_middleware_autentikasi();
