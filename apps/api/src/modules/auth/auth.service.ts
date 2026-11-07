import {
  type DaftarAkun,
  type MasukAkun,
  type ProfilPengguna,
  type ResponsAutentikasi,
  type ResponsOperasi,
  skema_respons_autentikasi,
  skema_respons_operasi,
} from "@voxera/contracts";
import { DURASI_SESI_MS } from "../../utils/cookie.js";
import {
  buat_token_sesi_mentah,
  hash_kata_sandi,
  hash_token_sesi,
  validasi_format_token_sesi,
  verifikasi_kata_sandi,
  verifikasi_kata_sandi_dummy,
} from "../../utils/crypto.js";
import { GalatHttp } from "../../utils/http-error.js";
import {
  type AntarmukaRepositoriAutentikasi,
  type RekamanPengguna,
  RepositoriAutentikasiPrisma,
} from "./auth.repository.js";

export interface KonteksSesiTerautentikasi {
  id_sesi: string;
  hash_token: string;
  kedaluwarsa_pada: string;
  pengguna: ProfilPengguna;
}

export interface HasilAutentikasiBesertaTokenCookie {
  token_sesi_mentah: string;
  respons_publik: ResponsAutentikasi;
}

function petakan_profil_pengguna(rekaman: RekamanPengguna): ProfilPengguna {
  return {
    id_pengguna: rekaman.id_pengguna,
    email: rekaman.email,
    nama_alias: rekaman.nama_alias,
    dibuat_pada: rekaman.dibuat_pada.toISOString(),
  };
}

export class LayananAutentikasi {
  private readonly repositori: AntarmukaRepositoriAutentikasi;

  constructor(repositori: AntarmukaRepositoriAutentikasi = new RepositoriAutentikasiPrisma()) {
    this.repositori = repositori;
  }

  /**
   * Mendaftarkan akun kontinuitas baru, melakukan rotasi/pencabutan sesi sebelumnya jika ada,
   * serta menerbitkan token sesi acak 256-bit yang hanya disimpan digest SHA-256-nya di DB.
   */
  async daftar_akun(
    input: DaftarAkun,
    token_sesi_sebelumnya?: string | null,
  ): Promise<HasilAutentikasiBesertaTokenCookie> {
    const email_normal = input.email.trim().toLowerCase();
    const sudah_terdaftar = await this.repositori.cari_pengguna_berdasarkan_email(email_normal);
    if (sudah_terdaftar) {
      throw new GalatHttp(
        409,
        "KONFLIK_DATA",
        "Alamat email tersebut sudah terdaftar pada akun lain.",
      );
    }

    if (token_sesi_sebelumnya && validasi_format_token_sesi(token_sesi_sebelumnya)) {
      await this.repositori.hapus_sesi_berdasarkan_hash(hash_token_sesi(token_sesi_sebelumnya));
    }

    const hash_sandi = await hash_kata_sandi(input.kata_sandi);
    const token_mentah = buat_token_sesi_mentah();
    const hash_token = hash_token_sesi(token_mentah);
    const kedaluwarsa_pada = new Date(Date.now() + DURASI_SESI_MS);

    const { pengguna, sesi } = await this.repositori.buat_pengguna_dan_sesi({
      email: email_normal,
      nama_alias: input.nama_alias.trim(),
      hash_kata_sandi: hash_sandi,
      hash_token,
      kedaluwarsa_pada,
    });

    const respons_publik = skema_respons_autentikasi.parse({
      kedaluwarsa_pada: sesi.kedaluwarsa_pada.toISOString(),
      pengguna: petakan_profil_pengguna(pengguna),
    });

    return {
      token_sesi_mentah: token_mentah,
      respons_publik,
    };
  }

  /**
   * Memverifikasi kredensial login secara anti-enumerasi (constant-time + dummy derivation),
   * mencabut sesi lama bila ada (rotasi sesi), dan menerbitkan sesi baru.
   */
  async masuk_akun(
    input: MasukAkun,
    token_sesi_sebelumnya?: string | null,
  ): Promise<HasilAutentikasiBesertaTokenCookie> {
    const email_normal = input.email.trim().toLowerCase();
    const pengguna = await this.repositori.cari_pengguna_berdasarkan_email(email_normal);

    if (!pengguna) {
      await verifikasi_kata_sandi_dummy(input.kata_sandi);
      throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Email atau kata sandi tidak valid.");
    }

    const kata_sandi_valid = await verifikasi_kata_sandi(
      input.kata_sandi,
      pengguna.hash_kata_sandi,
    );
    if (!kata_sandi_valid) {
      throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Email atau kata sandi tidak valid.");
    }

    if (token_sesi_sebelumnya && validasi_format_token_sesi(token_sesi_sebelumnya)) {
      await this.repositori.hapus_sesi_berdasarkan_hash(hash_token_sesi(token_sesi_sebelumnya));
    }

    const sekarang = new Date();
    await this.repositori.hapus_sesi_kedaluwarsa(pengguna.id_pengguna, sekarang);

    const token_mentah = buat_token_sesi_mentah();
    const hash_token = hash_token_sesi(token_mentah);
    const kedaluwarsa_pada = new Date(sekarang.getTime() + DURASI_SESI_MS);

    const sesi = await this.repositori.buat_sesi({
      id_pengguna: pengguna.id_pengguna,
      hash_token,
      kedaluwarsa_pada,
    });

    const respons_publik = skema_respons_autentikasi.parse({
      kedaluwarsa_pada: sesi.kedaluwarsa_pada.toISOString(),
      pengguna: petakan_profil_pengguna(pengguna),
    });

    return {
      token_sesi_mentah: token_mentah,
      respons_publik,
    };
  }

  /**
   * Memvalidasi token mentah dari cookie HttpOnly dan mengembalikan konteks sesi aktif.
   */
  async resolusi_sesi_aktif(
    token_mentah: string | null | undefined,
  ): Promise<KonteksSesiTerautentikasi> {
    if (!token_mentah || !validasi_format_token_sesi(token_mentah)) {
      throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Sesi tidak valid atau telah berakhir.");
    }

    const hash_token = hash_token_sesi(token_mentah);
    const rekaman = await this.repositori.cari_sesi_beserta_pengguna(hash_token);
    if (!rekaman) {
      throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Sesi tidak valid atau telah berakhir.");
    }

    if (rekaman.sesi.kedaluwarsa_pada.getTime() <= Date.now()) {
      await this.repositori.hapus_sesi_berdasarkan_hash(hash_token);
      throw new GalatHttp(401, "AUTENTIKASI_GAGAL", "Sesi tidak valid atau telah berakhir.");
    }

    return {
      id_sesi: rekaman.sesi.id_sesi,
      hash_token: rekaman.sesi.hash_token,
      kedaluwarsa_pada: rekaman.sesi.kedaluwarsa_pada.toISOString(),
      pengguna: petakan_profil_pengguna(rekaman.pengguna),
    };
  }

  /**
   * Mencabut sesi aktif di database berdasarkan hash token.
   */
  async keluar_akun(hash_token: string): Promise<ResponsOperasi> {
    await this.repositori.hapus_sesi_berdasarkan_hash(hash_token);
    return skema_respons_operasi.parse({
      berhasil: true,
      pesan: "Sesi berhasil diakhiri.",
    });
  }

  /**
   * Menghapus akun pengguna secara permanen beserta seluruh sesi dan perjalanan tersimpan (cascade).
   */
  async hapus_akun(id_pengguna: string): Promise<ResponsOperasi> {
    await this.repositori.hapus_akun_pengguna(id_pengguna);
    return skema_respons_operasi.parse({
      berhasil: true,
      pesan: "Akun beserta seluruh catatan perjalanan tersimpan telah dihapus secara permanen.",
    });
  }
}
