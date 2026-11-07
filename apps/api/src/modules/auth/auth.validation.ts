import { skema_daftar_akun, skema_masuk_akun } from "@voxera/contracts";
import { validasi_request } from "../../middlewares/validate.middleware.js";

export const validasi_daftar_akun = validasi_request({
  body: skema_daftar_akun,
});

export const validasi_masuk_akun = validasi_request({
  body: skema_masuk_akun,
});
