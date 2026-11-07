import type { NextFunction, Request, Response } from "express";
import { konfigurasi_env } from "../config/env.js";
import { pencatat_log } from "../lib/logger.js";
import { GalatHttp } from "../utils/http-error.js";

export function penangan_galat_terpusat(
  galat: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (galat instanceof GalatHttp) {
    res.status(galat.kode_status).json({
      status: "error",
      kode: galat.kode_galat,
      pesan: galat.message,
    });
    return;
  }

  pencatat_log.error("Terjadi kesalahan internal yang tidak tertangani", {
    metode: req.method,
    jalur: req.originalUrl,
    tipe_galat: galat instanceof Error ? galat.name : "UnknownError",
  });

  const pesan_aman =
    konfigurasi_env.NODE_ENV === "production"
      ? "Terjadi kesalahan pada server."
      : galat instanceof Error
        ? galat.message
        : "Terjadi kesalahan internal.";

  res.status(500).json({
    status: "error",
    kode: "KESALAHAN_INTERNAL_SERVER",
    pesan: pesan_aman,
  });
}
