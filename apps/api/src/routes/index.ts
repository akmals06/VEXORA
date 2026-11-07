import { type RequestHandler, Router } from "express";
import type { KonfigurasiEnvApi } from "../config/env.js";
import { buat_verifikasi_origin_csrf } from "../middlewares/csrf.middleware.js";
import { buat_rute_autentikasi } from "../modules/auth/auth.route.js";
import type { LayananAutentikasi } from "../modules/auth/auth.service.js";
import { buat_rute_perjalanan_saya } from "../modules/my-journey/my-journey.route.js";
import type { LayananPerjalananSaya } from "../modules/my-journey/my-journey.service.js";
import { buat_rute_navigator } from "../modules/navigator/navigator.route.js";
import type { LayananNavigator } from "../modules/navigator/navigator.service.js";
import { buat_rute_alat_bantu } from "../modules/tools/tools.route.js";
import type { LayananAlatBantu } from "../modules/tools/tools.service.js";
import { rute_kesehatan } from "./health.route.js";

export interface OpsiRuteV1 {
  konfigurasi?: KonfigurasiEnvApi;
  layanan_autentikasi?: LayananAutentikasi;
  layanan_navigator?: LayananNavigator;
  layanan_alat_bantu?: LayananAlatBantu;
  layanan_perjalanan?: LayananPerjalananSaya;
  pembatas_laju_autentikasi?: RequestHandler;
}

export function buat_rute_v1(opsi: OpsiRuteV1 = {}): Router {
  const router = Router();
  const verifikasi_csrf = opsi.konfigurasi
    ? buat_verifikasi_origin_csrf({ konfigurasi: opsi.konfigurasi })
    : undefined;
  const lingkungan = opsi.konfigurasi?.NODE_ENV;

  router.use("/health", rute_kesehatan);
  router.use(
    "/auth",
    buat_rute_autentikasi({
      layanan: opsi.layanan_autentikasi,
      pembatas_laju: opsi.pembatas_laju_autentikasi,
      verifikasi_csrf,
      lingkungan,
    }),
  );
  router.use("/navigator", buat_rute_navigator(opsi.layanan_navigator));
  router.use("/tools", buat_rute_alat_bantu(opsi.layanan_alat_bantu));
  router.use(
    "/my-journey",
    buat_rute_perjalanan_saya({
      layanan_perjalanan: opsi.layanan_perjalanan,
      layanan_autentikasi: opsi.layanan_autentikasi,
      verifikasi_csrf,
      lingkungan,
    }),
  );

  return router;
}

export const rute_v1: Router = buat_rute_v1();
