import type { ItemKatalogMasalah } from "@voxera/contracts";
import { DAFTAR_KARTU_MASALAH_BERANDA } from "@/lib/taxonomy-labels";

export const KATALOG_FALLBACK_LOKAL: ItemKatalogMasalah[] = DAFTAR_KARTU_MASALAH_BERANDA.map(
  (item) => ({
    id_masalah: item.id,
    judul: item.judul,
    ringkasan_situasi: item.subjudul_singkat,
    contoh_situasi: [item.contoh_cepat, item.subjudul_singkat],
    id_pilar_utama: item.id_pilar,
    kelas_hasil_default: "understand",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "subkategori_masalah",
        teks_pertanyaan:
          "Apa kondisi yang paling menggambarkan situasi yang sedang Anda alami saat ini?",
        alasan_ditanyakan:
          "Membantu menyelaraskan langkah praktis pertama dengan konteks spesifik situasi kerja Anda.",
        daftar_opsi: [
          {
            id_opsi: "early_clarification",
            label: "Baru mulai terasa dan masih memungkinkan dibicarakan",
            penjelasan_konteks: "Fokus pada klarifikasi objektif dan penataan batas kerja.",
          },
          {
            id_opsi: "recurring_pressure",
            label: "Sudah berlangsung berulang dan mulai menghambat kinerja atau waktu istirahat",
            penjelasan_konteks:
              "Fokus pada dokumentasi pribadi dan strategi komunikasi terstruktur.",
          },
          {
            id_opsi: "direct_supervisor_involved",
            label: "Melibatkan atasan langsung atau membutuhkan kejelasan prosedur perlindungan",
            penjelasan_konteks:
              "Mengaktifkan penjaga keamanan jalur pelaporan agar tidak konfrontatif.",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      "Psikologi Kerja UNTAR & Literasi Hak Normatif Ketenagakerjaan Indonesia",
    ],
  }),
);
