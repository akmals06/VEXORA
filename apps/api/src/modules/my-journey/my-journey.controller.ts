import type { NextFunction, Request, Response } from "express";
import type {
  PerbaruiStatusLangkah,
  PerbaruiStatusPerjalanan,
  SimpanPerjalanan,
} from "@voxera/contracts";
import { ambil_konteks_autentikasi } from "../../middlewares/auth.middleware.js";
import type { LayananPerjalananSaya } from "./my-journey.service.js";

export class KontrolerPerjalananSaya {
  private readonly layanan: LayananPerjalananSaya;

  constructor(layanan: LayananPerjalananSaya) {
    this.layanan = layanan;
  }

  ringkasan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const hasil = await this.layanan.dapatkan_ringkasan(konteks.pengguna);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  simpan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const body = req.body as SimpanPerjalanan;
      const hasil = await this.layanan.simpan_perjalanan(konteks.pengguna.id_pengguna, body);
      res.status(201).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  perbarui_status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const id_perjalanan = String(req.params.id_perjalanan ?? "");
      const body = req.body as PerbaruiStatusPerjalanan;
      const hasil = await this.layanan.perbarui_status_perjalanan(
        konteks.pengguna.id_pengguna,
        id_perjalanan,
        body,
      );
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  perbarui_langkah = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const id_perjalanan = String(req.params.id_perjalanan ?? "");
      const id_langkah = String(req.params.id_langkah ?? "");
      const body = req.body as PerbaruiStatusLangkah;
      const hasil = await this.layanan.perbarui_status_langkah(
        konteks.pengguna.id_pengguna,
        id_perjalanan,
        id_langkah,
        body,
      );
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  hapus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const konteks = ambil_konteks_autentikasi(req);
      const id_perjalanan = String(req.params.id_perjalanan ?? "");
      const hasil = await this.layanan.hapus_perjalanan(
        konteks.pengguna.id_pengguna,
        id_perjalanan,
      );
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };
}
