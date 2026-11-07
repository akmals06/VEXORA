import { randomUUID } from "node:crypto";
import { dapatkan_klien_database, type PrismaClient } from "@voxera/database";
import { GalatHttp, petakan_galat_database_prisma } from "../../utils/http-error.js";

export interface RekamanPengguna {
  id_pengguna: string;
  email: string;
  nama_alias: string;
  hash_kata_sandi: string;
  dibuat_pada: Date;
  diperbarui_pada: Date;
}

export interface RekamanSesiPengguna {
  id_sesi: string;
  id_pengguna: string;
  hash_token: string;
  kedaluwarsa_pada: Date;
  dibuat_pada: Date;
}

export interface RekamanSesiBesertaPengguna {
  sesi: RekamanSesiPengguna;
  pengguna: RekamanPengguna;
}

export interface InputBuatPenggunaDanSesi {
  email: string;
  nama_alias: string;
  hash_kata_sandi: string;
  hash_token: string;
  kedaluwarsa_pada: Date;
}

export interface InputBuatSesi {
  id_pengguna: string;
  hash_token: string;
  kedaluwarsa_pada: Date;
}

export interface AntarmukaRepositoriAutentikasi {
  cari_pengguna_berdasarkan_email(email: string): Promise<RekamanPengguna | null>;
  buat_pengguna_dan_sesi(input: InputBuatPenggunaDanSesi): Promise<RekamanSesiBesertaPengguna>;
  buat_sesi(input: InputBuatSesi): Promise<RekamanSesiPengguna>;
  cari_sesi_beserta_pengguna(hash_token: string): Promise<RekamanSesiBesertaPengguna | null>;
  hapus_sesi_berdasarkan_hash(hash_token: string): Promise<void>;
  hapus_sesi_kedaluwarsa(id_pengguna: string, batas_waktu: Date): Promise<void>;
  hapus_akun_pengguna(id_pengguna: string): Promise<boolean>;
}

function petakan_galat_database(galat: unknown): never {
  petakan_galat_database_prisma(galat, {
    pesan_konflik: "Alamat email tersebut sudah terdaftar pada akun lain.",
    pesan_tidak_ditemukan: "Akun pengguna tidak ditemukan.",
    pesan_tidak_tersedia:
      "Layanan penyimpanan akun sedang tidak tersedia. Fitur eksplorasi utama tetap dapat digunakan tanpa akun.",
  });
}

/**
 * Implementasi repositori autentikasi berbasis Prisma ORM (@voxera/database).
 */
export class RepositoriAutentikasiPrisma implements AntarmukaRepositoriAutentikasi {
  private readonly penyedia_klien: () => PrismaClient;

  constructor(penyedia_klien: () => PrismaClient = () => dapatkan_klien_database()) {
    this.penyedia_klien = penyedia_klien;
  }

  async cari_pengguna_berdasarkan_email(email: string): Promise<RekamanPengguna | null> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.pengguna.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async buat_pengguna_dan_sesi(
    input: InputBuatPenggunaDanSesi,
  ): Promise<RekamanSesiBesertaPengguna> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.$transaction(async (tx) => {
        const pengguna = await tx.pengguna.create({
          data: {
            email: input.email.toLowerCase(),
            nama_alias: input.nama_alias,
            hash_kata_sandi: input.hash_kata_sandi,
          },
        });

        const sesi = await tx.sesiPengguna.create({
          data: {
            id_pengguna: pengguna.id_pengguna,
            hash_token: input.hash_token,
            kedaluwarsa_pada: input.kedaluwarsa_pada,
          },
        });

        return { sesi, pengguna };
      });
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async buat_sesi(input: InputBuatSesi): Promise<RekamanSesiPengguna> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.sesiPengguna.create({
        data: {
          id_pengguna: input.id_pengguna,
          hash_token: input.hash_token,
          kedaluwarsa_pada: input.kedaluwarsa_pada,
        },
      });
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async cari_sesi_beserta_pengguna(hash_token: string): Promise<RekamanSesiBesertaPengguna | null> {
    try {
      const prisma = this.penyedia_klien();
      const hasil = await prisma.sesiPengguna.findUnique({
        where: { hash_token },
        include: { pengguna: true },
      });

      if (!hasil) {
        return null;
      }

      return {
        sesi: {
          id_sesi: hasil.id_sesi,
          id_pengguna: hasil.id_pengguna,
          hash_token: hasil.hash_token,
          kedaluwarsa_pada: hasil.kedaluwarsa_pada,
          dibuat_pada: hasil.dibuat_pada,
        },
        pengguna: hasil.pengguna,
      };
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async hapus_sesi_berdasarkan_hash(hash_token: string): Promise<void> {
    try {
      const prisma = this.penyedia_klien();
      await prisma.sesiPengguna.deleteMany({
        where: { hash_token },
      });
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async hapus_sesi_kedaluwarsa(id_pengguna: string, batas_waktu: Date): Promise<void> {
    try {
      const prisma = this.penyedia_klien();
      await prisma.sesiPengguna.deleteMany({
        where: {
          id_pengguna,
          kedaluwarsa_pada: { lte: batas_waktu },
        },
      });
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }

  async hapus_akun_pengguna(id_pengguna: string): Promise<boolean> {
    try {
      const prisma = this.penyedia_klien();
      const hasil = await prisma.pengguna.deleteMany({
        where: { id_pengguna },
      });
      return hasil.count > 0;
    } catch (galat) {
      petakan_galat_database(galat);
    }
  }
}

/**
 * Implementasi repositori autentikasi berbasis memori untuk pengujian deterministik
 * tanpa ketergantungan jaringan eksternal. Mendukung callback cascade saat akun dihapus.
 */
export class RepositoriAutentikasiMemori implements AntarmukaRepositoriAutentikasi {
  private readonly peta_pengguna = new Map<string, RekamanPengguna>();
  private readonly peta_sesi = new Map<string, RekamanSesiPengguna>();
  private readonly pendengar_hapus_akun: Array<(id_pengguna: string) => void> = [];

  daftarkan_pendengar_hapus_akun(pendengar: (id_pengguna: string) => void): void {
    this.pendengar_hapus_akun.push(pendengar);
  }

  inspeksi_semua_sesi(): RekamanSesiPengguna[] {
    return Array.from(this.peta_sesi.values());
  }

  async cari_pengguna_berdasarkan_email(email: string): Promise<RekamanPengguna | null> {
    const target = email.toLowerCase();
    for (const pengguna of this.peta_pengguna.values()) {
      if (pengguna.email === target) {
        return { ...pengguna };
      }
    }
    return null;
  }

  async buat_pengguna_dan_sesi(
    input: InputBuatPenggunaDanSesi,
  ): Promise<RekamanSesiBesertaPengguna> {
    const email_normal = input.email.toLowerCase();
    const sudah_ada = await this.cari_pengguna_berdasarkan_email(email_normal);
    if (sudah_ada) {
      throw new GalatHttp(
        409,
        "KONFLIK_DATA",
        "Alamat email tersebut sudah terdaftar pada akun lain.",
      );
    }

    const sekarang = new Date();
    const pengguna: RekamanPengguna = {
      id_pengguna: randomUUID(),
      email: email_normal,
      nama_alias: input.nama_alias,
      hash_kata_sandi: input.hash_kata_sandi,
      dibuat_pada: sekarang,
      diperbarui_pada: sekarang,
    };

    const sesi: RekamanSesiPengguna = {
      id_sesi: randomUUID(),
      id_pengguna: pengguna.id_pengguna,
      hash_token: input.hash_token,
      kedaluwarsa_pada: input.kedaluwarsa_pada,
      dibuat_pada: sekarang,
    };

    this.peta_pengguna.set(pengguna.id_pengguna, pengguna);
    this.peta_sesi.set(sesi.hash_token, sesi);

    return {
      pengguna: { ...pengguna },
      sesi: { ...sesi },
    };
  }

  async buat_sesi(input: InputBuatSesi): Promise<RekamanSesiPengguna> {
    const sekarang = new Date();
    const sesi: RekamanSesiPengguna = {
      id_sesi: randomUUID(),
      id_pengguna: input.id_pengguna,
      hash_token: input.hash_token,
      kedaluwarsa_pada: input.kedaluwarsa_pada,
      dibuat_pada: sekarang,
    };
    this.peta_sesi.set(sesi.hash_token, sesi);
    return { ...sesi };
  }

  async cari_sesi_beserta_pengguna(hash_token: string): Promise<RekamanSesiBesertaPengguna | null> {
    const sesi = this.peta_sesi.get(hash_token);
    if (!sesi) {
      return null;
    }
    const pengguna = this.peta_pengguna.get(sesi.id_pengguna);
    if (!pengguna) {
      this.peta_sesi.delete(hash_token);
      return null;
    }
    return {
      sesi: { ...sesi },
      pengguna: { ...pengguna },
    };
  }

  async hapus_sesi_berdasarkan_hash(hash_token: string): Promise<void> {
    this.peta_sesi.delete(hash_token);
  }

  async hapus_sesi_kedaluwarsa(id_pengguna: string, batas_waktu: Date): Promise<void> {
    for (const [hash_token, sesi] of this.peta_sesi.entries()) {
      if (
        sesi.id_pengguna === id_pengguna &&
        sesi.kedaluwarsa_pada.getTime() <= batas_waktu.getTime()
      ) {
        this.peta_sesi.delete(hash_token);
      }
    }
  }

  async hapus_akun_pengguna(id_pengguna: string): Promise<boolean> {
    const ada = this.peta_pengguna.delete(id_pengguna);
    for (const [hash_token, sesi] of this.peta_sesi.entries()) {
      if (sesi.id_pengguna === id_pengguna) {
        this.peta_sesi.delete(hash_token);
      }
    }
    if (ada) {
      for (const pendengar of this.pendengar_hapus_akun) {
        pendengar(id_pengguna);
      }
    }
    return ada;
  }
}
