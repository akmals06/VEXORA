import type { NextFunction, Request, Response } from "express";
import type {
  FilterDirektoriDukungan,
  InputPersiapanPercakapan,
  InputRefleksiMaknaKerja,
} from "@voxera/contracts";
import { pasang_header_tanpa_cache } from "../../utils/cookie.js";
import { LayananAlatBantu } from "./tools.service.js";

export class KontrolerAlatBantu {
  private readonly layanan: LayananAlatBantu;

  constructor(layanan: LayananAlatBantu = new LayananAlatBantu()) {
    this.layanan = layanan;
  }

  persiapan_percakapan = (req: Request, res: Response, next: NextFunction): void => {
    try {
      pasang_header_tanpa_cache(res);
      const input = req.body as InputPersiapanPercakapan;
      const hasil = this.layanan.buat_draf_percakapan(input);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  daftar_skenario = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const hasil = this.layanan.dapatkan_daftar_skenario();
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  refleksi_makna_kerja = (req: Request, res: Response, next: NextFunction): void => {
    try {
      pasang_header_tanpa_cache(res);
      const input = req.body as InputRefleksiMaknaKerja;
      const hasil = this.layanan.evaluasi_refleksi_makna_kerja(input);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  direktori_dukungan = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const filter = req.query as FilterDirektoriDukungan;
      const hasil = this.layanan.dapatkan_direktori_dukungan(filter);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };
}
