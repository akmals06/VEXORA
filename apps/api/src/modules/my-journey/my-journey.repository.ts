import { randomUUID } from "node:crypto";
import type { FollowUpStepStatus, JourneyStatus, SimpanPerjalanan } from "@voxera/contracts";
import { dapatkan_klien_database, type PrismaClient } from "@voxera/database";
import { petakan_galat_database_prisma } from "../../utils/http-error.js";

export interface RekamanLangkahTindakLanjut {
  id_langkah: string;
  id_perjalanan: string;
  urutan_langkah: number;
  kode_langkah: string;
  id_tipe_dukungan: string;
  status_langkah: string;
  diperbarui_pada: Date;
}

export interface RekamanPerjalananTersimpan {
  id_perjalanan: string;
  id_pengguna: string;
  id_masalah_utama: string;
  id_subkategori: string;
  kelas_hasil_utama: string;
  jalur_dukungan_utama: string;
  status_perjalanan: string;
  daftar_langkah: RekamanLangkahTindakLanjut[];
  dibuat_pada: Date;
  diperbarui_pada: Date;
}

export interface AntarmukaRepositoriPerjalananSaya {
  ambil_daftar_perjalanan_pengguna(id_pengguna: string): Promise<RekamanPerjalananTersimpan[]>;
  simpan_perjalanan_baru(
    id_pengguna: string,
    input: SimpanPerjalanan,
  ): Promise<RekamanPerjalananTersimpan>;
  perbarui_status_perjalanan(
    id_pengguna: string,
    id_perjalanan: string,
    status_perjalanan: JourneyStatus,
  ): Promise<RekamanPerjalananTersimpan | null>;
  perbarui_status_langkah(
    id_pengguna: string,
    id_perjalanan: string,
    id_langkah: string,
    status_langkah: FollowUpStepStatus,
  ): Promise<RekamanLangkahTindakLanjut | null>;
  hapus_perjalanan(id_pengguna: string, id_perjalanan: string): Promise<boolean>;
  hapus_semua_perjalanan_pengguna(id_pengguna: string): void;
}

function petakan_galat_database_perjalanan(galat: unknown): never {
  petakan_galat_database_prisma(galat, {
    pesan_tidak_tersedia: "Layanan penyimpanan perjalanan sedang tidak tersedia.",
  });
}

/**
 * Implementasi repositori My Journey berbasis Prisma ORM (@voxera/database).
 * Setiap kueri wajib menyertakan id_pengguna untuk mencegah akses lintas pengguna (IDOR).
 */
export class RepositoriPerjalananSayaPrisma implements AntarmukaRepositoriPerjalananSaya {
  private readonly penyedia_klien: () => PrismaClient;

  constructor(penyedia_klien: () => PrismaClient = () => dapatkan_klien_database()) {
    this.penyedia_klien = penyedia_klien;
  }

  async ambil_daftar_perjalanan_pengguna(
    id_pengguna: string,
  ): Promise<RekamanPerjalananTersimpan[]> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.perjalananTersimpan.findMany({
        where: { id_pengguna },
        orderBy: { dibuat_pada: "desc" },
        include: {
          daftar_langkah: {
            orderBy: { urutan_langkah: "asc" },
          },
        },
      });
    } catch (galat) {
      petakan_galat_database_perjalanan(galat);
    }
  }

  async simpan_perjalanan_baru(
    id_pengguna: string,
    input: SimpanPerjalanan,
  ): Promise<RekamanPerjalananTersimpan> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.perjalananTersimpan.create({
        data: {
          id_pengguna,
          id_masalah_utama: input.id_masalah_utama,
          id_subkategori: input.id_subkategori,
          kelas_hasil_utama: input.kelas_hasil_utama,
          jalur_dukungan_utama: input.jalur_dukungan_utama,
          status_perjalanan: "aktif",
          daftar_langkah: {
            create: input.daftar_langkah.map((langkah) => ({
              urutan_langkah: langkah.urutan_langkah,
              kode_langkah: langkah.kode_langkah,
              id_tipe_dukungan: langkah.id_tipe_dukungan,
              status_langkah: langkah.status_langkah,
            })),
          },
        },
        include: {
          daftar_langkah: {
            orderBy: { urutan_langkah: "asc" },
          },
        },
      });
    } catch (galat) {
      petakan_galat_database_perjalanan(galat);
    }
  }

  async perbarui_status_perjalanan(
    id_pengguna: string,
    id_perjalanan: string,
    status_perjalanan: JourneyStatus,
  ): Promise<RekamanPerjalananTersimpan | null> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.$transaction(async (tx) => {
        const perjalanan_milik_pengguna = await tx.perjalananTersimpan.findFirst({
          where: {
            id_perjalanan,
            id_pengguna,
          },
        });

        if (!perjalanan_milik_pengguna) {
          return null;
        }

        return await tx.perjalananTersimpan.update({
          where: { id_perjalanan: perjalanan_milik_pengguna.id_perjalanan },
          data: { status_perjalanan },
          include: {
            daftar_langkah: {
              orderBy: { urutan_langkah: "asc" },
            },
          },
        });
      });
    } catch (galat) {
      petakan_galat_database_perjalanan(galat);
    }
  }

  async perbarui_status_langkah(
    id_pengguna: string,
    id_perjalanan: string,
    id_langkah: string,
    status_langkah: FollowUpStepStatus,
  ): Promise<RekamanLangkahTindakLanjut | null> {
    try {
      const prisma = this.penyedia_klien();
      return await prisma.$transaction(async (tx) => {
        const langkah_milik_pengguna = await tx.langkahTindakLanjut.findFirst({
          where: {
            id_langkah,
            id_perjalanan,
            perjalanan: {
              id_pengguna,
            },
          },
        });

        if (!langkah_milik_pengguna) {
          return null;
        }

        return await tx.langkahTindakLanjut.update({
          where: { id_langkah: langkah_milik_pengguna.id_langkah },
          data: { status_langkah },
        });
      });
    } catch (galat) {
      petakan_galat_database_perjalanan(galat);
    }
  }

  async hapus_perjalanan(id_pengguna: string, id_perjalanan: string): Promise<boolean> {
    try {
      const prisma = this.penyedia_klien();
      const hasil = await prisma.perjalananTersimpan.deleteMany({
        where: {
          id_perjalanan,
          id_pengguna,
        },
      });
      return hasil.count > 0;
    } catch (galat) {
      petakan_galat_database_perjalanan(galat);
    }
  }

  hapus_semua_perjalanan_pengguna(_id_pengguna: string): void {
    // Pada PostgreSQL, penghapusan Pengguna secara otomatis memicu ON DELETE CASCADE.
  }
}

/**
 * Implementasi repositori My Journey berbasis memori untuk pengujian deterministik.
 * Menegakkan isolasi kepemilikan id_pengguna yang identik dengan implementasi Prisma.
 */
export class RepositoriPerjalananSayaMemori implements AntarmukaRepositoriPerjalananSaya {
  private readonly peta_perjalanan = new Map<string, RekamanPerjalananTersimpan>();

  async ambil_daftar_perjalanan_pengguna(
    id_pengguna: string,
  ): Promise<RekamanPerjalananTersimpan[]> {
    const daftar: RekamanPerjalananTersimpan[] = [];
    for (const rekaman of this.peta_perjalanan.values()) {
      if (rekaman.id_pengguna === id_pengguna) {
        daftar.push({
          ...rekaman,
          daftar_langkah: rekaman.daftar_langkah
            .map((langkah) => ({ ...langkah }))
            .sort((a, b) => a.urutan_langkah - b.urutan_langkah),
        });
      }
    }
    return daftar.sort((a, b) => b.dibuat_pada.getTime() - a.dibuat_pada.getTime());
  }

  async simpan_perjalanan_baru(
    id_pengguna: string,
    input: SimpanPerjalanan,
  ): Promise<RekamanPerjalananTersimpan> {
    const sekarang = new Date();
    const id_perjalanan = randomUUID();
    const daftar_langkah: RekamanLangkahTindakLanjut[] = input.daftar_langkah
      .map((langkah) => ({
        id_langkah: randomUUID(),
        id_perjalanan,
        urutan_langkah: langkah.urutan_langkah,
        kode_langkah: langkah.kode_langkah,
        id_tipe_dukungan: langkah.id_tipe_dukungan,
        status_langkah: langkah.status_langkah,
        diperbarui_pada: sekarang,
      }))
      .sort((a, b) => a.urutan_langkah - b.urutan_langkah);

    const rekaman: RekamanPerjalananTersimpan = {
      id_perjalanan,
      id_pengguna,
      id_masalah_utama: input.id_masalah_utama,
      id_subkategori: input.id_subkategori,
      kelas_hasil_utama: input.kelas_hasil_utama,
      jalur_dukungan_utama: input.jalur_dukungan_utama,
      status_perjalanan: "aktif",
      daftar_langkah,
      dibuat_pada: sekarang,
      diperbarui_pada: sekarang,
    };

    this.peta_perjalanan.set(id_perjalanan, rekaman);
    return {
      ...rekaman,
      daftar_langkah: rekaman.daftar_langkah.map((l) => ({ ...l })),
    };
  }

  async perbarui_status_perjalanan(
    id_pengguna: string,
    id_perjalanan: string,
    status_perjalanan: JourneyStatus,
  ): Promise<RekamanPerjalananTersimpan | null> {
    const rekaman = this.peta_perjalanan.get(id_perjalanan);
    if (!rekaman || rekaman.id_pengguna !== id_pengguna) {
      return null;
    }

    rekaman.status_perjalanan = status_perjalanan;
    rekaman.diperbarui_pada = new Date();

    return {
      ...rekaman,
      daftar_langkah: rekaman.daftar_langkah.map((l) => ({ ...l })),
    };
  }

  async perbarui_status_langkah(
    id_pengguna: string,
    id_perjalanan: string,
    id_langkah: string,
    status_langkah: FollowUpStepStatus,
  ): Promise<RekamanLangkahTindakLanjut | null> {
    const rekaman = this.peta_perjalanan.get(id_perjalanan);
    if (!rekaman || rekaman.id_pengguna !== id_pengguna) {
      return null;
    }

    const langkah = rekaman.daftar_langkah.find((item) => item.id_langkah === id_langkah);
    if (!langkah) {
      return null;
    }

    const sekarang = new Date();
    langkah.status_langkah = status_langkah;
    langkah.diperbarui_pada = sekarang;
    rekaman.diperbarui_pada = sekarang;

    return { ...langkah };
  }

  async hapus_perjalanan(id_pengguna: string, id_perjalanan: string): Promise<boolean> {
    const rekaman = this.peta_perjalanan.get(id_perjalanan);
    if (!rekaman || rekaman.id_pengguna !== id_pengguna) {
      return false;
    }
    return this.peta_perjalanan.delete(id_perjalanan);
  }

  hapus_semua_perjalanan_pengguna(id_pengguna: string): void {
    for (const [id_perjalanan, rekaman] of this.peta_perjalanan.entries()) {
      if (rekaman.id_pengguna === id_pengguna) {
        this.peta_perjalanan.delete(id_perjalanan);
      }
    }
  }
}
