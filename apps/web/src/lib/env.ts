import { z } from "zod";

const skema_env_publik = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().default("http://localhost:4000/api/v1"),
});

export const env_publik = skema_env_publik.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/**
 * Menormalisasi URL dasar API agar selalu berakhiran `/api/v1` tanpa garis miring ganda,
 * baik ketika NEXT_PUBLIC_API_BASE_URL disetel ke `http://localhost:4000` maupun
 * `http://localhost:4000/api/v1`.
 */
export function dapatkan_url_dasar_api_v1(
  url_mentah = env_publik.NEXT_PUBLIC_API_BASE_URL,
): string {
  const bersih = url_mentah.trim().replace(/\/+$/, "");
  if (bersih.endsWith("/api/v1")) {
    return bersih;
  }
  return `${bersih}/api/v1`;
}
