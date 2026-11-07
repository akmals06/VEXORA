import { skema_kuery_kesehatan, skema_respons_kesehatan } from "@voxera/contracts";
import { Router, type Request, type Response } from "express";
import { konfigurasi_env } from "../config/env.js";
import { validasi_request } from "../middlewares/validate.middleware.js";

export const rute_kesehatan: Router = Router();

rute_kesehatan.get(
  "/",
  validasi_request({ query: skema_kuery_kesehatan }),
  (_req: Request, res: Response): void => {
    const payload_mentah = {
      status: "ok" as const,
      layanan: "voxera-api" as const,
      fase: "phase-0" as const,
      lingkungan: konfigurasi_env.NODE_ENV,
      waktu_server: new Date().toISOString(),
    };

    const payload_tervalidasi = skema_respons_kesehatan.parse(payload_mentah);
    res.status(200).json(payload_tervalidasi);
  },
);
