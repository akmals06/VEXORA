export class GalatHttp extends Error {
  public readonly kode_status: number;
  public readonly kode_galat: string;

  constructor(kode_status: number, kode_galat: string, pesan: string) {
    super(pesan);
    this.name = "GalatHttp";
    this.kode_status = kode_status;
    this.kode_galat = kode_galat;
  }
}

export interface OpsiPemetaanGalatDatabase {
  pesan_konflik?: string;
  pesan_tidak_ditemukan?: string;
  pesan_tidak_tersedia: string;
}

/**
 * Memetakan galat operasional Prisma/PostgreSQL ke GalatHttp standar tanpa membocorkan detail skema internal.
 */
export function petakan_galat_database_prisma(
  galat: unknown,
  opsi: OpsiPemetaanGalatDatabase,
): never {
  if (galat instanceof GalatHttp) {
    throw galat;
  }

  if (galat && typeof galat === "object" && "code" in galat) {
    const kode_prisma = (galat as { code?: string }).code;
    if (kode_prisma === "P2002" && opsi.pesan_konflik) {
      throw new GalatHttp(409, "KONFLIK_DATA", opsi.pesan_konflik);
    }
    if (kode_prisma === "P2025" && opsi.pesan_tidak_ditemukan) {
      throw new GalatHttp(404, "SUMBER_DAYA_TIDAK_DITEMUKAN", opsi.pesan_tidak_ditemukan);
    }
  }

  throw new GalatHttp(503, "LAYANAN_DATABASE_TIDAK_TERSEDIA", opsi.pesan_tidak_tersedia);
}
