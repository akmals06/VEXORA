import {
  skema_filter_direktori_dukungan,
  skema_input_persiapan_percakapan,
  skema_input_refleksi_makna_kerja,
} from "@voxera/contracts";
import { validasi_request } from "../../middlewares/validate.middleware.js";

export const validasi_persiapan_percakapan = validasi_request({
  body: skema_input_persiapan_percakapan,
});

export const validasi_refleksi_makna_kerja = validasi_request({
  body: skema_input_refleksi_makna_kerja,
});

export const validasi_filter_direktori = validasi_request({
  query: skema_filter_direktori_dukungan,
});
