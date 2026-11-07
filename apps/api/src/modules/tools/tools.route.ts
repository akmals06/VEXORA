import { Router } from "express";
import { KontrolerAlatBantu } from "./tools.controller.js";
import { LayananAlatBantu } from "./tools.service.js";
import {
  validasi_filter_direktori,
  validasi_persiapan_percakapan,
  validasi_refleksi_makna_kerja,
} from "./tools.validation.js";

export function buat_rute_alat_bantu(layanan: LayananAlatBantu = new LayananAlatBantu()): Router {
  const kontroler = new KontrolerAlatBantu(layanan);
  const router = Router();

  router.post("/conversation-prep", validasi_persiapan_percakapan, kontroler.persiapan_percakapan);
  router.get("/scenarios", kontroler.daftar_skenario);
  router.post("/meaning-reflection", validasi_refleksi_makna_kerja, kontroler.refleksi_makna_kerja);
  router.get("/support-directory", validasi_filter_direktori, kontroler.direktori_dukungan);

  return router;
}

export const rute_alat_bantu = buat_rute_alat_bantu();
