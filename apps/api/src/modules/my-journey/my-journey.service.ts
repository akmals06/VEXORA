import {
  type LangkahTindakLanjut,
  type PerbaruiStatusLangkah,
  type PerbaruiStatusPerjalanan,
  type PerjalananTersimpan,
  type ProfilPengguna,
  type ResponsOperasi,
  type RingkasanPerjalananSaya,
  type SimpanPerjalanan,
  skema_langkah_tindak_lanjut,
  skema_perjalanan_tersimpan,
  skema_respons_operasi,
  skema_ringkasan_perjalanan_saya,
} from "@voxera/contracts";
import { GalatHttp } from "../../utils/http-error.js";
import {
  type AntarmukaRepositoriPerjalananSaya,
  type RekamanLangkahTindakLanjut,
  type RekamanPerjalananTersimpan,
  RepositoriPerjalananSayaPrisma,
} from "./my-journey.repository.js";

function petakan_langkah_dto(rekaman: RekamanLangkahTindakLanjut): LangkahTindakLanjut {
  return skema_langkah_tindak_lanjut.parse({
    id_langkah: rekaman.id_langkah,
    id_perjalanan: rekaman.id_perjalanan,
    urutan_langkah: rekaman.urutan_langkah,
    kode_langkah: rekaman.kode_langkah,
    id_tipe_dukungan: rekaman.id_tipe_dukungan,
    status_langkah: rekaman.status_langkah,
    diperbarui_pada: rekaman.diperbarui_pada.toISOString(),
  });
}

function petakan_perjalanan_dto(rekaman: RekamanPerjalananTersimpan): PerjalananTersimpan {
  return skema_perjalanan_tersimpan.parse({
    id_perjalanan: rekaman.id_perjalanan,
    id_pengguna: rekaman.id_pengguna,
    id_masalah_utama: rekaman.id_masalah_utama,
    id_subkategori: rekaman.id_subkategori,
    kelas_hasil_utama: rekaman.kelas_hasil_utama,
    jalur_dukungan_utama: rekaman.jalur_dukungan_utama,
    status_perjalanan: rekaman.status_perjalanan,
    daftar_langkah: rekaman.daftar_langkah.map(petakan_langkah_dto),
    dibuat_pada: rekaman.dibuat_pada.toISOString(),
    diperbarui_pada: rekaman.diperbarui_pada.toISOString(),
  });
}

export class LayananPerjalananSaya {
  private readonly repositori: AntarmukaRepositoriPerjalananSaya;

  constructor(
    repositori: AntarmukaRepositoriPerjalananSaya = new RepositoriPerjalananSayaPrisma(),
  ) {
    this.repositori = repositori;
  }

  async dapatkan_ringkasan(pengguna: ProfilPengguna): Promise<RingkasanPerjalananSaya> {
    const daftar_rekaman = await this.repositori.ambil_daftar_perjalanan_pengguna(
      pengguna.id_pengguna,
    );

    return skema_ringkasan_perjalanan_saya.parse({
      pengguna,
      daftar_perjalanan: daftar_rekaman.map(petakan_perjalanan_dto),
    });
  }

  async simpan_perjalanan(
    id_pengguna: string,
    input: SimpanPerjalanan,
  ): Promise<PerjalananTersimpan> {
    const rekaman = await this.repositori.simpan_perjalanan_baru(id_pengguna, input);
    return petakan_perjalanan_dto(rekaman);
  }

  async perbarui_status_perjalanan(
    id_pengguna: string,
    id_perjalanan: string,
    input: PerbaruiStatusPerjalanan,
  ): Promise<PerjalananTersimpan> {
    const hasil = await this.repositori.perbarui_status_perjalanan(
      id_pengguna,
      id_perjalanan,
      input.status_perjalanan,
    );

    if (!hasil) {
      throw new GalatHttp(
        404,
        "SUMBER_DAYA_TIDAK_DITEMUKAN",
        "Catatan perjalanan tidak ditemukan.",
      );
    }

    return petakan_perjalanan_dto(hasil);
  }

  async perbarui_status_langkah(
    id_pengguna: string,
    id_perjalanan: string,
    id_langkah: string,
    input: PerbaruiStatusLangkah,
  ): Promise<LangkahTindakLanjut> {
    const hasil = await this.repositori.perbarui_status_langkah(
      id_pengguna,
      id_perjalanan,
      id_langkah,
      input.status_langkah,
    );

    if (!hasil) {
      throw new GalatHttp(
        404,
        "SUMBER_DAYA_TIDAK_DITEMUKAN",
        "Langkah tindak lanjut tidak ditemukan.",
      );
    }

    return petakan_langkah_dto(hasil);
  }

  async hapus_perjalanan(id_pengguna: string, id_perjalanan: string): Promise<ResponsOperasi> {
    const terhapus = await this.repositori.hapus_perjalanan(id_pengguna, id_perjalanan);
    if (!terhapus) {
      throw new GalatHttp(
        404,
        "SUMBER_DAYA_TIDAK_DITEMUKAN",
        "Catatan perjalanan tidak ditemukan.",
      );
    }

    return skema_respons_operasi.parse({
      berhasil: true,
      pesan: "Catatan perjalanan tersimpan berhasil dihapus.",
    });
  }
}
