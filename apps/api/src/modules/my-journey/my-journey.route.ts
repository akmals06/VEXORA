import { type RequestHandler, Router } from "express";
import { konfigurasi_env } from "../../config/env.js";
import { buat_middleware_autentikasi } from "../../middlewares/auth.middleware.js";
import { verifikasi_origin_csrf } from "../../middlewares/csrf.middleware.js";
import { LayananAutentikasi } from "../auth/auth.service.js";
import { KontrolerPerjalananSaya } from "./my-journey.controller.js";
import { LayananPerjalananSaya } from "./my-journey.service.js";
import {
  validasi_hapus_perjalanan,
  validasi_perbarui_status_langkah,
  validasi_perbarui_status_perjalanan,
  validasi_simpan_perjalanan,
} from "./my-journey.validation.js";

export interface OpsiRutePerjalananSaya {
  layanan_perjalanan?: LayananPerjalananSaya;
  layanan_autentikasi?: LayananAutentikasi;
  verifikasi_csrf?: RequestHandler;
  lingkungan?: string;
}

export function buat_rute_perjalanan_saya(opsi: OpsiRutePerjalananSaya = {}): Router {
  const layanan_perjalanan = opsi.layanan_perjalanan ?? new LayananPerjalananSaya();
  const layanan_autentikasi = opsi.layanan_autentikasi ?? new LayananAutentikasi();
  const lingkungan = opsi.lingkungan ?? konfigurasi_env.NODE_ENV;
  const csrf = opsi.verifikasi_csrf ?? verifikasi_origin_csrf;
  const wajib_masuk = buat_middleware_autentikasi(layanan_autentikasi, lingkungan);
  const kontroler = new KontrolerPerjalananSaya(layanan_perjalanan);

  const router = Router();

  router.use(wajib_masuk);

  router.get("/", kontroler.ringkasan);
  router.post("/journeys", csrf, validasi_simpan_perjalanan, kontroler.simpan);
  router.patch(
    "/journeys/:id_perjalanan/status",
    csrf,
    validasi_perbarui_status_perjalanan,
    kontroler.perbarui_status,
  );
  router.patch(
    "/journeys/:id_perjalanan/steps/:id_langkah",
    csrf,
    validasi_perbarui_status_langkah,
    kontroler.perbarui_langkah,
  );
  router.delete("/journeys/:id_perjalanan", csrf, validasi_hapus_perjalanan, kontroler.hapus);

  return router;
}

export const rute_perjalanan_saya = buat_rute_perjalanan_saya();
