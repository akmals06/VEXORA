import "dotenv/config";
import { z } from "zod";

const skema_env_api = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CORS_ORIGIN: z
    .string()
    .min(1)
    .refine((asal) => {
      const daftar = asal.split(",").map((item) => item.trim());
      return (
        daftar.length > 0 &&
        daftar.every((item) => item.length > 0 && item !== "*" && item !== "null")
      );
    }, "CORS_ORIGIN tidak boleh kosong, menggunakan wildcard (*), atau bernilai 'null'.")
    .default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type KonfigurasiEnvApi = z.infer<typeof skema_env_api>;

export function muat_konfigurasi_env(
  sumber: Record<string, string | undefined> = process.env,
): KonfigurasiEnvApi {
  return skema_env_api.parse(sumber);
}

export const konfigurasi_env = muat_konfigurasi_env();

export function dapatkan_daftar_origin_diizinkan(
  konfigurasi: KonfigurasiEnvApi = konfigurasi_env,
): string[] {
  return konfigurasi.CORS_ORIGIN.split(",")
    .map((asal) => asal.trim())
    .filter((asal) => asal.length > 0);
}
