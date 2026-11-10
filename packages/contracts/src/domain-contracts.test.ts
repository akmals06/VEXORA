import { describe, expect, it } from "vitest";
import {
  daftar_id_masalah,
  daftar_id_pilar,
  daftar_id_tipe_dukungan,
  daftar_tipe_penerima,
  skema_batas_konfigurasi_skrining,
  skema_draf_percakapan,
  skema_input_navigator,
  skema_input_persiapan_percakapan,
  skema_input_refleksi_makna_kerja,
  skema_perjalanan_dukungan,
  skema_respons_autentikasi,
  skema_simpan_perjalanan,
} from "./index.js";

describe("Kontrak Domain VEXORA Hasil Rekonsiliasi Fase 2.5 (@voxera/contracts)", () => {
  it("memastikan taksonomi non-klinis memiliki 10 domain masalah, 5 pilar, 9 tipe dukungan, dan 6 penerima", () => {
    expect(daftar_id_masalah).toEqual([
      "workload_pressure",
      "workplace_relationships",
      "bullying_harassment",
      "discrimination_fairness",
      "role_clarity",
      "employment_rights",
      "career_growth",
      "digital_adaptation",
      "emotional_support",
      "unsure",
    ]);
    expect(daftar_id_pilar).toEqual([
      "work_wellbeing",
      "safe_workplace",
      "know_your_rights",
      "professional_support",
      "career_growth",
    ]);
    expect(daftar_id_tipe_dukungan).toHaveLength(9);
    expect(daftar_tipe_penerima).toEqual([
      "manager",
      "hr",
      "psychologist",
      "counselor",
      "legal_professional",
      "career_professional",
    ]);
  });

  it("menerima input navigator bercabang sesuai domain dan mewajibkan disambiguasi bila kategori awal 'unsure'", () => {
    const input_domain_spesifik = {
      id_masalah: "employment_rights",
      id_subkategori: "working_hours_overtime",
      jawaban_cabang: {
        contract_type: "pkwt",
        issue_duration: "recurring_months",
      },
      tujuan_langkah_berikutnya: "understand_situation",
    };

    expect(skema_input_navigator.safeParse(input_domain_spesifik).success).toBe(true);

    const input_unsure_tanpa_disambiguasi = {
      id_masalah: "unsure",
      id_subkategori: "tasks_hours",
      jawaban_cabang: {},
      tujuan_langkah_berikutnya: "understand_situation",
    };

    expect(skema_input_navigator.safeParse(input_unsure_tanpa_disambiguasi).success).toBe(false);

    const input_unsure_valid = {
      ...input_unsure_tanpa_disambiguasi,
      id_masalah_terdisambiguasi: "workload_pressure",
    };

    expect(skema_input_navigator.safeParse(input_unsure_valid).success).toBe(true);
  });

  it("memvalidasi pemisahan Konteks Kerja, Skrining Psikologis Opsional (In-Session), dan Rujukan Profesional", () => {
    const perjalanan_valid = {
      id_masalah_utama: "bullying_harassment",
      id_subkategori: "public_humiliation",
      judul_perjalanan: "Navigasi Perlindungan Tempat Kerja & Dukungan Psikososial",
      kelas_hasil_utama: "employee_protection",
      kelas_hasil_sekunder: ["prepare", "workplace_support"],
      apakah_atasan_dilewati: true,
      ringkasan_konteks_kerja:
        "Situasi melibatkan perlakuan merendahkan berulang oleh atasan langsung dalam rapat tim.",
      jalur_dukungan_utama: "employee_protection",
      jalur_dukungan_sekunder: ["hr_workplace_support", "psychological_support"],
      rekomendasi_skrining_psikologis: {
        direkomendasikan_secara_kondisional: true,
        wajib_diisi: false,
        status_instrumen: "menunggu_instrumen_tim_psikologi",
        penjelasan_batas_non_klinis:
          "Skrining bersifat indikasi awal semata dan bukan diagnosis klinis.",
        alasan_relevansi_kontekstual:
          "Situasi intimidasi interpersonal dapat berdampak pada kesejahteraan psikososial.",
        kebijakan_penyimpanan: "in_session_only_never_persisted",
      },
      dukungan_psikologis_non_klinis: [
        {
          kategori: "psychoeducation",
          judul: "Memahami Beban Psikososial Akibat Perlakuan Tidak Aman",
          panduan_praktis:
            "Kenali bahwa ketegangan akibat intimidasi merupakan respons wajar terhadap lingkungan kerja tidak aman.",
          batasan_etik: "Informasi edukatif non-klinis, bukan pengganti asesmen psikolog.",
        },
      ],
      rekomendasi_rujukan_profesional: {
        direkomendasikan: false,
        alasan_pemicu: [],
        penjelasan_peran_konselor_psikolog:
          "Konselor atau psikolog dapat membantu pemulihan emosional secara rahasia bila Anda membutuhkannya.",
        catatan_kerahasiaan:
          "Sesi persiapan konsultasi bersifat pribadi dan tidak dibagikan ke HR atau manajer.",
        tautan_persiapan_konsultasi: "/prepare?recipient=psychologist",
      },
      daftar_langkah_rekomendasi: [
        {
          urutan_langkah: 1,
          kode_langkah: "understand_protection_options",
          judul_langkah: "Pelajari Saluran Perlindungan Alternatif (Tanpa Konfrontasi Langsung)",
          deskripsi_langkah:
            "Tinjau opsi komunikasi melalui HR atau Satgas PPKS ketika atasan langsung terlibat.",
          alasan_relevansi:
            "Menghindari eskalasi langsung kepada pihak yang menjadi sumber masalah.",
          id_tipe_dukungan: "employee_protection",
          tautan_fitur_internal: "/pillars/safe-workplace",
          status_langkah: "belum_dimulai",
        },
        {
          urutan_langkah: 2,
          kode_langkah: "prepare_confidential_notes",
          judul_langkah: "Susun Poin Situasi & Waktu Kejadian Secara Pribadi",
          deskripsi_langkah:
            "Gunakan ruang persiapan percakapan untuk merapikan urutan kejadian di sesi lokal Anda.",
          alasan_relevansi:
            "Membantu menyampaikan kronologi secara terstruktur kepada pihak pendukung.",
          id_tipe_dukungan: "hr_workplace_support",
          tautan_fitur_internal: "/prepare?recipient=hr",
          status_langkah: "belum_dimulai",
        },
      ],
      daftar_peringatan_penjaga: [
        {
          kode: "non_diagnostic_boundary",
          judul: "Bukan Diagnosis Klinis",
          pesan:
            "VEXORA menyediakan navigasi dukungan kerja dan bukan alat diagnosis gangguan mental.",
          lapisan_batas: "workplace_issue_navigation",
        },
        {
          kode: "chain_of_command_bypass",
          judul: "Jalur Alternatif Rantai Komando",
          pesan: "Ketika atasan langsung terlibat, gunakan jalur HR atau dukungan profesional.",
          lapisan_batas: "workplace_issue_navigation",
        },
      ],
      landasan_akademik_hukum: [
        "Psikologi Kerja UNTAR — Struktur Organisasi & Rantai Komando",
        "Permenaker No. 5 Tahun 2018 (K3 Lingkungan Kerja)",
        "Kepmenaker No. 88 Tahun 2023",
      ],
    };

    expect(skema_perjalanan_dukungan.safeParse(perjalanan_valid).success).toBe(true);

    const batas_skrining_valid = {
      status_ketersediaan: "menunggu_persetujuan_tim_psikologi",
      id_instrumen: null,
      nama_instrumen: null,
      konstruk_psikologis: null,
      peringatan_bukan_diagnosis:
        "Hasil skrining merupakan indikasi awal dan bukan diagnosis klinis.",
      penyimpanan_diizinkan: "session_local_only",
      dapat_dilewati_kapan_saja: true,
    };

    expect(skema_batas_konfigurasi_skrining.safeParse(batas_skrining_valid).success).toBe(true);
  });

  it("memvalidasi persiapan percakapan 5-poin (lokal sesi) untuk keenam tipe penerima dan refleksi makna kerja", () => {
    const input_percakapan = {
      target_penerima: "psychologist",
      id_masalah_terkait: "emotional_support",
      apa_yang_terjadi_dan_waktu:
        "Mengalami kelelahan berkepanjangan akibat tekanan tenggat waktu selama dua bulan terakhir.",
      dampak_pada_pekerjaan_atau_kondisi:
        "Sulit berkonsentrasi saat rapat dan merasa cemas setiap memulai hari kerja.",
      konteks_peran_tanpa_nama_wajib: "Anggota tim operasional",
      dukungan_yang_dibutuhkan: "Konsultasi awal mengenai strategi pengelolaan beban emosional.",
      hasil_yang_diharapkan: "Memahami langkah pemulihan dan batasan kerja yang sehat.",
    };

    expect(skema_input_persiapan_percakapan.safeParse(input_percakapan).success).toBe(true);

    const draf_valid = {
      judul_draf: "Catatan Persiapan Konsultasi Psikolog",
      target_penerima: "psychologist",
      id_masalah_terkait: "emotional_support",
      pembuka_percakapan: "Saya ingin mendiskusikan tekanan kerja yang saya alami akhir-akhir ini.",
      ringkasan_situasi_dan_waktu: input_percakapan.apa_yang_terjadi_dan_waktu,
      pernyataan_dampak: input_percakapan.dampak_pada_pekerjaan_atau_kondisi,
      rincian_dukungan_dan_hasil:
        "Saya membutuhkan panduan regulasi emosi dan langkah penyesuaian kerja.",
      kalimat_penutup_konstruktif: "Apakah ada langkah awal yang sebaiknya saya prioritaskan?",
      panduan_khusus_penerima: [
        "Anda tidak perlu menyiapkan istilah klinis; ceritakan pengalaman kerja secara apa adanya.",
        "Sampaikan bagaimana kondisi tersebut memengaruhi keseharian Anda.",
      ],
      hal_yang_perlu_dihindari: [
        "Menyembunyikan dampak nyata pada keseharian karena khawatir dinilai lemah.",
        "Mengharapkan surat keputusan hukum dari sesi konseling psikologis.",
      ],
      naskah_siap_salin:
        "Ringkasan Konsultasi: Selama dua bulan terakhir saya mengalami tekanan tenggat waktu...",
      peringatan_privasi_penerima:
        "Draf ini hanya tersimpan di sesi peramban Anda dan tidak pernah dikirim ke HR atau manajer.",
      kebijakan_penyimpanan: "session_local_only",
    };

    expect(skema_draf_percakapan.safeParse(draf_valid).success).toBe(true);

    const refleksi_makna = {
      orientasi_saat_ini: "career_orientation",
      dimensi_makna_utama: "meaning_making_through_work",
      kebutuhan_sdt_prioritas: "autonomy_control",
      tantangan_kerja_digital: "ai_workflow_adaptation",
    };

    expect(skema_input_refleksi_makna_kerja.safeParse(refleksi_makna).success).toBe(true);
  });

  it("memvalidasi penyimpanan kontinuitas terstruktur Option B tanpa narasi sensitif", () => {
    const simpan_perjalanan = {
      id_masalah_utama: "workload_pressure",
      id_subkategori: "excessive_volume",
      kelas_hasil_utama: "prepare",
      jalur_dukungan_utama: "manager_discussion",
      daftar_langkah: [
        {
          urutan_langkah: 1,
          kode_langkah: "prepare_workload_discussion",
          id_tipe_dukungan: "manager_discussion",
          status_langkah: "belum_dimulai",
        },
      ],
    };

    expect(skema_simpan_perjalanan.safeParse(simpan_perjalanan).success).toBe(true);

    const respons_autentikasi_valid = {
      kedaluwarsa_pada: "2026-11-14T00:00:00.000Z",
      pengguna: {
        id_pengguna: "550e8400-e29b-41d4-a716-446655440000",
        email: "karyawan@contoh.id",
        nama_alias: "Rekan Kerja",
        dibuat_pada: "2026-11-07T00:00:00.000Z",
      },
    };

    const hasil_autentikasi = skema_respons_autentikasi.safeParse({
      ...respons_autentikasi_valid,
      token_sesi: "tidak_boleh_ada_di_json",
    });
    expect(hasil_autentikasi.success).toBe(true);
    if (hasil_autentikasi.success) {
      expect("token_sesi" in hasil_autentikasi.data).toBe(false);
    }
  });
});
