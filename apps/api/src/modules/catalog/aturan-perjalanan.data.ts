import type {
  ItemDukunganPsikologis,
  OutcomeClass,
  PeringatanPenjaga,
  SpecificIssueId,
  SupportTypeId,
} from "@voxera/contracts";
import { REFERENSI_AKADEMIK_DAN_HUKUM as REF } from "./referensi-hukum.data.js";

export interface DefinisiLangkahDasar {
  kode_langkah: string;
  judul_langkah: string;
  deskripsi_langkah: string;
  alasan_relevansi: string;
  id_tipe_dukungan: SupportTypeId;
  tautan_fitur_internal: string;
}

export interface AturanSubkategoriDomain {
  judul_perjalanan: string;
  ringkasan_konteks_kerja: string;
  kelas_hasil_utama: OutcomeClass;
  kelas_hasil_sekunder: OutcomeClass[];
  jalur_dukungan_utama: SupportTypeId;
  jalur_dukungan_sekunder: SupportTypeId[];
  langkah_dasar: DefinisiLangkahDasar[];
}

export interface DefinisiAturanDomain {
  id_masalah_utama: SpecificIssueId;
  skrining_psikologis_relevan: boolean;
  alasan_skrining_kontekstual: string;
  apakah_domain_hak_atau_keamanan: boolean;
  dukungan_psikologis_non_klinis: ItemDukunganPsikologis[];
  landasan_akademik_hukum: string[];
  aturan_default_domain: AturanSubkategoriDomain;
  aturan_subkategori: Record<string, AturanSubkategoriDomain>;
}

export const PERINGATAN_PENJAGA_STANDAR: Record<
  | "non_diagnostic_boundary"
  | "non_legal_verdict_boundary"
  | "chain_of_command_bypass"
  | "hygiene_rights_protection_priority"
  | "confidential_psychological_boundary",
  PeringatanPenjaga
> = {
  non_diagnostic_boundary: {
    kode: "non_diagnostic_boundary",
    judul: "Batas Etik Non-Diagnostik Psikologi",
    pesan:
      "VOXERA memberikan navigasi masalah kerja, psikoedukasi, dan persiapan konsultasi. Hasil pemetaan ini bukan diagnosis klinis psikologis maupun psikiatris.",
    lapisan_batas: "workplace_issue_navigation",
  },
  non_legal_verdict_boundary: {
    kode: "non_legal_verdict_boundary",
    judul: "Batas Literasi Hukum Non-Adjudikatif",
    pesan:
      "Informasi regulasi disajikan untuk literasi hak ketenagakerjaan dan persiapan komunikasi, bukan putusan hukum resmi atau penetapan pelanggaran otomatis.",
    lapisan_batas: "workplace_issue_navigation",
  },
  chain_of_command_bypass: {
    kode: "chain_of_command_bypass",
    judul: "Penjaga Keamanan Jalur Pelaporan (Melewati Atasan Langsung)",
    pesan:
      "Karena situasi ini melibatkan atasan langsung atau risiko retaliasi, VOXERA tidak mengarahkan Anda untuk berhadapan langsung secara tunggal dengan atasan tersebut, melainkan melalui kanal dukungan SDM/HR, perlindungan kerja, atau pendampingan profesional.",
    lapisan_batas: "workplace_issue_navigation",
  },
  hygiene_rights_protection_priority: {
    kode: "hygiene_rights_protection_priority",
    judul: "Prioritas Perlindungan Hak Dasar & Kondisi Kerja (Faktor Hygiene)",
    pesan:
      "Masalah terkait pengupahan, waktu kerja/lembur, keselamatan, atau kepastian hak normatif bukan merupakan kurangnya motivasi pribadi, melainkan faktor kondisi dasar kerja yang memerlukan klarifikasi hak dan perlindungan ketenagakerjaan.",
    lapisan_batas: "workplace_issue_navigation",
  },
  confidential_psychological_boundary: {
    kode: "confidential_psychological_boundary",
    judul: "Prioritas Dukungan Profesional & Keamanan Diri",
    pesan:
      "Apabila tekanan kerja sudah mengganggu fungsi keseharian secara bermakna, Anda tidak harus menghadapinya sendiri. Pertimbangkan menjangkau psikolog atau konselor profesional.",
    lapisan_batas: "qualified_professional_assessment",
  },
};

export const PETA_ATURAN_DOMAIN: Record<SpecificIssueId, DefinisiAturanDomain> = {
  workload_pressure: {
    id_masalah_utama: "workload_pressure",
    skrining_psikologis_relevan: true,
    alasan_skrining_kontekstual:
      "Tekanan beban kerja dan tenggat waktu yang berkepanjangan dapat memengaruhi keseimbangan energi emosional dan kognitif Anda.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "work_related_coping",
        judul: "Pemetaan Kapasitas & Negosiasi Prioritas (Problem-Focused Coping)",
        panduan_praktis:
          "Pisahkan daftar tugas menjadi tugas kritis minggu ini, tugas yang dapat dijadwalkan ulang, dan tugas yang membutuhkan kejelasan sumber daya sebelum mendiskusikannya.",
        batasan_etik:
          "Koping berfokus masalah membantu struktur komunikasi kerja, namun tidak menggantikan kewajiban organisasi menata beban kerja yang wajar.",
      },
      {
        kategori: "emotional_regulation",
        judul: "Jeda Pemulihan Mikro & Batas Detasemen Psikologis",
        panduan_praktis:
          "Terapkan transisi penutup jam kerja selama 10 menit untuk mencatat tugas esok hari agar pikiran tidak terus memproses beban tugas saat waktu istirahat.",
        batasan_etik:
          "Panduan regulasi emosi bersifat edukatif non-klinis dan bukan terapi kelelahan klinis.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PERMENAKER_K3_2018,
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Penataan Beban Kerja & Komunikasi Prioritas",
      ringkasan_konteks_kerja:
        "Anda sedang menghadapi tekanan volume atau tenggat kerja yang membutuhkan penyelarasan prioritas secara terukur serta penjagaan batas energi kerja.",
      kelas_hasil_utama: "prepare",
      kelas_hasil_sekunder: ["understand", "workplace_support"],
      jalur_dukungan_utama: "manager_discussion",
      jalur_dukungan_sekunder: ["self_guided_resource", "hr_workplace_support"],
      langkah_dasar: [
        {
          kode_langkah: "audit_workload_capacity",
          judul_langkah: "Petakan Daftar Tugas Aktif & Estimasi Waktu Realistis",
          deskripsi_langkah:
            "Susun ringkasan faktual mengenai proyek yang sedang berjalan, tenggat waktu, serta dampak penambahan tugas terhadap kualitas hasil kerja.",
          alasan_relevansi:
            "Membantu mengubah keluhan beban kerja menjadi diskusi berbasis kapasitas objektif.",
          id_tipe_dukungan: "self_guided_resource",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=workload_pressure",
        },
        {
          kode_langkah: "prepare_workload_discussion",
          judul_langkah: "Siapkan Draf Diskusi Penyelarasan Prioritas",
          deskripsi_langkah:
            "Gunakan ruang Persiapan Percakapan 5-Prompt untuk menyusun pembuka dan usulan prioritas tugas yang konstruktif.",
          alasan_relevansi:
            "Memudahkan pengambilan keputusan bersama terkait tugas mana yang perlu didahulukan atau ditunda.",
          id_tipe_dukungan: "manager_discussion",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=workload_pressure",
        },
        {
          kode_langkah: "review_work_hours_boundary",
          judul_langkah: "Tinjau Panduan K3 Psikologi & Batas Waktu Kerja",
          deskripsi_langkah:
            "Pelajari ketentuan pengendalian beban kerja (Permenaker No. 5 Tahun 2018) serta perlindungan waktu kerja dan istirahat.",
          alasan_relevansi:
            "Memberikan pijakan normatif bahwa pengelolaan beban kerja merupakan bagian dari keselamatan dan kesehatan kerja.",
          id_tipe_dukungan: "legal_information",
          tautan_fitur_internal: "/journey#rights-context",
        },
      ],
    },
    aturan_subkategori: {
      always_on_expectations: {
        judul_perjalanan: "Rencana Penataan Batas Waktu Kerja & Perlindungan Hak Istirahat",
        ringkasan_konteks_kerja:
          "Anda menghadapi tuntutan selalu terhubung di luar jam kerja atau penugasan lembur yang mengaburkan hak waktu istirahat.",
        kelas_hasil_utama: "prepare",
        kelas_hasil_sekunder: ["understand", "employee_protection"],
        jalur_dukungan_utama: "manager_discussion",
        jalur_dukungan_sekunder: ["legal_information", "hr_workplace_support"],
        langkah_dasar: [
          {
            kode_langkah: "document_after_hours_pattern",
            judul_langkah: "Catat Pola Penugasan di Luar Jam Kerja Secara Faktual",
            deskripsi_langkah:
              "Rangkum waktu dan frekuensi penugasan di luar jam kerja normal beserta dampaknya pada waktu pemulihan.",
            alasan_relevansi:
              "Menyediakan data konkret saat mendiskusikan batas ketersediaan komunikasi kerja.",
            id_tipe_dukungan: "legal_information",
            tautan_fitur_internal: "/prepare?recipient=hr&issue=workload_pressure",
          },
          {
            kode_langkah: "prepare_boundary_alignment",
            judul_langkah: "Siapkan Naskah Kesepakatan Jam Respons & Lembur",
            deskripsi_langkah:
              "Susun poin pembicaraan mengenai ekspektasi waktu respons darurat vs. tugas reguler serta mekanisme pencatatan lembur.",
            alasan_relevansi:
              "Menjaga kejelasan ekspektasi kerja sekaligus melindungi hak istirahat normatif.",
            id_tipe_dukungan: "manager_discussion",
            tautan_fitur_internal: "/prepare?recipient=manager&issue=workload_pressure",
          },
        ],
      },
    },
  },

  workplace_relationships: {
    id_masalah_utama: "workplace_relationships",
    skrining_psikologis_relevan: true,
    alasan_skrining_kontekstual:
      "Ketegangan interpersonal di tempat kerja sering kali menimbulkan beban emosional yang tidak terlihat.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "psychoeducation",
        judul: "Memisahkan Fakta Kerja dari Eskalasi Emosional Interpersonal",
        panduan_praktis:
          "Fokuskan komunikasi pada perilaku kerja spesifik dan dampaknya terhadap alur tugas, bukan pada pelabelan karakter pribadi.",
        batasan_etik:
          "Panduan komunikasi asertif bersifat edukatif dan tidak menggantikan mediasi struktural apabila terdapat ketimpangan kuasa.",
      },
      {
        kategori: "emotional_regulation",
        judul: "Regulasi Respons Sebelum Merespons Konflik",
        panduan_praktis:
          "Tunda balasan tertulis saat emosi sedang memuncak; gunakan struktur situasi-dampak-harapan agar pesan tetap terarah.",
        batasan_etik: "Bukan intervensi klinis maupun konseling relasi.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_6,
      REF.PSIKOLOGI_PERTEMUAN_2,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Penanganan Gesekan Komunikasi & Relasi Kerja",
      ringkasan_konteks_kerja:
        "Anda sedang menghadapi ketegangan komunikasi atau koordinasi kerja yang memerlukan penyelarasan batas kerja dan komunikasi objektif.",
      kelas_hasil_utama: "prepare",
      kelas_hasil_sekunder: ["understand", "workplace_support"],
      jalur_dukungan_utama: "manager_discussion",
      jalur_dukungan_sekunder: ["hr_workplace_support", "psychological_support"],
      langkah_dasar: [
        {
          kode_langkah: "clarify_work_friction_points",
          judul_langkah: "Identifikasi Titik Gesekan Alur Kerja Secara Spesifik",
          deskripsi_langkah:
            "Uraikan kejadian spesifik, waktu, dan bagian alur kerja yang terhambat tanpa menyalahkan karakter personal.",
          alasan_relevansi:
            "Memudahkan pihak terkait memahami masalah operasional yang perlu diperbaiki.",
          id_tipe_dukungan: "self_guided_resource",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=workplace_relationships",
        },
        {
          kode_langkah: "prepare_constructive_dialogue",
          judul_langkah: "Susun Panduan Percakapan Penyelarasan Ekspektasi",
          deskripsi_langkah:
            "Gunakan alat Persiapan Percakapan untuk merumuskan kalimat pembuka yang tenang dan usulan aturan koordinasi ke depan.",
          alasan_relevansi: "Mengurangi risiko kesalahpahaman baru saat membicarakan isu sensitif.",
          id_tipe_dukungan: "manager_discussion",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=workplace_relationships",
        },
      ],
    },
    aturan_subkategori: {},
  },

  bullying_harassment: {
    id_masalah_utama: "bullying_harassment",
    skrining_psikologis_relevan: true,
    alasan_skrining_kontekstual:
      "Paparan intimidasi, perundungan, atau pelecehan merupakan bahaya psikososial serius yang dapat berdampak langsung pada rasa aman dan kesejahteraan psikologis Anda.",
    apakah_domain_hak_atau_keamanan: true,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "psychoeducation",
        judul: "Validasi Pengalaman & Pemahaman Bahaya Psikososial",
        panduan_praktis:
          "Perlakuan merendahkan atau pelecehan di tempat kerja bukanlah kesalahan korban dan bukan ujian ketahanan mental yang wajar.",
        batasan_etik:
          "Dukungan ini membantu pemulihan rasa aman awal, bukan pengganti pendampingan psikolog klinis atau perlindungan hukum.",
      },
      {
        kategori: "professional_consultation_prep",
        judul: "Persiapan Dokumentasi Aman & Ruang Konsultasi Rahasia",
        panduan_praktis:
          "Simpan catatan waktu, tempat, dan rincian kejadian di perangkat pribadi di luar jaringan kantor sebelum menghubungi kanal perlindungan atau konselor.",
        batasan_etik:
          "Catatan persiapan membantu Anda menyampaikan kronologi tanpa harus mengulang trauma secara tidak terstruktur.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.KEPMENAKER_88_2023,
      REF.UU_TPKS_2022,
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Perlindungan Diri, Dokumentasi Aman & Navigasi Kanal Pendampingan",
      ringkasan_konteks_kerja:
        "Anda melaporkan adanya indikasi intimidasi, perundungan, atau pelecehan di lingkungan kerja yang memerlukan prioritas keamanan psikologis dan kanal perlindungan yang tepat.",
      kelas_hasil_utama: "employee_protection",
      kelas_hasil_sekunder: ["prepare", "workplace_support"],
      jalur_dukungan_utama: "employee_protection",
      jalur_dukungan_sekunder: ["hr_workplace_support", "psychological_support", "legal_support"],
      langkah_dasar: [
        {
          kode_langkah: "prepare_private_chronology",
          judul_langkah: "Susun Ringkasan Kronologis Kejadian di Sesi Lokal",
          deskripsi_langkah:
            "Catat urutan kejadian, waktu, dampak yang dirasakan, dan konteks peran menggunakan alat Persiapan Situasi (tersimpan hanya di sesi peramban Anda).",
          alasan_relevansi:
            "Membantu Anda memiliki pegangan faktual yang rapi sebelum berbicara dengan pihak pendamping, HR, atau Satgas Pencegahan dan Penanganan Kekerasan Seksual di perusahaan (jika tersedia / telah dibentuk).",
          id_tipe_dukungan: "employee_protection",
          tautan_fitur_internal: "/prepare?recipient=hr&issue=bullying_harassment",
        },
        {
          kode_langkah: "navigate_safe_reporting_channel",
          judul_langkah: "Pelajari Kanal Perlindungan Internal & Satgas Pencegahan",
          deskripsi_langkah:
            "Tinjau peran Satgas Pencegahan dan Penanganan Kekerasan Seksual di perusahaan, jika tersedia / telah dibentuk (Kepmenaker No. 88 Tahun 2023), atau akses kanal HR independen maupun pendampingan eksternal.",
          alasan_relevansi:
            "Memastikan Anda memilih jalur pengaduan yang memiliki mandat perlindungan korban dan pencegahan retaliasi.",
          id_tipe_dukungan: "hr_workplace_support",
          tautan_fitur_internal: "/journey#support-directory",
        },
        {
          kode_langkah: "connect_psych_or_legal_support",
          judul_langkah:
            "Akses Opsi Dukungan Psikologis atau Pendamping Hukum (Tersedia Secara Sukarela)",
          deskripsi_langkah:
            "Jika Anda merasa membutuhkan ruang aman pemulihan emosional atau klarifikasi hak hukum, VOXERA menyediakan direktori dan panduan rujukan profesional yang dapat Anda akses sesuai kebutuhan dan keputusan mandiri Anda.",
          alasan_relevansi:
            "Memberikan akses dukungan pemulihan emosional dan pendampingan hak tanpa memaksakan rujukan otomatis.",
          id_tipe_dukungan: "psychological_support",
          tautan_fitur_internal: "/prepare?recipient=psychologist&issue=bullying_harassment",
        },
      ],
    },
    aturan_subkategori: {},
  },

  discrimination_fairness: {
    id_masalah_utama: "discrimination_fairness",
    skrining_psikologis_relevan: true,
    alasan_skrining_kontekstual:
      "Perlakuan diskriminatif atau tidak adil dapat mengikis rasa aman psikologis dan penghargaan diri di tempat kerja.",
    apakah_domain_hak_atau_keamanan: true,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "work_related_coping",
        judul: "Pemisahan Evaluasi Objektif dari Perlakuan Bias",
        panduan_praktis:
          "Kumpulkan indikator kinerja dan kesepakatan kerja tertulis agar diskusi tetap berpijak pada kriteria objektif yang dapat diverifikasi.",
        batasan_etik:
          "Bukan penilaian hukum atas ada/tidaknya pelanggaran diskriminasi, melainkan persiapan komunikasi berbasis fakta.",
      },
    ],
    landasan_akademik_hukum: [
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_4,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Klarifikasi Kesetaraan Perlakuan & Perlindungan Hak Kerja",
      ringkasan_konteks_kerja:
        "Anda menghadapi indikasi pembedaan perlakuan atau ketidakadilan proses kerja yang membutuhkan peninjauan standar objektif serta literasi hak non-diskriminasi.",
      kelas_hasil_utama: "prepare",
      kelas_hasil_sekunder: ["understand", "employee_protection"],
      jalur_dukungan_utama: "hr_workplace_support",
      jalur_dukungan_sekunder: ["legal_information", "employee_protection"],
      langkah_dasar: [
        {
          kode_langkah: "compile_objective_work_records",
          judul_langkah: "Rangkum Bukti Kinerja & Kriteria Standar yang Berlaku",
          deskripsi_langkah:
            "Susun perbandingan faktual antara kebijakan tertulis, capaian kerja Anda, dan keputusan yang diterima.",
          alasan_relevansi:
            "Memperkuat posisi Anda saat meminta klarifikasi objektif kepada HR atau manajemen.",
          id_tipe_dukungan: "hr_workplace_support",
          tautan_fitur_internal: "/prepare?recipient=hr&issue=discrimination_fairness",
        },
        {
          kode_langkah: "review_equal_treatment_rights",
          judul_langkah: "Pahami Prinsip Non-Diskriminasi dalam UU Pelindungan Ketenagakerjaan",
          deskripsi_langkah:
            "Pelajari hak setiap pekerja atas perlakuan yang sama tanpa diskriminasi di tempat kerja berdasarkan UU No. 27 Tahun 2026.",
          alasan_relevansi:
            "Membantu Anda merujuk pada prinsip kesetaraan kesempatan dan perlakuan kerja secara proporsional.",
          id_tipe_dukungan: "legal_information",
          tautan_fitur_internal: "/journey#rights-context",
        },
      ],
    },
    aturan_subkategori: {},
  },

  role_clarity: {
    id_masalah_utama: "role_clarity",
    skrining_psikologis_relevan: false,
    alasan_skrining_kontekstual:
      "Ketidakjelasan peran terutama membutuhkan penyelarasan struktur kerja, namun skrining kesejahteraan tetap tersedia secara opsional bila Anda merasa tertekan.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "work_related_coping",
        judul: "Penyusunan Matriks Batas Tanggung Jawab & Prioritas Peran",
        panduan_praktis:
          "Tuliskan tiga kelompok tugas: (1) tanggung jawab inti yang sudah jelas, (2) area abu-abu yang butuh keputusan atasan, dan (3) instruksi yang saling bertentangan.",
        batasan_etik: "Panduan struktur kerja non-klinis berdasarkan K3 Psikologi.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PERMENAKER_K3_2018,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Klarifikasi Peran, Wewenang & Ekspektasi Kerja",
      ringkasan_konteks_kerja:
        "Anda mengalami ketaksaan peran (role ambiguity) atau instruksi yang saling bertabrakan (role conflict) yang perlu diselaraskan secara tertulis.",
      kelas_hasil_utama: "prepare",
      kelas_hasil_sekunder: ["understand"],
      jalur_dukungan_utama: "manager_discussion",
      jalur_dukungan_sekunder: ["hr_workplace_support", "career_support"],
      langkah_dasar: [
        {
          kode_langkah: "draft_role_expectation_matrix",
          judul_langkah: "Susun Draf Klarifikasi Ruang Lingkup & Indikator Keberhasilan",
          deskripsi_langkah:
            "Gunakan Persiapan Percakapan untuk merinci tugas inti, instruksi yang bertabrakan, dan keputusan prioritas yang Anda butuhkan dari atasan.",
          alasan_relevansi:
            "Mengurangi ketaksaan peran yang menjadi salah satu sumber utama stres kerja menurut Permenaker No. 5 Tahun 2018.",
          id_tipe_dukungan: "manager_discussion",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=role_clarity",
        },
        {
          kode_langkah: "align_written_work_agreement",
          judul_langkah: "Konfirmasi Kesepakatan Prioritas Secara Tertulis Pasca-Diskusi",
          deskripsi_langkah:
            "Kirimkan ringkasan singkat hasil diskusi kepada atasan/tim agar batas tanggung jawab tercatat dengan jelas.",
          alasan_relevansi:
            "Mencegah berulangnya evaluasi kinerja berdasarkan ekspektasi yang tidak pernah disepakati.",
          id_tipe_dukungan: "hr_workplace_support",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=role_clarity",
        },
      ],
    },
    aturan_subkategori: {},
  },

  employment_rights: {
    id_masalah_utama: "employment_rights",
    skrining_psikologis_relevan: false,
    alasan_skrining_kontekstual:
      "Fokus utama Anda adalah kejelasan dan perlindungan hak normatif ketenagakerjaan; pemeriksaan kesejahteraan psikologis tetap dapat diakses secara opsional.",
    apakah_domain_hak_atau_keamanan: true,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "work_related_coping",
        judul: "Ketenangan Mengumpulkan Dokumen & Fakta Hubungan Kerja",
        panduan_praktis:
          "Jangan terburu-buru menandatangani dokumen pelepasan hak atau pengunduran diri saat berada di bawah tekanan waktu; minta waktu wajar untuk mempelajari isi dokumen.",
        batasan_etik:
          "Berfokus pada kesiapan psikologis dan administratif sebelum mengambil langkah hukum atau bipartit.",
      },
    ],
    landasan_akademik_hukum: [
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
      REF.UU_PPHI_2004,
      REF.PSIKOLOGI_PERTEMUAN_2,
    ],
    aturan_default_domain: {
      judul_perjalanan:
        "Rencana Literasi Hak Ketenagakerjaan, Persiapan Dokumen & Navigasi Bipartit/Hukum",
      ringkasan_konteks_kerja:
        "Anda sedang menghadapi persoalan kontrak kerja, pengupahan, waktu istirahat/cuti, atau keberlanjutan hubungan kerja yang memerlukan pijakan informasi regulasi dan persiapan komunikasi yang cermat.",
      kelas_hasil_utama: "understand",
      kelas_hasil_sekunder: ["prepare", "employee_protection"],
      jalur_dukungan_utama: "legal_information",
      jalur_dukungan_sekunder: ["hr_workplace_support", "legal_support", "employee_protection"],
      langkah_dasar: [
        {
          kode_langkah: "review_employment_law_literacy",
          judul_langkah: "Pelajari Ketentuan Dasar dalam UU No. 27 Tahun 2026 & UU PPHI",
          deskripsi_langkah:
            "Pahami kerangka hak normatif terkait perjanjian kerja, pengupahan, waktu kerja, serta tahapan penyelesaian perselisihan hubungan industrial (bipartit hingga mediasi).",
          alasan_relevansi:
            "Memberikan pemahaman awal yang akurat sebelum Anda berdiskusi dengan HR atau konsultan hukum.",
          id_tipe_dukungan: "legal_information",
          tautan_fitur_internal: "/journey#rights-context",
        },
        {
          kode_langkah: "prepare_rights_clarification_brief",
          judul_langkah: "Susun Pertanyaan Klarifikasi HR atau Catatan Konsultasi Hukum",
          deskripsi_langkah:
            "Gunakan alat Persiapan Percakapan untuk merangkum kronologi kontrak/upah dan pertanyaan spesifik untuk HR atau pendamping hukum ketenagakerjaan.",
          alasan_relevansi:
            "Memastikan komunikasi berjalan tertib, terdokumentasi, dan fokus pada pemenuhan hak normatif.",
          id_tipe_dukungan: "legal_support",
          tautan_fitur_internal: "/prepare?recipient=legal_professional&issue=employment_rights",
        },
      ],
    },
    aturan_subkategori: {
      termination_contract: {
        judul_perjalanan: "Rencana Menghadapi Tekanan Pengunduran Diri atau Proses PHK",
        ringkasan_konteks_kerja:
          "Anda menghadapi situasi sensitif terkait perubahan status kontrak atau ancaman pemutusan hubungan kerja yang memerlukan kehati-hatian dokumen dan pendampingan hukum.",
        kelas_hasil_utama: "employee_protection",
        kelas_hasil_sekunder: ["understand", "prepare"],
        jalur_dukungan_utama: "legal_support",
        jalur_dukungan_sekunder: [
          "legal_information",
          "employee_protection",
          "hr_workplace_support",
        ],
        langkah_dasar: [
          {
            kode_langkah: "pause_unverified_signature",
            judul_langkah: "Tinjau Dokumen Secara Utuh Sebelum Menandatangani Persetujuan",
            deskripsi_langkah:
              "Pelajari perbedaan hukum antara pengunduran diri sukarela dan PHK beserta implikasinya terhadap hak kompensasi dalam UU No. 27 Tahun 2026 dan mekanisme bipartit UU No. 2 Tahun 2004.",
            alasan_relevansi:
              "Mencegah hilangnya hak normatif akibat penandatanganan dokumen di bawah tekanan sesaat.",
            id_tipe_dukungan: "legal_information",
            tautan_fitur_internal: "/journey#rights-context",
          },
          {
            kode_langkah: "prepare_legal_consultation_notes",
            judul_langkah: "Siapkan Ringkasan Kontrak & Kronologi untuk Konsultasi Hukum",
            deskripsi_langkah:
              "Susun ringkasan masa kerja, jenis kontrak, serta komunikasi terakhir untuk dibahas bersama LBH, serikat pekerja, atau konsultan hukum ketenagakerjaan.",
            alasan_relevansi:
              "Mempercepat penelaahan opsi perundingan bipartit atau mediasi hubungan industrial.",
            id_tipe_dukungan: "legal_support",
            tautan_fitur_internal: "/prepare?recipient=legal_professional&issue=employment_rights",
          },
        ],
      },
    },
  },

  career_growth: {
    id_masalah_utama: "career_growth",
    skrining_psikologis_relevan: false,
    alasan_skrining_kontekstual:
      "Eksplorasi arah karier dan makna kerja berfokus pada pengembangan diri, dengan akses opsional ke pemeriksaan kesejahteraan psikologis bila diperlukan.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "psychoeducation",
        judul: "Refleksi Orientasi Kerja (Job, Career, Calling) & Kebutuhan Dasar SDT",
        panduan_praktis:
          "Tinjau apakah rasa stagnan berasal dari kurangnya ruang otonomi (Autonomy), kurangnya tantangan penguasaan keahlian (Competence), atau kurangnya keterhubungan makna (Relatedness & Positive Meaning).",
        batasan_etik:
          "Refleksi pengembangan karier bersifat kualitatif non-klinis berdasarkan Psikologi Kerja UNTAR Pertemuan 2 & 5.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PSIKOLOGI_PERTEMUAN_6,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Refleksi Makna Kerja & Navigasi Pengembangan Karier",
      ringkasan_konteks_kerja:
        "Anda sedang mengevaluasi kembali makna pekerjaan, pertumbuhan kompetensi, dan arah perkembangan karier jangka menengah.",
      kelas_hasil_utama: "understand",
      kelas_hasil_sekunder: ["prepare"],
      jalur_dukungan_utama: "career_support",
      jalur_dukungan_sekunder: ["manager_discussion", "self_guided_resource"],
      langkah_dasar: [
        {
          kode_langkah: "complete_meaning_reflection",
          judul_langkah: "Gunakan Alat Refleksi Makna Kerja & Kebutuhan Psikologis Dasar",
          deskripsi_langkah:
            "Petakan orientasi kerja Anda saat ini (Job, Career, atau Calling) serta dimensi makna kerja (Positive Meaning, Meaning Making, Greater Good).",
          alasan_relevansi:
            "Membantu memperjelas sumber ketidakpuasan atau aspirasi pertumbuhan sebelum mengambil keputusan karier.",
          id_tipe_dukungan: "career_support",
          tautan_fitur_internal: "/journey#meaning-reflection",
        },
        {
          kode_langkah: "prepare_career_development_dialogue",
          judul_langkah: "Susun Agenda Diskusi Pengembangan Karier atau Konsultasi Mentor",
          deskripsi_langkah:
            "Gunakan Persiapan Percakapan untuk merumuskan kompetensi yang ingin dikembangkan dan dukungan pembelajaran yang Anda harapkan.",
          alasan_relevansi:
            "Mengubah rasa stagnan menjadi rencana pengembangan karier yang konkret dan terarah.",
          id_tipe_dukungan: "manager_discussion",
          tautan_fitur_internal: "/prepare?recipient=career_professional&issue=career_growth",
        },
      ],
    },
    aturan_subkategori: {},
  },

  digital_adaptation: {
    id_masalah_utama: "digital_adaptation",
    skrining_psikologis_relevan: false,
    alasan_skrining_kontekstual:
      "Adaptasi kerja digital berfokus pada kejelasan alur kerja dan penguasaan alat baru, disertai opsi pemeriksaan kesejahteraan bila kelelahan digital terasa membebani.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "work_related_coping",
        judul: "Pengelolaan Beban Kognitif Digital & Penguatan Kompetensi Bertahap",
        panduan_praktis:
          "Kurangi pergantian konteks (context switching) dengan mengelompokkan waktu pemeriksaan pesan dan memisahkan keterampilan digital baru yang perlu dipelajari secara bertahap.",
        batasan_etik:
          "Strategi adaptasi kerja digital bersifat praktis dan edukatif (Psikologi Kerja Pertemuan 1, 2 & 5).",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_5,
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_2,
    ],
    aturan_default_domain: {
      judul_perjalanan: "Rencana Adaptasi Kerja Digital, Kejelasan Alur & Penguatan Kompetensi",
      ringkasan_konteks_kerja:
        "Anda menghadapi tantangan adaptasi sistem digital/AI, fragmentasi komunikasi, atau ketidakjelasan koordinasi kerja hibrida.",
      kelas_hasil_utama: "understand",
      kelas_hasil_sekunder: ["prepare"],
      jalur_dukungan_utama: "career_support",
      jalur_dukungan_sekunder: ["manager_discussion", "self_guided_resource"],
      langkah_dasar: [
        {
          kode_langkah: "map_digital_workflow_friction",
          judul_langkah: "Identifikasi Hambatan Alur Kerja Digital & Kebutuhan Pelatihan",
          deskripsi_langkah:
            "Petakan alat atau proses digital mana yang paling menghambat fokus kerja serta dukungan panduan/pelatihan yang dibutuhkan.",
          alasan_relevansi:
            "Mendukung kebutuhan penguasaan kompetensi (Competence) dan otonomi kerja di era digital.",
          id_tipe_dukungan: "career_support",
          tautan_fitur_internal: "/journey#meaning-reflection",
        },
        {
          kode_langkah: "prepare_workflow_alignment_request",
          judul_langkah: "Siapkan Usulan Penyelarasan Ekspektasi Kerja Digital Bersama Atasan/Tim",
          deskripsi_langkah:
            "Susun poin diskusi mengenai prioritas kanal komunikasi, waktu kerja fokus, atau kebutuhan pendampingan transisi sistem baru.",
          alasan_relevansi:
            "Membantu tim menyepakati norma komunikasi digital yang sehat dan produktif.",
          id_tipe_dukungan: "manager_discussion",
          tautan_fitur_internal: "/prepare?recipient=manager&issue=digital_adaptation",
        },
      ],
    },
    aturan_subkategori: {},
  },

  emotional_support: {
    id_masalah_utama: "emotional_support",
    skrining_psikologis_relevan: true,
    alasan_skrining_kontekstual:
      "Karena Anda merasakan kelelahan emosional atau beban psikologis terkait pekerjaan, pemeriksaan awal yang bersifat sukarela dan rahasia dapat membantu memetakan kebutuhan dukungan Anda.",
    apakah_domain_hak_atau_keamanan: false,
    dukungan_psikologis_non_klinis: [
      {
        kategori: "emotional_regulation",
        judul: "Teknik Grounding & Penurunan Ketegangan Fisiologis Sesaat",
        panduan_praktis:
          "Saat beban emosi terasa memuncak di tengah hari kerja, ambil jeda pernapasan lambat (4 detik tarik napas, 6 detik embuskan) dan beri jarak sejenak dari pemicu stres sebelum mengambil keputusan.",
        batasan_etik:
          "Teknik regulasi emosi awal membantu stabilisasi sesaat, bukan pengganti asesmen atau psikoterapi oleh Psikolog Klinis/Konselor.",
      },
      {
        kategori: "coping_strategies",
        judul: "Memilah Hal yang Berada di Dalam vs. di Luar Kendali Pribadi",
        panduan_praktis:
          "Fokuskan energi harian pada langkah kecil yang dapat Anda kendalikan langsung, sambil menyiapkan dukungan profesional untuk beban yang terasa melampaui kapasitas mandiri.",
        batasan_etik:
          "Tetap menghormati batas bahwa masalah sistemik tempat kerja bukan tanggung jawab emosional individu semata.",
      },
      {
        kategori: "professional_consultation_prep",
        judul: "Persiapan Bercerita Tanpa Beban kepada Konselor atau Psikolog",
        panduan_praktis:
          "Anda tidak perlu menyusun istilah psikologi yang rumit; cukup catat apa yang paling menguras perasaan Anda dan sejak kapan hal tersebut mengganggu keseharian.",
        batasan_etik:
          "Catatan persiapan tetap berada di sesi lokal peramban Anda dan tidak pernah dikirim ke perusahaan.",
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_6,
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.UU_PDP_2022,
    ],
    aturan_default_domain: {
      judul_perjalanan:
        "Rencana Dukungan Regulasi Emosi, Pemulihan Batas Diri & Persiapan Konseling",
      ringkasan_konteks_kerja:
        "Anda sedang mengalami kelelahan emosional atau tekanan perasaan terkait pekerjaan yang membutuhkan ruang dukungan yang aman, tidak menghakimi, dan terjaga kerahasiaannya.",
      kelas_hasil_utama: "psychological_support",
      kelas_hasil_sekunder: ["understand", "prepare"],
      jalur_dukungan_utama: "psychological_support",
      jalur_dukungan_sekunder: ["self_guided_resource", "hr_workplace_support"],
      langkah_dasar: [
        {
          kode_langkah: "practice_non_clinical_grounding",
          judul_langkah: "Terapkan Langkah Regulasi Emosi & Pemulihan Energi Harian",
          deskripsi_langkah:
            "Gunakan panduan regulasi emosi non-klinis dan beri ruang istirahat dari tuntutan pekerjaan yang menguras energi mental.",
          alasan_relevansi:
            "Membantu menurunkan ketegangan awal agar Anda dapat meninjau situasi dengan lebih tenang.",
          id_tipe_dukungan: "self_guided_resource",
          tautan_fitur_internal: "/journey#psychological-support",
        },
        {
          kode_langkah: "prepare_counseling_consultation",
          judul_langkah: "Susun Catatan Persiapan Konsultasi Psikolog atau Konselor",
          deskripsi_langkah:
            "Gunakan ruang Persiapan Percakapan (tersimpan khusus di sesi peramban Anda) untuk merangkum kondisi yang Anda rasakan sebelum sesi konseling.",
          alasan_relevansi:
            "Memudahkan Anda memulai pembicaraan dengan profesional psikologi tanpa takut ada hal penting yang terlewat.",
          id_tipe_dukungan: "psychological_support",
          tautan_fitur_internal: "/prepare?recipient=psychologist&issue=emotional_support",
        },
      ],
    },
    aturan_subkategori: {},
  },
};
