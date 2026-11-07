import type { NextFunction, Request, Response } from "express";
import type { InputNavigator } from "@voxera/contracts";
import { LayananNavigator } from "./navigator.service.js";

export class KontrolerNavigator {
  private readonly layanan: LayananNavigator;

  constructor(layanan: LayananNavigator = new LayananNavigator()) {
    this.layanan = layanan;
  }

  katalog = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const hasil = this.layanan.dapatkan_katalog_masalah();
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  evaluasi = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const input = req.body as InputNavigator;
      const hasil = this.layanan.evaluasi_perjalanan(input);
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };

  batas_skrining = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const hasil = this.layanan.dapatkan_batas_skrining_psikologis();
      res.status(200).json(hasil);
    } catch (galat) {
      next(galat);
    }
  };
}
