import { Router } from "express";
import { KontrolerNavigator } from "./navigator.controller.js";
import { LayananNavigator } from "./navigator.service.js";
import { validasi_evaluasi_navigator } from "./navigator.validation.js";

export function buat_rute_navigator(layanan: LayananNavigator = new LayananNavigator()): Router {
  const kontroler = new KontrolerNavigator(layanan);
  const router = Router();

  router.get("/catalog", kontroler.katalog);
  router.post("/evaluate", validasi_evaluasi_navigator, kontroler.evaluasi);
  router.get("/screening-boundary", kontroler.batas_skrining);

  return router;
}

export const rute_navigator = buat_rute_navigator();
