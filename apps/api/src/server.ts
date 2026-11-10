import type { Server } from "node:http";
import { buat_aplikasi } from "./app.js";
import { konfigurasi_env } from "./config/env.js";
import { pencatat_log } from "./lib/logger.js";

const aplikasi = buat_aplikasi();

const server_http: Server = aplikasi.listen(konfigurasi_env.PORT, () => {
  pencatat_log.info("Server VEXORA API berhasil dijalankan", {
    port: konfigurasi_env.PORT,
    lingkungan: konfigurasi_env.NODE_ENV,
    endpoint_kesehatan: `http://localhost:${konfigurasi_env.PORT}/api/v1/health`,
  });
});

function matikan_server_secara_aman(sinyal: string): void {
  pencatat_log.info("Menerima sinyal penghentian, menutup server HTTP...", { sinyal });
  server_http.close((galat) => {
    if (galat) {
      pencatat_log.error("Gagal menutup server HTTP secara bersih", {
        pesan_galat: galat.message,
      });
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => matikan_server_secara_aman("SIGINT"));
process.on("SIGTERM", () => matikan_server_secara_aman("SIGTERM"));
