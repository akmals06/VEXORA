import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";
import { PrismaClient } from "./generated/prisma/client.js";

const skema_url_database = z
  .string()
  .min(1, "DATABASE_URL wajib diisi.")
  .refine(
    (nilai) => nilai.startsWith("postgresql://") || nilai.startsWith("postgres://"),
    "DATABASE_URL harus menggunakan protokol postgresql:// atau postgres://.",
  )
  .refine(
    (nilai) => !nilai.includes("YOUR_DB_USER") && !nilai.includes("YOUR_DB_PASSWORD"),
    "DATABASE_URL masih berisi nilai placeholder contoh.",
  );

export function validasi_url_database(url_mentah: string | undefined): string {
  return skema_url_database.parse(url_mentah);
}

const ruang_global_database = globalThis as unknown as {
  adapter_pg_voxera?: PrismaPg;
  klien_prisma_voxera?: PrismaClient;
};

/**
 * Mengembalikan instance singleton PrismaPg adapter dengan koneksi yang tervalidasi.
 * Mencegah pembuatan pool koneksi ganda saat hot-reload di lingkungan pengembangan.
 */
export function dapatkan_adapter_database(url_kustom?: string): PrismaPg {
  const url_tervalidasi = validasi_url_database(url_kustom ?? process.env.DATABASE_URL);

  if (!ruang_global_database.adapter_pg_voxera) {
    ruang_global_database.adapter_pg_voxera = new PrismaPg({
      connectionString: url_tervalidasi,
    });
  }

  return ruang_global_database.adapter_pg_voxera;
}

/**
 * Mengembalikan instance singleton PrismaClient yang terhubung melalui PrismaPg adapter.
 */
export function dapatkan_klien_database(url_kustom?: string): PrismaClient {
  if (!ruang_global_database.klien_prisma_voxera) {
    const adapter = dapatkan_adapter_database(url_kustom);
    ruang_global_database.klien_prisma_voxera = new PrismaClient({ adapter });
  }

  return ruang_global_database.klien_prisma_voxera;
}

export { PrismaClient };
