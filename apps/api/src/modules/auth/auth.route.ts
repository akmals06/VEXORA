import { type RequestHandler, Router } from "express";
import { konfigurasi_env } from "../../config/env.js";
import { buat_middleware_autentikasi } from "../../middlewares/auth.middleware.js";
import { verifikasi_origin_csrf } from "../../middlewares/csrf.middleware.js";
import { pembatas_laju_autentikasi_default } from "../../middlewares/rate-limit.middleware.js";
import { KontrolerAutentikasi } from "./auth.controller.js";
import { LayananAutentikasi } from "./auth.service.js";
import { validasi_daftar_akun, validasi_masuk_akun } from "./auth.validation.js";

export interface OpsiRuteAutentikasi {
  layanan?: LayananAutentikasi;
  pembatas_laju?: RequestHandler;
  verifikasi_csrf?: RequestHandler;
  lingkungan?: string;
}

export function buat_rute_autentikasi(opsi: OpsiRuteAutentikasi = {}): Router {
  const layanan = opsi.layanan ?? new LayananAutentikasi();
  const lingkungan = opsi.lingkungan ?? konfigurasi_env.NODE_ENV;
  const pembatas_laju = opsi.pembatas_laju ?? pembatas_laju_autentikasi_default.middleware;
  const csrf = opsi.verifikasi_csrf ?? verifikasi_origin_csrf;
  const wajib_masuk = buat_middleware_autentikasi(layanan, lingkungan);
  const kontroler = new KontrolerAutentikasi(layanan, lingkungan);

  const router = Router();

  router.post("/register", csrf, pembatas_laju, validasi_daftar_akun, kontroler.daftar);
  router.post("/login", csrf, pembatas_laju, validasi_masuk_akun, kontroler.masuk);
  router.get("/session", wajib_masuk, kontroler.sesi);
  router.post("/logout", csrf, wajib_masuk, kontroler.keluar);
  router.delete("/account", csrf, wajib_masuk, kontroler.hapus_akun);

  return router;
}

export const rute_autentikasi = buat_rute_autentikasi();
