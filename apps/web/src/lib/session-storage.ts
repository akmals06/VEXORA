import {
  type DrafPercakapan,
  type FollowUpStepStatus,
  type HasilRefleksiMaknaKerja,
  type InputNavigator,
  type InputRefleksiMaknaKerja,
  type IssueId,
  type PerjalananDukungan,
  type RecipientType,
  type SpecificIssueId,
  skema_draf_percakapan,
  skema_hasil_refleksi_makna_kerja,
  skema_id_masalah,
  skema_id_masalah_spesifik,
  skema_input_refleksi_makna_kerja,
  skema_perjalanan_dukungan,
  skema_status_langkah,
  skema_tipe_penerima,
} from "@voxera/contracts";
import { z } from "zod";

export const KUNCI_SESI_LOKAL = "voxera_session_v1" as const;
export const NAMA_EVENT_SESI_LOKAL = "voxera:perubahan-sesi-lokal" as const;

export const skema_progres_navigator_lokal = z.object({
  id_masalah: skema_id_masalah.nullable().default(null),
  id_masalah_terdisambiguasi: skema_id_masalah_spesifik.optional(),
  indeks_langkah: z.number().int().min(0).max(4).default(0),
  jawaban_cabang: z.record(z.string(), z.string()).default({}),
  tujuan_langkah_berikutnya: z
    .enum([
      "understand_situation",
      "prepare_conversation",
      "explore_support_options",
      "request_professional_support",
    ])
    .default("understand_situation"),
  meminta_dukungan_psikolog_konselor: z.boolean().default(false),
  melaporkan_hambatan_fungsi_harian: z.boolean().default(false),
});

export const skema_draf_persiapan_lokal = z.object({
  target_penerima: skema_tipe_penerima.default("manager"),
  id_masalah_terkait: skema_id_masalah_spesifik.default("workload_pressure"),
  apa_yang_terjadi_dan_waktu: z.string().default(""),
  dampak_pada_pekerjaan_atau_kondisi: z.string().default(""),
  konteks_peran_tanpa_nama_wajib: z.string().default(""),
  dukungan_yang_dibutuhkan: z.string().default(""),
  hasil_yang_diharapkan: z.string().default(""),
  hasil_draf: skema_draf_percakapan.nullable().default(null),
});

export const skema_refleksi_makna_lokal = z.object({
  input: skema_input_refleksi_makna_kerja.default({
    orientasi_saat_ini: "career_orientation",
    dimensi_makna_utama: "positive_meaning_in_work",
    kebutuhan_sdt_prioritas: "competence_mastery",
    tantangan_kerja_digital: "role_clarity_in_digital_work",
  }),
  hasil: skema_hasil_refleksi_makna_kerja.nullable().default(null),
});

export const skema_state_sesi_lokal = z.object({
  versi: z.literal(1).default(1),
  progres_navigator: skema_progres_navigator_lokal,
  perjalanan_dukungan_aktif: skema_perjalanan_dukungan.nullable().default(null),
  status_langkah_lokal: z.record(z.string(), skema_status_langkah).default({}),
  draf_persiapan_percakapan: skema_draf_persiapan_lokal,
  refleksi_makna_kerja: skema_refleksi_makna_lokal,
  diperbarui_pada: z.string(),
});

export type ProgresNavigatorLokal = z.infer<typeof skema_progres_navigator_lokal>;
export type DrafPersiapanLokal = z.infer<typeof skema_draf_persiapan_lokal>;
export type RefleksiMaknaLokal = z.infer<typeof skema_refleksi_makna_lokal>;
export type StateSesiLokal = z.infer<typeof skema_state_sesi_lokal>;

export function buat_state_sesi_lokal_kosong(): StateSesiLokal {
  return {
    versi: 1,
    progres_navigator: {
      id_masalah: null,
      id_masalah_terdisambiguasi: undefined,
      indeks_langkah: 0,
      jawaban_cabang: {},
      tujuan_langkah_berikutnya: "understand_situation",
      meminta_dukungan_psikolog_konselor: false,
      melaporkan_hambatan_fungsi_harian: false,
    },
    perjalanan_dukungan_aktif: null,
    status_langkah_lokal: {},
    draf_persiapan_percakapan: {
      target_penerima: "manager",
      id_masalah_terkait: "workload_pressure",
      apa_yang_terjadi_dan_waktu: "",
      dampak_pada_pekerjaan_atau_kondisi: "",
      konteks_peran_tanpa_nama_wajib: "",
      dukungan_yang_dibutuhkan: "",
      hasil_yang_diharapkan: "",
      hasil_draf: null,
    },
    refleksi_makna_kerja: {
      input: {
        orientasi_saat_ini: "career_orientation",
        dimensi_makna_utama: "positive_meaning_in_work",
        kebutuhan_sdt_prioritas: "competence_mastery",
        tantangan_kerja_digital: "role_clarity_in_digital_work",
      },
      hasil: null,
    },
    diperbarui_pada: new Date().toISOString(),
  };
}

function pancarkan_perubahan_sesi_lokal(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NAMA_EVENT_SESI_LOKAL));
  }
}

/**
 * Membaca state sementara produk dari `window.sessionStorage` (`voxera_session_v1`).
 * Bila data rusak atau tidak valid, otomatis memulihkan state kosong yang aman.
 * Tidak pernah menyimpan kredensial autentikasi, kata sandi, atau token sesi.
 */
export function baca_sesi_lokal(): StateSesiLokal {
  if (typeof window === "undefined") {
    return buat_state_sesi_lokal_kosong();
  }

  try {
    const mentah = window.sessionStorage.getItem(KUNCI_SESI_LOKAL);
    if (!mentah) {
      return buat_state_sesi_lokal_kosong();
    }
    const terurai: unknown = JSON.parse(mentah);
    const hasil = skema_state_sesi_lokal.safeParse(terurai);
    if (!hasil.success) {
      window.sessionStorage.removeItem(KUNCI_SESI_LOKAL);
      return buat_state_sesi_lokal_kosong();
    }
    return hasil.data;
  } catch {
    return buat_state_sesi_lokal_kosong();
  }
}

export function simpan_sesi_lokal(
  pembaruan:
    | Partial<Omit<StateSesiLokal, "versi" | "diperbarui_pada">>
    | ((sebelumnya: StateSesiLokal) => StateSesiLokal),
): StateSesiLokal {
  const saat_ini = baca_sesi_lokal();
  const berikutnya: StateSesiLokal =
    typeof pembaruan === "function"
      ? {
          ...pembaruan(saat_ini),
          versi: 1,
          diperbarui_pada: new Date().toISOString(),
        }
      : {
          ...saat_ini,
          ...pembaruan,
          versi: 1,
          diperbarui_pada: new Date().toISOString(),
        };

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(KUNCI_SESI_LOKAL, JSON.stringify(berikutnya));
      pancarkan_perubahan_sesi_lokal();
    } catch {
      // Abaikan bila sessionStorage diblokir mode peramban ketat; state memori tetap berjalan.
    }
  }

  return berikutnya;
}

export function hapus_sesi_lokal(): StateSesiLokal {
  const kosong = buat_state_sesi_lokal_kosong();
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(KUNCI_SESI_LOKAL);
      pancarkan_perubahan_sesi_lokal();
    } catch {
      // Abaikan galat akses penyimpanan.
    }
  }
  return kosong;
}

export function apakah_ada_data_sesi_lokal(state: StateSesiLokal): boolean {
  const draf = state.draf_persiapan_percakapan;
  const ada_teks_draf =
    draf.apa_yang_terjadi_dan_waktu.trim().length > 0 ||
    draf.dampak_pada_pekerjaan_atau_kondisi.trim().length > 0 ||
    draf.konteks_peran_tanpa_nama_wajib.trim().length > 0 ||
    draf.dukungan_yang_dibutuhkan.trim().length > 0 ||
    draf.hasil_yang_diharapkan.trim().length > 0 ||
    draf.hasil_draf !== null;

  const ada_progres_navigator =
    state.progres_navigator.id_masalah !== null ||
    Object.keys(state.progres_navigator.jawaban_cabang).length > 0;

  return (
    state.perjalanan_dukungan_aktif !== null ||
    ada_teks_draf ||
    ada_progres_navigator ||
    state.refleksi_makna_kerja.hasil !== null
  );
}

export type {
  DrafPercakapan,
  FollowUpStepStatus,
  HasilRefleksiMaknaKerja,
  InputNavigator,
  InputRefleksiMaknaKerja,
  IssueId,
  PerjalananDukungan,
  RecipientType,
  SpecificIssueId,
};
