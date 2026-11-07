import type { NextFunction, Request, RequestHandler, Response } from "express";
import { GalatHttp } from "../utils/http-error.js";

export interface OpsiPembatasLaju {
  batas_maksimum?: number;
  jendela_ms?: number;
}

export interface PembatasLajuTerarah {
  middleware: RequestHandler;
  atur_ulang: () => void;
}

/**
 * Pembatas laju (sliding-window rate limiter) in-memory yang ditargetkan khusus
 * untuk endpoint autentikasi (/register dan /login) tanpa memblokir rute navigasi publik.
 */
export function buat_pembatas_laju_autentikasi(opsi: OpsiPembatasLaju = {}): PembatasLajuTerarah {
  const batas_maksimum = opsi.batas_maksimum ?? 10;
  const jendela_ms = opsi.jendela_ms ?? 15 * 60 * 1000; // 15 menit
  const catatan_permintaan = new Map<string, number[]>();

  const middleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const sekarang = Date.now();
    const kunci_ip = req.ip ?? req.socket.remoteAddress ?? "ip_lokal";
    const kunci_klien = `${kunci_ip}:${req.path}`;

    const daftar_waktu_lama = catatan_permintaan.get(kunci_klien) ?? [];
    const daftar_waktu_aktif = daftar_waktu_lama.filter((waktu) => sekarang - waktu < jendela_ms);

    if (daftar_waktu_aktif.length >= batas_maksimum) {
      const waktu_tertua = daftar_waktu_aktif[0] ?? sekarang;
      const sisa_detik = Math.max(1, Math.ceil((jendela_ms - (sekarang - waktu_tertua)) / 1000));
      res.setHeader("Retry-After", String(sisa_detik));
      next(
        new GalatHttp(
          429,
          "BATAS_PERMINTAAN_TERLAMPAUI",
          "Terlalu banyak percobaan autentikasi. Silakan coba kembali beberapa saat lagi.",
        ),
      );
      return;
    }

    daftar_waktu_aktif.push(sekarang);
    catatan_permintaan.set(kunci_klien, daftar_waktu_aktif);
    next();
  };

  return {
    middleware,
    atur_ulang: () => {
      catatan_permintaan.clear();
    },
  };
}

export const pembatas_laju_autentikasi_default = buat_pembatas_laju_autentikasi();
