import type {
  DimensiMaknaKerja,
  FollowUpStepStatus,
  GuardrailWarningCode,
  IssueId,
  JourneyStatus,
  KebutuhanSdtKerja,
  OrientasiMaknaKerja,
  OutcomeClass,
  PillarId,
  ProfessionalReferralReason,
  PsychologicalBoundaryLayer,
  PsychologicalSupportCategory,
  RecipientType,
  SpecificIssueId,
  SupportTypeId,
} from "@voxera/contracts";

export interface InfoDomainMasalah {
  id: IssueId;
  judul: string;
  subjudul_singkat: string;
  contoh_cepat: string;
  id_pilar: PillarId;
  tag_kategori: string;
}

export const DAFTAR_KARTU_MASALAH_BERANDA: InfoDomainMasalah[] = [
  {
    id: "workload_pressure",
    judul: "Tekanan Beban Kerja & Jam Kerja",
    subjudul_singkat:
      "Volume tugas menumpuk, tenggat tidak realistis, atau tuntutan aktif di luar jam kerja.",
    contoh_cepat: "Target bertambah terus tanpa penyesuaian waktu atau pencatatan lembur.",
    id_pilar: "work_wellbeing",
    tag_kategori: "Kesejahteraan & Kapasitas",
  },
  {
    id: "workplace_relationships",
    judul: "Konflik & Hubungan Kerja",
    subjudul_singkat:
      "Gesekan komunikasi, koordinasi buntu, atau ketegangan berulang dengan rekan/atasan.",
    contoh_cepat: "Umpan balik menyudutkan atau koordinasi tim sering terhambat.",
    id_pilar: "work_wellbeing",
    tag_kategori: "Relasi & Komunikasi",
  },
  {
    id: "bullying_harassment",
    judul: "Perundungan, Intimidasi & Pelecehan",
    subjudul_singkat:
      "Perlakuan merendahkan, intimidasi verbal/non-verbal, pengucilan, atau pelecehan di lingkungan kerja.",
    contoh_cepat: "Dipermalukan di forum kerja, diancam penilaiannya, atau mengalami pelecehan.",
    id_pilar: "safe_workplace",
    tag_kategori: "Lingkungan Kerja Aman",
  },
  {
    id: "discrimination_fairness",
    judul: "Diskriminasi & Ketidakadilan Perlakuan",
    subjudul_singkat:
      "Pembedaan perlakuan dalam penugasan, evaluasi, atau promosi atas dasar identitas atau bias.",
    contoh_cepat: "Standar penilaian timpang atau hambatan promosi karena gender/usia/kondisi.",
    id_pilar: "safe_workplace",
    tag_kategori: "Kesetaraan & Keadilan",
  },
  {
    id: "role_clarity",
    judul: "Ketidakjelasan Peran & Ekspektasi",
    subjudul_singkat:
      "Batas tanggung jawab kabur, instruksi bertabrakan antar-atasan, atau perluasan tugas sepihak.",
    contoh_cepat: "Menerima arahan yang saling bertentangan dari dua pengambil keputusan.",
    id_pilar: "work_wellbeing",
    tag_kategori: "Struktur & Kejelasan Peran",
  },
  {
    id: "employment_rights",
    judul: "Hak Ketenagakerjaan, Kontrak & Kondisi Kerja",
    subjudul_singkat:
      "Persoalan kontrak PKWT/PKWTT, upah, lembur, cuti, atau tekanan mengundurkan diri/PHK.",
    contoh_cepat: "Pemotongan upah sepihak atau diminta menandatangani surat resign mendadak.",
    id_pilar: "know_your_rights",
    tag_kategori: "Literasi & Perlindungan Hak",
  },
  {
    id: "career_growth",
    judul: "Arah Karier, Makna Kerja & Pengembangan Diri",
    subjudul_singkat:
      "Merasa stagnan, kehilangan makna kerja, atau membutuhkan peta pengembangan kompetensi.",
    contoh_cepat: "Pekerjaan terasa berjalan otomatis tanpa tujuan perkembangan jangka panjang.",
    id_pilar: "career_growth",
    tag_kategori: "Pertumbuhan & Makna Kerja",
  },
  {
    id: "digital_adaptation",
    judul: "Adaptasi Kerja Digital & Kejelasan Alur",
    subjudul_singkat:
      "Kewalahan oleh banjir notifikasi digital, adaptasi sistem AI/otomasi, atau kerja hibrida.",
    contoh_cepat: "Perubahan alat digital cepat tanpa panduan jelas dan interupsi pesan konstan.",
    id_pilar: "career_growth",
    tag_kategori: "Kerja Digital & Kompetensi",
  },
  {
    id: "emotional_support",
    judul: "Kelelahan Emosional & Dukungan Psikologis",
    subjudul_singkat:
      "Merasa terkuras secara emosional akibat situasi kerja atau ingin menyiapkan sesi konseling.",
    contoh_cepat: "Sulit tidur memikirkan kantor dan butuh ruang regulasi emosi yang aman.",
    id_pilar: "professional_support",
    tag_kategori: "Dukungan Psikologis Non-Klinis",
  },
  {
    id: "unsure",
    judul: "Belum Yakin / Masalah Terasa Bercampur",
    subjudul_singkat:
      "Situasi terasa rumit karena melibatkan beberapa hal sekaligus. Mari pilah langkah demi langkah.",
    contoh_cepat:
      "Beban kerja tinggi sekaligus gesekan dengan atasan sehingga bingung mulai dari mana.",
    id_pilar: "work_wellbeing",
    tag_kategori: "Bantuan Pemetaan Awal",
  },
];

export interface InfoPilarProduk {
  id: PillarId;
  judul: string;
  deskripsi: string;
  fokus_disiplin: string;
}

export const DAFTAR_PILAR_PRODUK: InfoPilarProduk[] = [
  {
    id: "work_wellbeing",
    judul: "Kerja & Kesejahteraan",
    deskripsi:
      "Menata kapasitas beban kerja, kejelasan peran, dan komunikasi kerja yang sehat sebelum menguras energi.",
    fokus_disiplin: "Psikologi Kerja (Effective Work & K3 Psikologi)",
  },
  {
    id: "safe_workplace",
    judul: "Lingkungan Kerja Aman",
    deskripsi:
      "Perlindungan dari perundungan, intimidasi, pelecehan, dan retaliasi dengan penjaga jalur pelaporan aman.",
    fokus_disiplin: "Kepmenaker 88/2023, UU TPKS & Struktur Organisasi",
  },
  {
    id: "know_your_rights",
    judul: "Kenali Hak Kerja Anda",
    deskripsi:
      "Literasi hak normatif atas kontrak, upah, waktu kerja, cuti, dan prosedur bipartit tanpa vonis hukum otomatis.",
    fokus_disiplin: "UU No. 27 Tahun 2026 & UU PPHI No. 2 Tahun 2004",
  },
  {
    id: "professional_support",
    judul: "Dukungan Profesional",
    deskripsi:
      "Psikoedukasi non-klinis, strategi koping kerja, dan persiapan terstruktur menuju konselor, psikolog, atau LBH.",
    fokus_disiplin: "Dukungan Non-Klinis & Navigasi Rujukan Sukarela",
  },
  {
    id: "career_growth",
    judul: "Karier & Pertumbuhan",
    deskripsi:
      "Refleksi makna kerja (Job, Career, Calling), pemenuhan kebutuhan kompetensi, dan adaptasi era digital.",
    fokus_disiplin: "Psikologi Kerja (Meaning of Work, SDT & Digital Era)",
  },
];

export const PETA_LABEL_PILAR: Record<PillarId, string> = {
  work_wellbeing: "Kerja & Kesejahteraan",
  safe_workplace: "Lingkungan Kerja Aman",
  know_your_rights: "Kenali Hak Kerja Anda",
  professional_support: "Dukungan Profesional",
  career_growth: "Karier & Pertumbuhan",
};

export const PETA_LABEL_MASALAH: Record<IssueId, string> = {
  workload_pressure: "Tekanan Beban Kerja & Jam Kerja",
  workplace_relationships: "Konflik & Hubungan Kerja",
  bullying_harassment: "Perundungan, Intimidasi & Pelecehan",
  discrimination_fairness: "Diskriminasi & Ketidakadilan Perlakuan",
  role_clarity: "Ketidakjelasan Peran & Ekspektasi Kerja",
  employment_rights: "Hak Ketenagakerjaan, Kontrak & Kondisi Kerja",
  career_growth: "Arah Karier, Makna Kerja & Pengembangan Diri",
  digital_adaptation: "Adaptasi Kerja Digital, Otomasi & Kejelasan Alur",
  emotional_support: "Kelelahan Emosional & Kebutuhan Dukungan Psikologis",
  unsure: "Belum Yakin / Masalah Terasa Bercampur",
};

export const PETA_LABEL_KELAS_HASIL: Record<OutcomeClass, string> = {
  understand: "Pemahaman Situasi & Hak Kerja",
  prepare: "Persiapan Komunikasi & Dokumentasi",
  workplace_support: "Fasilitasi & Dukungan Internal Organisasi",
  employee_protection: "Prioritas Perlindungan & Keamanan Pekerja",
  psychological_support: "Dukungan Psikologis Non-Klinis & Koping",
  legal_support: "Literasi & Navigasi Pendampingan Hukum",
  career_support: "Refleksi Makna Kerja & Pengembangan Karier",
  immediate_safety_redirect: "Pengamanan Diri & Kanal Darurat",
};

export const PETA_LABEL_TIPE_DUKUNGAN: Record<SupportTypeId, string> = {
  self_guided_resource: "Panduan Mandiri & Regulasi Diri",
  manager_discussion: "Diskusi Penyelarasan Bersama Atasan",
  hr_workplace_support: "Kanal SDM / HR & Hubungan Industrial",
  employee_protection: "Kanal Perlindungan Pekerja / Satgas PPKS (Jika Tersedia)",
  psychological_support: "Dukungan Psikologis / Konselor / Psikolog",
  legal_information: "Literasi Regulasi Ketenagakerjaan",
  legal_support: "Pendampingan Hukum / Serikat Pekerja / LBH",
  career_support: "Pengembangan Karier & Adaptasi Digital",
  immediate_safety_redirect: "Perlindungan Keselamatan Segera",
};

export interface InfoPenerimaPercakapan {
  id: RecipientType;
  label: string;
  peran_singkat: string;
  kapan_dipilih: string;
}

export const DAFTAR_PENERIMA_PERCAKAPAN: InfoPenerimaPercakapan[] = [
  {
    id: "manager",
    label: "Atasan Langsung / Manajer",
    peran_singkat: "Penyelarasan prioritas tugas, batas waktu kerja, dan ekspektasi peran harian.",
    kapan_dipilih: "Saat aman berdiskusi langsung mengenai kapasitas dan beban kerja.",
  },
  {
    id: "hr",
    label: "SDM / HR & Hubungan Industrial",
    peran_singkat: "Klarifikasi kebijakan internal, fasilitasi lintas peran, atau pelaporan resmi.",
    kapan_dipilih: "Saat masalah melibatkan atasan langsung atau memerlukan prosedur organisasi.",
  },
  {
    id: "psychologist",
    label: "Psikolog Profesional",
    peran_singkat:
      "Asesmen dan intervensi psikologis profesional sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya.",
    kapan_dipilih:
      "Saat tekanan kerja mengganggu fungsi keseharian, tidur, atau keseimbangan emosi.",
  },
  {
    id: "counselor",
    label: "Konselor Kesejahteraan Kerja",
    peran_singkat: "Pendampingan suportif jangka pendek dan pemetaan strategi koping adaptif.",
    kapan_dipilih: "Saat membutuhkan ruang diskusi rahasia untuk mengurai stres situasional kerja.",
  },
  {
    id: "legal_professional",
    label: "Pendamping Hukum / Serikat / LBH",
    peran_singkat:
      "Telaah dokumen kontrak/upah dan pendampingan prosedur bipartit atau mediasi sesuai kewenangan lembaga.",
    kapan_dipilih: "Saat menghadapi sengketa hak normatif, pemotongan upah, atau tekanan PHK.",
  },
  {
    id: "career_professional",
    label: "Konsultan Karier / Mentor Profesional",
    peran_singkat:
      "Pemetaan kompetensi, refleksi makna kerja, dan strategi adaptasi kerja digital.",
    kapan_dipilih: "Saat merencanakan peningkatan keahlian, kejelasan peran, atau transisi karier.",
  },
];

export const PETA_LABEL_PENERIMA: Record<RecipientType, string> = {
  manager: "Atasan Langsung / Manajer",
  hr: "SDM / HR & Hubungan Industrial",
  psychologist: "Psikolog Profesional",
  counselor: "Konselor Kesejahteraan Kerja",
  legal_professional: "Pendamping Hukum / Serikat / LBH",
  career_professional: "Konsultan Karier / Mentor Profesional",
};

export const PETA_LABEL_KATEGORI_PSIKOLOGIS: Record<PsychologicalSupportCategory, string> = {
  psychoeducation: "Psikoedukasi Kerja",
  coping_strategies: "Strategi Koping Adaptif",
  emotional_regulation: "Regulasi Emosi Sesaat",
  work_related_coping: "Penataan Koping Terkait Tugas",
  professional_consultation_prep: "Persiapan Konsultasi Profesional",
};

export const PETA_LABEL_LAPISAN_BATAS: Record<PsychologicalBoundaryLayer, string> = {
  workplace_issue_navigation: "Lapisan 1: Navigasi Situasi Kerja Non-Klinis",
  psychological_screening_early_indication: "Lapisan 2: Skrining Indikasi Awal (Opsional)",
  non_clinical_psychological_support: "Lapisan 3: Dukungan Psikologis Non-Klinis",
  qualified_professional_assessment: "Lapisan 4: Asesmen Profesional Berkualifikasi",
  clinical_diagnosis_never_by_voxera: "Lapisan 5: Diagnosis Klinis (Tidak Pernah oleh VEXORA)",
};

export const PETA_LABEL_ALASAN_RUJUKAN: Record<ProfessionalReferralReason, string> = {
  explicit_employee_request: "Permintaan eksplisit Anda untuk menyiapkan rujukan profesional",
  approved_screening_referral_condition: "Indikasi dari instrumen skrining yang telah disetujui",
  self_reported_daily_functioning_interference:
    "Laporan mandiri bahwa situasi kerja mulai mengganggu fungsi keseharian",
  approved_ethical_referral_rule: "Aturan rujukan etik perlindungan psikologis",
};

export const PETA_LABEL_STATUS_PERJALANAN: Record<JourneyStatus, string> = {
  aktif: "Aktif Dijalankan",
  ditindaklanjuti: "Sedang Ditindaklanjuti",
  diarsipkan: "Selesai / Diarsipkan",
};

export const PETA_LABEL_STATUS_LANGKAH: Record<FollowUpStepStatus, string> = {
  belum_dimulai: "Belum Dimulai",
  sedang_berjalan: "Sedang Dikerjakan",
  selesai: "Selesai",
  dilewati: "Dilewati",
};

export const PETA_GAYA_PERINGATAN_PENJAGA: Record<
  GuardrailWarningCode,
  { lencana: string; aksen_kartu: string }
> = {
  chain_of_command_bypass: {
    lencana: "Penjaga Jalur Pelaporan Aman",
    aksen_kartu:
      "border-amber-300 bg-amber-50/80 text-amber-950 dark:border-amber-700/80 dark:bg-amber-950/40 dark:text-amber-100",
  },
  hygiene_rights_protection_priority: {
    lencana: "Prioritas Hak Dasar & Faktor Hygiene",
    aksen_kartu:
      "border-teal-300 bg-teal-50/80 text-teal-950 dark:border-teal-700/80 dark:bg-teal-950/40 dark:text-teal-100",
  },
  confidential_psychological_boundary: {
    lencana: "Prioritas Dukungan Profesional",
    aksen_kartu:
      "border-sky-300 bg-sky-50/80 text-sky-950 dark:border-sky-700/80 dark:bg-sky-950/40 dark:text-sky-100",
  },
  non_diagnostic_boundary: {
    lencana: "Batas Etik Non-Diagnostik",
    aksen_kartu:
      "border-slate-300 bg-slate-100/80 text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200",
  },
  non_legal_verdict_boundary: {
    lencana: "Batas Literasi Hukum Non-Adjudikatif",
    aksen_kartu:
      "border-slate-300 bg-slate-100/80 text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200",
  },
};

export interface OpsiDisambiguasiUnsure {
  id_masalah_spesifik: SpecificIssueId;
  kelompok_orientasi: "workload_or_role" | "interpersonal_or_safety" | "rights_or_career";
  judul_pernyataan: string;
  penjelasan_bantu: string;
}

export const DAFTAR_OPSI_DISAMBIGUASI_UNSURE: OpsiDisambiguasiUnsure[] = [
  {
    id_masalah_spesifik: "workload_pressure",
    kelompok_orientasi: "workload_or_role",
    judul_pernyataan:
      "Tugas menumpuk, tenggat tidak realistis, atau jam kerja meluber ke waktu istirahat",
    penjelasan_bantu:
      "Mengambil fokus pada penataan kapasitas kerja, prioritas, dan batas jam kerja.",
  },
  {
    id_masalah_spesifik: "role_clarity",
    kelompok_orientasi: "workload_or_role",
    judul_pernyataan:
      "Instruksi kerja sering bertabrakan atau batas tanggung jawab saya tidak jelas",
    penjelasan_bantu:
      "Mengambil fokus pada klarifikasi deskripsi peran dan penyelarasan ekspektasi tertulis.",
  },
  {
    id_masalah_spesifik: "emotional_support",
    kelompok_orientasi: "workload_or_role",
    judul_pernyataan:
      "Saya merasa terkuras secara emosional dan butuh ruang memulihkan ketenangan diri",
    penjelasan_bantu:
      "Mengambil fokus pada regulasi emosi non-klinis dan persiapan konsultasi suportif.",
  },
  {
    id_masalah_spesifik: "workplace_relationships",
    kelompok_orientasi: "interpersonal_or_safety",
    judul_pernyataan:
      "Ada ketegangan komunikasi atau gesekan kerja sama dengan rekan maupun atasan",
    penjelasan_bantu:
      "Mengambil fokus pada strategi dialog objektif dan perbaikan alur koordinasi kerja.",
  },
  {
    id_masalah_spesifik: "bullying_harassment",
    kelompok_orientasi: "interpersonal_or_safety",
    judul_pernyataan: "Saya mengalami intimidasi, penghinaan berulang, pengucilan, atau pelecehan",
    penjelasan_bantu:
      "Mengambil fokus pada dokumentasi aman, perlindungan dari retaliasi, dan Satgas PPKS perusahaan (jika tersedia / telah dibentuk) atau pendampingan eksternal.",
  },
  {
    id_masalah_spesifik: "discrimination_fairness",
    kelompok_orientasi: "interpersonal_or_safety",
    judul_pernyataan:
      "Saya diperlakukan tidak adil karena latar belakang identitas atau bias penilaian",
    penjelasan_bantu:
      "Mengambil fokus pada bukti kinerja objektif dan prinsip kesetaraan perlakuan kerja.",
  },
  {
    id_masalah_spesifik: "employment_rights",
    kelompok_orientasi: "rights_or_career",
    judul_pernyataan:
      "Ada masalah kontrak kerja, pemotongan upah, hak cuti, atau tekanan mengundurkan diri/PHK",
    penjelasan_bantu:
      "Mengambil fokus pada literasi UU No. 27 Tahun 2026, dokumen kerja, dan mekanisme bipartit.",
  },
  {
    id_masalah_spesifik: "career_growth",
    kelompok_orientasi: "rights_or_career",
    judul_pernyataan:
      "Saya merasa stagnan, kehilangan makna kerja, atau bingung menentukan arah karier",
    penjelasan_bantu:
      "Mengambil fokus pada refleksi makna kerja (Job, Career, Calling) dan rencana keahlian.",
  },
  {
    id_masalah_spesifik: "digital_adaptation",
    kelompok_orientasi: "rights_or_career",
    judul_pernyataan:
      "Saya kewalahan oleh banjir komunikasi digital, perubahan alat AI, atau alur kerja hibrida",
    penjelasan_bantu:
      "Mengambil fokus pada kejelasan norma komunikasi digital dan penguatan kompetensi bertahap.",
  },
];

export const DAFTAR_OPSI_ORIENTASI_MAKNA: Array<{
  nilai: OrientasiMaknaKerja;
  label: string;
  deskripsi: string;
}> = [
  {
    nilai: "job_orientation",
    label: "Orientasi Pekerjaan (Job Orientation)",
    deskripsi:
      "Bekerja terutama untuk menopang kebutuhan hidup, stabilitas finansial, dan waktu di luar kantor.",
  },
  {
    nilai: "career_orientation",
    label: "Orientasi Karier (Career Orientation)",
    deskripsi:
      "Berfokus pada peningkatan kapabilitas, pencapaian profesional, dan kemajuan jenjang peran.",
  },
  {
    nilai: "calling_orientation",
    label: "Orientasi Panggilan (Calling Orientation)",
    deskripsi:
      "Merasakan keterhubungan nilai pribadi yang erat dengan tujuan dan dampak dari pekerjaan.",
  },
  {
    nilai: "exploring_transition",
    label: "Eksplorasi & Penataan Ulang (Sustainable Career Transition)",
    deskripsi:
      "Sedang meninjau kembali kecocokan peran saat ini untuk keberlanjutan karier jangka panjang.",
  },
];

export const DAFTAR_OPSI_DIMENSI_MAKNA: Array<{
  nilai: DimensiMaknaKerja;
  label: string;
  deskripsi: string;
}> = [
  {
    nilai: "positive_meaning_in_work",
    label: "Makna Positif dalam Tugas (Positive Meaning in Work)",
    deskripsi: "Merasakan bahwa tugas harian memiliki kegunaan dan signifikansi nyata.",
  },
  {
    nilai: "meaning_making_through_work",
    label: "Pembentukan Diri melalui Kerja (Meaning Making through Work)",
    deskripsi: "Pekerjaan membantu memperluas wawasan, ketangguhan, dan pemahaman diri.",
  },
  {
    nilai: "greater_good_motivations",
    label: "Kontribusi bagi Sesama (Greater Good Motivations)",
    deskripsi: "Dorongan memberi dampak positif bagi rekan tim, pengguna layanan, atau masyarakat.",
  },
];

export const DAFTAR_OPSI_KEBUTUHAN_SDT: Array<{
  nilai: KebutuhanSdtKerja;
  label: string;
  deskripsi: string;
}> = [
  {
    nilai: "autonomy_control",
    label: "Otonomi & Ruang Kendali (Autonomy)",
    deskripsi: "Memiliki keleluasaan mengatur cara kerja, prioritas, dan pengambilan keputusan.",
  },
  {
    nilai: "competence_mastery",
    label: "Kompetensi & Penguasaan Keahlian (Competence)",
    deskripsi:
      "Merasakan kejelasan standar keberhasilan dan dukungan untuk menguasai keahlian baru.",
  },
  {
    nilai: "relatedness_support",
    label: "Keterhubungan & Dukungan Relasi (Relatedness)",
    deskripsi: "Berada dalam lingkungan kerja yang saling menghargai dan aman secara psikologis.",
  },
];

export const DAFTAR_OPSI_TANTANGAN_DIGITAL: Array<{
  nilai:
    | "information_overload_distraction"
    | "ai_workflow_adaptation"
    | "skill_development_need"
    | "role_clarity_in_digital_work";
  label: string;
  deskripsi: string;
}> = [
  {
    nilai: "information_overload_distraction",
    label: "Banjir Informasi & Interupsi Notifikasi Digital",
    deskripsi: "Fokus kerja sering terpecah oleh banyaknya kanal pesan instan secara bersamaan.",
  },
  {
    nilai: "ai_workflow_adaptation",
    label: "Adaptasi Alur Kerja Berbasis AI & Otomasi Baru",
    deskripsi:
      "Membutuhkan panduan bertahap untuk mengintegrasikan sistem baru ke pekerjaan harian.",
  },
  {
    nilai: "skill_development_need",
    label: "Kebutuhan Peningkatan Keterampilan Digital",
    deskripsi:
      "Ingin menyusun peta belajar yang terfokus agar tidak tertinggal oleh perubahan teknologi.",
  },
  {
    nilai: "role_clarity_in_digital_work",
    label: "Kejelasan Peran & Koordinasi pada Kerja Hibrida/Digital",
    deskripsi:
      "Membutuhkan kesepakatan batas jam kerja dan indikator tugas selesai secara tertulis.",
  },
];
