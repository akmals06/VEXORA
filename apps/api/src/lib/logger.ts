import { konfigurasi_env } from "../config/env.js";

type LevelLog = "debug" | "info" | "warn" | "error";

interface MetadataLog {
  [kunci: string]: string | number | boolean | undefined;
}

/**
 * Logger terstruktur yang tidak pernah mencatat isi body request atau kredensial sensitif.
 */
function tulis_log(level: LevelLog, pesan: string, metadata?: MetadataLog): void {
  if (konfigurasi_env.NODE_ENV === "test" && level !== "error") {
    return;
  }

  const catatan = {
    waktu: new Date().toISOString(),
    level,
    layanan: "voxera-api",
    pesan,
    ...(metadata ? { metadata } : {}),
  };

  const keluaran = JSON.stringify(catatan);
  if (level === "error") {
    console.error(keluaran);
    return;
  }
  console.log(keluaran);
}

export const pencatat_log = {
  info: (pesan: string, metadata?: MetadataLog) => tulis_log("info", pesan, metadata),
  warn: (pesan: string, metadata?: MetadataLog) => tulis_log("warn", pesan, metadata),
  error: (pesan: string, metadata?: MetadataLog) => tulis_log("error", pesan, metadata),
};
