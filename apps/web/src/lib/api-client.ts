import {
  type BatasKonfigurasiSkrining,
  type DaftarAkun,
  type DrafPercakapan,
  type FilterDirektoriDukungan,
  type HasilRefleksiMaknaKerja,
  type InputNavigator,
  type InputPersiapanPercakapan,
  type InputRefleksiMaknaKerja,
  type LangkahTindakLanjut,
  type MasukAkun,
  type PerbaruiStatusLangkah,
  type PerbaruiStatusPerjalanan,
  type PerjalananDukungan,
  type PerjalananTersimpan,
  type ResponsAutentikasi,
  type ResponsDaftarSkenario,
  type ResponsDirektoriDukungan,
  type ResponsKatalogMasalah,
  type ResponsOperasi,
  type RingkasanPerjalananSaya,
  type SimpanPerjalanan,
  skema_batas_konfigurasi_skrining,
  skema_draf_percakapan,
  skema_hasil_refleksi_makna_kerja,
  skema_langkah_tindak_lanjut,
  skema_perjalanan_dukungan,
  skema_perjalanan_tersimpan,
  skema_respons_autentikasi,
  skema_respons_daftar_skenario,
  skema_respons_direktori_dukungan,
  skema_respons_katalog_masalah,
  skema_respons_operasi,
  skema_ringkasan_perjalanan_saya,
} from "@voxera/contracts";
import type { z } from "zod";
import { dapatkan_url_dasar_api_v1 } from "./env";

export class GalatApiKlien extends Error {
  readonly status: number;
  readonly kode: string;
  readonly pesan: string;
  readonly rincian?: unknown;
  readonly retry_after_detik?: number;

  constructor(
    status: number,
    kode: string,
    pesan: string,
    rincian?: unknown,
    retry_after_detik?: number,
  ) {
    super(pesan);
    this.name = "GalatApiKlien";
    this.status = status;
    this.kode = kode;
    this.pesan = pesan;
    this.rincian = rincian;
    this.retry_after_detik = retry_after_detik;
  }
}

interface AmplopGalatServer {
  kode?: string;
  pesan?: string;
  rincian?: unknown;
}

async function panggil_endpoint_api<T>(
  jalur: string,
  skema_respons: z.ZodType<T>,
  opsi: RequestInit = {},
): Promise<T> {
  const url_dasar = dapatkan_url_dasar_api_v1();
  const jalur_bersih = jalur.startsWith("/") ? jalur : `/${jalur}`;
  const url_lengkap = `${url_dasar}${jalur_bersih}`;

  const header_gabungan = new Headers(opsi.headers);
  header_gabungan.set("Accept", "application/json");
  if (opsi.body !== undefined && !header_gabungan.has("Content-Type")) {
    header_gabungan.set("Content-Type", "application/json");
  }

  let respons: Response;
  try {
    respons = await fetch(url_lengkap, {
      ...opsi,
      headers: header_gabungan,
      credentials: "include",
    });
  } catch {
    throw new GalatApiKlien(
      0,
      "JARINGAN_TIDAK_TERJANGKAU",
      "Tidak dapat terhubung ke layanan VEXORA API. Pastikan server API berjalan dan koneksi Anda stabil.",
    );
  }

  let muatan_json: unknown = null;
  try {
    muatan_json = await respons.json();
  } catch {
    if (!respons.ok) {
      throw new GalatApiKlien(
        respons.status,
        "RESPONS_TIDAK_VALID",
        `Permintaan gagal dengan status HTTP ${respons.status}.`,
      );
    }
  }

  if (!respons.ok) {
    const info_galat = (muatan_json ?? {}) as AmplopGalatServer;
    const header_retry =
      typeof respons.headers?.get === "function" ? respons.headers.get("Retry-After") : null;
    const nilai_retry = header_retry ? Number.parseInt(header_retry, 10) : NaN;
    const retry_after_detik =
      Number.isFinite(nilai_retry) && nilai_retry > 0 ? nilai_retry : undefined;
    throw new GalatApiKlien(
      respons.status,
      typeof info_galat.kode === "string" ? info_galat.kode : "GALAT_HTTP",
      typeof info_galat.pesan === "string"
        ? info_galat.pesan
        : `Permintaan gagal dengan status HTTP ${respons.status}.`,
      info_galat.rincian,
      retry_after_detik,
    );
  }

  const hasil_validasi = skema_respons.safeParse(muatan_json);
  if (!hasil_validasi.success) {
    throw new GalatApiKlien(
      500,
      "KONTRAK_RESPONS_TIDAK_SESUAI",
      "Format data dari server tidak sesuai dengan kontrak VEXORA.",
      hasil_validasi.error.flatten(),
    );
  }

  return hasil_validasi.data;
}

export const klien_api_voxera = {
  navigator: {
    ambil_katalog(): Promise<ResponsKatalogMasalah> {
      return panggil_endpoint_api("/navigator/catalog", skema_respons_katalog_masalah, {
        method: "GET",
      });
    },
    evaluasi_perjalanan(input: InputNavigator): Promise<PerjalananDukungan> {
      return panggil_endpoint_api("/navigator/evaluate", skema_perjalanan_dukungan, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    ambil_batas_skrining(): Promise<BatasKonfigurasiSkrining> {
      return panggil_endpoint_api(
        "/navigator/screening-boundary",
        skema_batas_konfigurasi_skrining,
        {
          method: "GET",
        },
      );
    },
  },

  alat_bantu: {
    susun_draf_percakapan(input: InputPersiapanPercakapan): Promise<DrafPercakapan> {
      return panggil_endpoint_api("/tools/conversation-prep", skema_draf_percakapan, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    ambil_daftar_skenario(): Promise<ResponsDaftarSkenario> {
      return panggil_endpoint_api("/tools/scenarios", skema_respons_daftar_skenario, {
        method: "GET",
      });
    },
    evaluasi_refleksi_makna(input: InputRefleksiMaknaKerja): Promise<HasilRefleksiMaknaKerja> {
      return panggil_endpoint_api("/tools/meaning-reflection", skema_hasil_refleksi_makna_kerja, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    ambil_direktori_dukungan(filter?: FilterDirektoriDukungan): Promise<ResponsDirektoriDukungan> {
      const parameter = new URLSearchParams();
      if (filter?.id_tipe_dukungan) {
        parameter.set("id_tipe_dukungan", filter.id_tipe_dukungan);
      }
      if (filter?.kategori_layanan) {
        parameter.set("kategori_layanan", filter.kategori_layanan);
      }
      const kuery = parameter.toString();
      const jalur = kuery ? `/tools/support-directory?${kuery}` : "/tools/support-directory";
      return panggil_endpoint_api(jalur, skema_respons_direktori_dukungan, {
        method: "GET",
      });
    },
  },

  autentikasi: {
    daftar(input: DaftarAkun): Promise<ResponsAutentikasi> {
      return panggil_endpoint_api("/auth/register", skema_respons_autentikasi, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    masuk(input: MasukAkun): Promise<ResponsAutentikasi> {
      return panggil_endpoint_api("/auth/login", skema_respons_autentikasi, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    cek_sesi(): Promise<ResponsAutentikasi> {
      return panggil_endpoint_api("/auth/session", skema_respons_autentikasi, {
        method: "GET",
      });
    },
    keluar(): Promise<ResponsOperasi> {
      return panggil_endpoint_api("/auth/logout", skema_respons_operasi, {
        method: "POST",
      });
    },
    hapus_akun(): Promise<ResponsOperasi> {
      return panggil_endpoint_api("/auth/account", skema_respons_operasi, {
        method: "DELETE",
      });
    },
  },

  perjalanan_saya: {
    ambil_ringkasan(): Promise<RingkasanPerjalananSaya> {
      return panggil_endpoint_api("/my-journey", skema_ringkasan_perjalanan_saya, {
        method: "GET",
      });
    },
    simpan_perjalanan(input: SimpanPerjalanan): Promise<PerjalananTersimpan> {
      return panggil_endpoint_api("/my-journey/journeys", skema_perjalanan_tersimpan, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    perbarui_status_perjalanan(
      id_perjalanan: string,
      input: PerbaruiStatusPerjalanan,
    ): Promise<PerjalananTersimpan> {
      return panggil_endpoint_api(
        `/my-journey/journeys/${encodeURIComponent(id_perjalanan)}/status`,
        skema_perjalanan_tersimpan,
        {
          method: "PATCH",
          body: JSON.stringify(input),
        },
      );
    },
    perbarui_status_langkah(
      id_perjalanan: string,
      id_langkah: string,
      input: PerbaruiStatusLangkah,
    ): Promise<LangkahTindakLanjut> {
      return panggil_endpoint_api(
        `/my-journey/journeys/${encodeURIComponent(id_perjalanan)}/steps/${encodeURIComponent(id_langkah)}`,
        skema_langkah_tindak_lanjut,
        {
          method: "PATCH",
          body: JSON.stringify(input),
        },
      );
    },
    hapus_perjalanan(id_perjalanan: string): Promise<ResponsOperasi> {
      return panggil_endpoint_api(
        `/my-journey/journeys/${encodeURIComponent(id_perjalanan)}`,
        skema_respons_operasi,
        {
          method: "DELETE",
        },
      );
    },
  },
};
