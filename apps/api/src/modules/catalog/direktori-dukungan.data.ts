import {
  type ItemDirektoriDukungan,
  type ResponsDirektoriDukungan,
  skema_respons_direktori_dukungan,
} from "@voxera/contracts";

/**
 * Direktori navigasi kanal dukungan kerja dan rujukan profesional (Data Referensi / Edukasi MVP).
 * Tidak mencantumkan klaim ketersediaan jadwal nyata, tarif, atau pemesanan langsung.
 */
export const DAFTAR_ITEM_DIREKTORI_DUKUNGAN: ItemDirektoriDukungan[] = [
  {
    kode_sumber_daya: "dir_psikolog_klinis_kerja",
    nama_layanan: "Layanan Konsultasi Psikolog Berlisensi (Panduan Rujukan: Data Edukasi/Demo)",
    id_tipe_dukungan: "psychological_support",
    kategori_layanan: "psychological",
    deskripsi_peran:
      "Psikolog dapat memberikan asesmen dan intervensi psikologis profesional sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya. Pendekatan layanan tiap profesional dapat berbeda sesuai bidang keahlian dan kebutuhan pengguna.",
    kapan_tepat_digunakan: [
      "Saat tekanan kerja atau kelelahan emosional mulai mengganggu tidur, konsentrasi, atau fungsi keseharian.",
      "Saat Anda membutuhkan ruang evaluasi psikologis yang rahasia di luar struktur organisasi kantor.",
    ],
    batas_kewenangan: [
      "Tidak mengeluarkan putusan hukum ketenagakerjaan atau mengubah kebijakan perusahaan secara langsung; cakupan layanan mengikuti kompetensi dan ruang lingkup praktik masing-masing psikolog.",
    ],
    harapan_kerahasiaan:
      "Dijamin oleh Kode Etik Psikologi Indonesia; hasil sesi tidak dibagikan kepada pemberi kerja tanpa persetujuan tertulis.",
    persiapan_sebelum_menghubungi: [
      "Catat sejak kapan beban emosional dirasakan dan situasi kerja utama yang memicunya.",
      "Gunakan alat Persiapan Percakapan VEXORA (target: Psikolog) untuk menyusun ringkasan sesi lokal.",
    ],
  },
  {
    kode_sumber_daya: "dir_konselor_kesejahteraan_kerja",
    nama_layanan:
      "Konselor Kesejahteraan Kerja / EAP Independen (Panduan Rujukan: Data Edukasi/Demo)",
    id_tipe_dukungan: "psychological_support",
    kategori_layanan: "psychological",
    deskripsi_peran:
      "Konselor profesional untuk pendampingan jangka pendek, pemetaan strategi koping kerja, serta pengelolaan stres situasional sesuai ruang lingkup konselingnya.",
    kapan_tepat_digunakan: [
      "Saat membutuhkan teman berpikir profesional untuk mengurai kebingungan atau stres kerja awal.",
      "Saat ingin melatih strategi regulasi emosi dan komunikasi asertif terkait pekerjaan.",
    ],
    batas_kewenangan: [
      "Fokus pada konseling suportif dan koping adaptif sesuai kompetensi konselor; merujuk ke psikolog sesuai kualifikasi bila diperlukan asesmen psikologis lebih lanjut.",
    ],
    harapan_kerahasiaan:
      "Kerahasiaan sesi konseling individu dijaga; pastikan memahami kebijakan privasi penyedia EAP organisasi Anda.",
    persiapan_sebelum_menghubungi: [
      "Identifikasi 1 sampai 2 situasi kerja spesifik yang paling ingin Anda urai dalam sesi konseling.",
      "Siapkan harapan dukungan jangka pendek menggunakan lembar Persiapan Percakapan VEXORA.",
    ],
  },
  {
    kode_sumber_daya: "dir_kanal_hr_hubungan_industrial",
    nama_layanan: "Fungsi SDM / HR People Partner & Hubungan Industrial Internal (Panduan Kanal)",
    id_tipe_dukungan: "hr_workplace_support",
    kategori_layanan: "workplace_hr",
    deskripsi_peran:
      "Kanal resmi organisasi untuk klarifikasi kebijakan internal, fasilitasi konflik lintas peran, penyesuaian beban/peran, serta pelaporan pelanggaran kode etik.",
    kapan_tepat_digunakan: [
      "Saat diskusi langsung dengan atasan tidak memungkinkan atau melibatkan atasan langsung.",
      "Saat membutuhkan klarifikasi resmi mengenai kontrak, hak cuti, lembur, atau prosedur pengaduan internal.",
    ],
    batas_kewenangan: [
      "HR memiliki mandat menjaga kepatuhan kebijakan organisasi dan bukan kuasa hukum pribadi karyawan.",
    ],
    harapan_kerahasiaan:
      "Laporan ditangani secara terbatas sesuai prosedur internal, namun tindak lanjut formal dapat memerlukan verifikasi pihak terkait.",
    persiapan_sebelum_menghubungi: [
      "Susun kronologi kejadian secara objektif beserta waktu dan dampak terhadap pekerjaan.",
      "Tentukan secara spesifik bentuk fasilitasi atau klarifikasi kebijakan yang Anda minta dari HR.",
    ],
  },
  {
    kode_sumber_daya: "dir_satgas_perlindungan_pekerja",
    nama_layanan:
      "Satgas Pencegahan dan Penanganan Kekerasan Seksual di Perusahaan, Jika Tersedia / Telah Dibentuk (Panduan Kanal)",
    id_tipe_dukungan: "employee_protection",
    kategori_layanan: "immediate_safety",
    deskripsi_peran:
      "Satgas Pencegahan dan Penanganan Kekerasan Seksual di perusahaan, jika tersedia / telah dibentuk (berdasarkan Kepmenaker No. 88 Tahun 2023), berfungsi menerima pengaduan, melindungi pelapor/korban dari retaliasi, dan menindaklanjuti kasus kekerasan atau pelecehan seksual di tempat kerja. Apabila Satgas internal belum tersedia di perusahaan Anda, akses kanal HR independen atau jalur pendampingan hukum/eksternal.",
    kapan_tepat_digunakan: [
      "Saat mengalami atau menyaksikan pelecehan seksual, intimidasi serius, atau kekerasan di lingkungan kerja.",
      "Saat membutuhkan perlindungan kerahasiaan dan pengamanan posisi kerja dari risiko tindakan balasan.",
    ],
    batas_kewenangan: [
      "Berwenang melakukan pemeriksaan internal dan rekomendasi perlindungan kerja di perusahaan (jika telah dibentuk); proses pidana tetap melalui aparat penegak hukum sesuai UU TPKS.",
    ],
    harapan_kerahasiaan:
      "Wajib menerapkan prinsip kerahasiaan identitas pelapor/korban dan perlindungan dari retaliasi.",
    persiapan_sebelum_menghubungi: [
      "Simpan catatan waktu, tempat, dan bukti komunikasi di perangkat pribadi yang aman.",
      "Sampaikan kebutuhan pengamanan sementara (misalnya pemisahan jalur koordinasi dengan terlapor).",
    ],
  },
  {
    kode_sumber_daya: "dir_pendamping_hukum_ketenagakerjaan",
    nama_layanan:
      "Lembaga Bantuan Hukum (LBH) / Serikat Pekerja / Mediator Disnaker (Panduan Rujukan: Data Edukasi/Demo)",
    id_tipe_dukungan: "legal_support",
    kategori_layanan: "legal",
    deskripsi_peran:
      "Pendampingan literasi dan advokasi hak ketenagakerjaan berdasarkan UU No. 27 Tahun 2026 serta mekanisme penyelesaian perselisihan hubungan industrial (UU No. 2 Tahun 2004). Cakupan layanan tiap kanal (serikat pekerja, LBH, atau mediator Disnaker) berbeda sesuai mandat kelembagaannya.",
    kapan_tepat_digunakan: [
      "Saat menghadapi pemotongan upah sepihak, penahanan dokumen, atau tekanan menandatangani pengunduran diri/PHK.",
      "Saat perundingan internal (bipartit) membutuhkan pendampingan hukum atau mediasi Dinas Ketenagakerjaan.",
    ],
    batas_kewenangan: [
      "Memberikan telaah hukum dan pendampingan prosedur bipartit/mediasi berdasarkan dokumen dan fakta yang diverifikasi sesuai kewenangan masing-masing lembaga.",
    ],
    harapan_kerahasiaan:
      "Konsultasi hukum awal bersifat rahasia antara pekerja dan pendamping hukum.",
    persiapan_sebelum_menghubungi: [
      "Kumpulkan salinan kontrak kerja (PKWT/PKWTT), slip upah, peraturan perusahaan/PKB, dan korespondensi tertulis.",
      "Susun ringkasan kronologis menggunakan alat Persiapan Percakapan VEXORA (target: Profesional Hukum).",
    ],
  },
  {
    kode_sumber_daya: "dir_konsultan_pengembangan_karier",
    nama_layanan:
      "Konsultan Pengembangan Karier & Mentor Profesional (Panduan Rujukan: Data Edukasi/Demo)",
    id_tipe_dukungan: "career_support",
    kategori_layanan: "career",
    deskripsi_peran:
      "Pendampingan reflektif dan praktis untuk menyusun peta kompetensi, strategi adaptasi kerja digital, serta perencanaan transisi atau pertumbuhan karier.",
    kapan_tepat_digunakan: [
      "Saat merasa stagnan, kehilangan arah makna kerja, atau menghadapi perubahan peran akibat otomasi/digitalisasi.",
      "Saat ingin mempersiapkan diskusi perkembangan karier tahunan atau rencana peningkatan keahlian.",
    ],
    batas_kewenangan: [
      "Berfokus pada pemetaan kompetensi dan strategi karier; tidak menangani sengketa hukum atau terapi klinis.",
    ],
    harapan_kerahasiaan:
      "Diskusi perencanaan karier bersifat pribadi dan berorientasi pada tujuan pertumbuhan Anda.",
    persiapan_sebelum_menghubungi: [
      "Selesaikan Refleksi Makna Kerja & Adaptasi Digital di VEXORA untuk mengenali prioritas kebutuhan kerja Anda.",
      "Catat keahlian utama yang ingin diperkuat dalam 6 bulan ke depan.",
    ],
  },
];

export const DATA_DIREKTORI_DUKUNGAN: ResponsDirektoriDukungan =
  skema_respons_direktori_dukungan.parse({
    daftar_layanan: DAFTAR_ITEM_DIREKTORI_DUKUNGAN,
  });
