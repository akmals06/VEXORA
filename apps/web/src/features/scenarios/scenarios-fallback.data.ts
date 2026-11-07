import type { SkenarioInteraktif } from "@voxera/contracts";

export const SKENARIO_FALLBACK_LOKAL: SkenarioInteraktif[] = [
  {
    id_skenario: "scn_1_workload_overtime",
    judul: "Skenario 1: Beban Kerja Berlebih & Ekspektasi Lembur Tanpa Kejelasan",
    id_pilar: "work_wellbeing",
    id_masalah_terkait: "workload_pressure",
    narasi_situasi:
      "Selama empat minggu berturut-turut, Anda menerima tambahan tugas lintas proyek setiap Jumat sore dengan ekspektasi selesai Senin pagi tanpa kejelasan prioritas maupun pencatatan jam kerja lembur.",
    pertanyaan_keputusan:
      "Apa langkah pertama yang paling konstruktif dan aman untuk menata batas kerja Anda?",
    daftar_opsi: [
      {
        id_opsi: "scn1_opt_a",
        label_tindakan:
          "Menyusun daftar beban tugas aktif beserta estimasi waktu, lalu meminta penyelarasan urutan prioritas tertulis kepada manajer",
        pertimbangan_utama:
          "Membutuhkan keberanian memulai diskusi singkat 15 menit, namun percakapan tetap objektif karena berbasis data kapasitas kerja.",
        implikasi_potensial:
          "Melindungi batas jam kerja sehat dan menciptakan rekam jejak komunikasi profesional yang konstruktif.",
        opsi_dukungan_relevan: ["manager_discussion", "self_guided_resource"],
        pendekatan_alternatif:
          "Gunakan Alat Persiapan Percakapan dengan target Manajer untuk menyusun kalimat pembuka berbasis kapasitas.",
      },
      {
        id_opsi: "scn1_opt_b",
        label_tindakan:
          "Tetap mengerjakan semuanya sendirian hingga larut malam tanpa menyampaikan batas kapasitas",
        pertimbangan_utama:
          "Menghindari percakapan canggung hari ini, tetapi meningkatkan kelelahan emosional dan risiko kesalahan kerja.",
        implikasi_potensial:
          "Membuat pola beban berlebih dianggap normal dan jam lembur tidak tercatat secara resmi.",
        opsi_dukungan_relevan: ["self_guided_resource"],
        pendekatan_alternatif:
          "Catat realisasi jam kerja pribadi Anda selama 1 minggu sebagai dasar objektif sebelum berdiskusi.",
      },
      {
        id_opsi: "scn1_opt_c",
        label_tindakan:
          "Mengkonsultasikan kebijakan jam kerja dan lembur secara tenang dengan kanal SDM/HR apabila diskusi di tingkat tim buntu",
        pertimbangan_utama:
          "Relevan ketika beban berlebih sudah berlangsung kronis dan memengaruhi fungsi keseharian.",
        implikasi_potensial:
          "Membuka fasilitasi beban kerja lintas peran sesuai standar waktu kerja normatif.",
        opsi_dukungan_relevan: ["hr_workplace_support", "legal_information"],
        pendekatan_alternatif:
          "Siapkan ringkasan beban tugas tertulis sebelum menjadwalkan konsultasi HR.",
      },
    ],
    pelajaran_multidisiplin:
      "Beban berlebih kronis menguras kapasitas kerja efektif, sementara kerja lembur diatur secara normatif melalui persetujuan dan batas waktu kerja.",
    tautan_perjalanan_dukungan: "/navigate?issue=workload_pressure",
  },
];
