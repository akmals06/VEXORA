import {
  skema_perbarui_status_langkah,
  skema_perbarui_status_perjalanan,
  skema_simpan_perjalanan,
} from "@voxera/contracts";
import { z } from "zod";
import { validasi_request } from "../../middlewares/validate.middleware.js";

export const skema_param_id_perjalanan = z.object({
  id_perjalanan: z.uuid(),
});

export const skema_param_id_perjalanan_dan_langkah = z.object({
  id_perjalanan: z.uuid(),
  id_langkah: z.uuid(),
});

export const validasi_simpan_perjalanan = validasi_request({
  body: skema_simpan_perjalanan,
});

export const validasi_perbarui_status_perjalanan = validasi_request({
  params: skema_param_id_perjalanan,
  body: skema_perbarui_status_perjalanan,
});

export const validasi_perbarui_status_langkah = validasi_request({
  params: skema_param_id_perjalanan_dan_langkah,
  body: skema_perbarui_status_langkah,
});

export const validasi_hapus_perjalanan = validasi_request({
  params: skema_param_id_perjalanan,
});
