import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import {
  dapatkan_daftar_origin_diizinkan,
  type KonfigurasiEnvApi,
  konfigurasi_env,
} from "./config/env.js";
import { penangan_galat_terpusat } from "./middlewares/error.middleware.js";
import { penangan_rute_tidak_ditemukan } from "./middlewares/not-found.middleware.js";
import { buat_rute_v1, type OpsiRuteV1 } from "./routes/index.js";

export interface OpsiAplikasi extends OpsiRuteV1 {
  konfigurasi?: KonfigurasiEnvApi;
}

export function buat_aplikasi(opsi: OpsiAplikasi = {}): Express {
  const aplikasi = express();
  const konfigurasi_aktif = opsi.konfigurasi ?? konfigurasi_env;

  aplikasi.disable("x-powered-by");
  aplikasi.use(helmet());

  const set_origin_diizinkan = new Set(dapatkan_daftar_origin_diizinkan(konfigurasi_aktif));

  aplikasi.use(
    cors({
      origin: (asal_permintaan, callback) => {
        if (!asal_permintaan) {
          callback(null, false);
          return;
        }
        if (set_origin_diizinkan.has(asal_permintaan)) {
          callback(null, asal_permintaan);
          return;
        }
        callback(null, false);
      },
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Accept"],
      credentials: true,
    }),
  );

  aplikasi.use(express.json({ limit: "16kb" }));
  aplikasi.use(express.urlencoded({ extended: false, limit: "16kb" }));

  aplikasi.use(
    "/api/v1",
    buat_rute_v1({
      ...opsi,
      konfigurasi: konfigurasi_aktif,
    }),
  );

  aplikasi.use(penangan_rute_tidak_ditemukan);
  aplikasi.use(penangan_galat_terpusat);

  return aplikasi;
}
