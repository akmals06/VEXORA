import type { NextFunction, Request, Response } from "express";
import type { DaftarAkun, MasukAkun } from "@voxera/contracts";
import { skema_respons_autentikasi } from "@voxera/contracts";
import { konfigurasi_env } from "../../config/env.js";
import { ambil_konteks_autentikasi } from "../../middlewares/auth.middleware.js";
import {
  baca_token_dari_header_cookie,
  hapus_cookie_sesi,
  pasang_cookie_sesi,
  pasang_header_tanpa_cache,
} from "../../utils/cookie.js";
import type { LayananAutentikasi } from "./auth.service.js";

export class KontrolerAutentikasi {
  private readonly layanan: LayananAutentikasi;
  private readonly lingkungan: string;

  constructor(layanan: LayananAutentikasi, lingkungan: string = konfigurasi_env.NODE_ENV) {
    this.layanan = layanan;
    this.lingkungan = lingkungan;
  }

  daftar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as DaftarAkun;
      const token_sebelumnya = baca_token_dari_header_cookie(req.headers.cookie, this.lingkungan);
      const hasil = await this.layanan.daftar_akun(body, token_sebelumnya);
      pasang_cookie_sesi(res, hasil.token_sesi_mentah, this.lingkungan);
      res.status(201).json(hasil.respons_publik);
    } catch (galat) {
      next(galat);
    }
  };

  masuk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as MasukAkun;
      const token_sebelumnya = baca_token_dari_header_cookie(req.headers.cookie, this.lingkungan);
      const hasil = await this.layanan.masuk_akun(body, token_sebelumnya);
      pasang_cookie_sesi(res, hasil.token_sesi_mentah, this.lingkungan);
      res.status(200).json(hasil.respons_publik);
    } catch (galat) {
      next(galat);
    }
  };

  sesi = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      pasang_header_tanpa_cache(res);
      res.status(200).json(
        skema_respons_autentikasi.parse({
          kedaluwarsa_pada: konteks.kedaluwarsa_pada,
          pengguna: konteks.pengguna,
        }),
      );
    } catch (galat) {
      next(galat);
    }
  };

  keluar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const hasil = await this.layanan.keluar_akun(konteks.hash_token);
      hapus_cookie_sesi(res, this.lingkungan);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  hapus_akun = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const hasil = await this.layanan.hapus_akun(konteks.pengguna.id_pengguna);
      hapus_cookie_sesi(res, this.lingkungan);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };
}
