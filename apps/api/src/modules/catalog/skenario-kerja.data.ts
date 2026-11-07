import {
  type ResponsDaftarSkenario,
  type SkenarioInteraktif,
  skema_respons_daftar_skenario,
} from "@voxera/contracts";

const daftar_skenario_mentah: SkenarioInteraktif[] = [
  {
    id_skenario: "skenario_beban_dan_lembur",
    judul: "Tambahan Proyek Mendadak & Ekspektasi Selalu Aktif di Luar Jam Kerja",
    id_pilar: "work_wellbeing",
    id_masalah_terkait: "workload_pressure",
    narasi_situasi:
      "Selama tiga minggu berturut-turut, Anda menerima tambahan tugas lintas proyek setiap menjelang akhir jam kerja disertai pesan instan pada malam hari. Ketika Anda mencoba menyelesaikan semuanya sendiri, waktu istirahat Anda berkurang drastis dan kesalahan mulai muncul pada tugas inti.",
    pertanyaan_keputusan:
      "Langkah mana yang paling membantu menata kembali beban kerja sekaligus menjaga batas profesional dan hak waktu istirahat Anda?",
    daftar_opsi: [
      {
        id_opsi: "opsi_terima_diam_diam",
        label_tindakan:
          "Tetap mengerjakan seluruh tambahan tugas di malam hari tanpa menyampaikan kendala",
        pertimbangan_utama:
          "Menghindari ketegangan jangka pendek, tetapi menyembunyikan kapasitas riil tim dari pengambil keputusan.",
        implikasi_potensial:
          "Kelelahan emosional dan kognitif meningkat, risiko kesalahan kerja membesar, dan pola kerja di luar jam normal dianggap sebagai kapasitas standar baru.",
        opsi_dukungan_relevan: ["self_guided_resource", "manager_discussion"],
        pendekatan_alternatif:
          "Petakan daftar tugas aktif beserta estimasi waktu penyelesaian sebelum menyetujui tenggat baru.",
      },
      {
        id_opsi: "opsi_negosiasi_prioritas_terukur",
        label_tindakan:
          "Menyusun daftar prioritas tertulis dan mendiskusikan penyesuaian tenggat atau pencatatan lembur bersama atasan",
        pertimbangan_utama:
          "Menggunakan komunikasi berbasis fakta (problem-focused coping) serta merujuk pada kapasitas kerja dan aturan waktu kerja.",
        implikasi_potensial:
          "Atasan memperoleh gambaran objektif mengenai trade-off antar-proyek, serta batas jam kerja dan mekanisme lembur menjadi lebih jelas.",
        opsi_dukungan_relevan: ["manager_discussion", "legal_information"],
        pendekatan_alternatif:
          "Bila atasan menolak berdiskusi, dokumentasikan kesepakatan tugas melalui email resmi dan konsultasikan dengan HR.",
      },
      {
        id_opsi: "opsi_tolak_tanpa_konteks",
        label_tindakan:
          "Mengabaikan pesan tugas baru tanpa penjelasan kapasitas atau usulan jadwal",
        pertimbangan_utama:
          "Melindungi waktu istirahat sesaat, tetapi berisiko menimbulkan kesalahpahaman koordinasi kerja.",
        implikasi_potensial:
          "Masalah akar berupa ketidaksinkronan beban kerja tim tidak terpecahkan dan dapat memicu konflik peran.",
        opsi_dukungan_relevan: ["manager_discussion", "hr_workplace_support"],
        pendekatan_alternatif:
          "Sampaikan batas ketersediaan waktu kerja secara tenang disertai opsi jadwal pengerjaan pada hari kerja berikutnya.",
      },
    ],
    pelajaran_multidisiplin:
      "Psikologi Kerja (Pertemuan 4: Effective Work, Job Demands & Permenaker No. 5 Tahun 2018) menekankan bahwa beban kerja berlebih memerlukan penataan prioritas struktural, sementara UU No. 27 Tahun 2026 melindungi batas waktu kerja dan hak kompensasi lembur.",
    tautan_perjalanan_dukungan: "/navigate?issue=workload_pressure",
  },
  {
    id_skenario: "skenario_intimidasi_atasan",
    judul: "Perlakuan Merendahkan oleh Atasan Langsung & Kekhawatiran Retaliasi",
    id_pilar: "safe_workplace",
    id_masalah_terkait: "bullying_harassment",
    narasi_situasi:
      "Dalam beberapa rapat tim, atasan langsung Anda melontarkan komentar yang merendahkan martabat pribadi Anda dan mengancam akan menghambat penilaian kinerja apabila Anda mempertanyakan instruksinya.",
    pertanyaan_keputusan:
      "Bagaimana cara menavigasi situasi ini dengan mengutamakan keamanan psikologis dan perlindungan dari risiko retaliasi?",
    daftar_opsi: [
      {
        id_opsi: "opsi_konfrontasi_sendiri_tanpa_catatan",
        label_tindakan:
          "Menghadapi atasan secara emosional seorang diri tanpa dokumentasi kejadian",
        pertimbangan_utama:
          "Ketimpangan wewenang struktural membuat konfrontasi tunggal berisiko memicu retaliasi tanpa bukti pendukung.",
        implikasi_potensial:
          "Situasi dapat diputarbalikkan menjadi isu ketidakpatuhan kerja dan meningkatkan tekanan psikologis Anda.",
        opsi_dukungan_relevan: ["employee_protection", "hr_workplace_support"],
        pendekatan_alternatif:
          "Gunakan mekanisme melewati atasan langsung (Chain-of-Command Guardrail) dan siapkan catatan kronologis terlebih dahulu.",
      },
      {
        id_opsi: "opsi_dokumentasi_dan_kanal_aman",
        label_tindakan:
          "Menyusun kronologi faktual di sesi pribadi dan mengakses kanal HR independen / Satgas Pencegahan serta dukungan psikologis",
        pertimbangan_utama:
          "Memisahkan jalur pelaporan dari pihak yang menjadi sumber intimidasi sambil menjaga stabilitas emosional.",
        implikasi_potensial:
          "Anda memiliki catatan waktu dan kejadian yang terstruktur serta mengakses kanal yang memiliki mandat pencegahan kekerasan/perundungan di tempat kerja.",
        opsi_dukungan_relevan: [
          "employee_protection",
          "hr_workplace_support",
          "psychological_support",
        ],
        pendekatan_alternatif:
          "Siapkan draf pembicaraan menggunakan alat Persiapan Situasi sebelum menghubungi HR atau konselor.",
      },
      {
        id_opsi: "opsi_menyalahkan_diri_sendiri",
        label_tindakan:
          "Menganggap perlakuan merendahkan tersebut sebagai kelemahan mental pribadi semata",
        pertimbangan_utama:
          "Menginternalisasi perundungan mengabaikan fakta bahwa lingkungan kerja bebas intimidasi adalah bagian dari K3 Psikologi.",
        implikasi_potensial:
          "Berisiko memperburuk kelelahan emosional dan mengikis rasa aman dalam bekerja.",
        opsi_dukungan_relevan: ["psychological_support", "employee_protection"],
        pendekatan_alternatif:
          "Jangkau dukungan psikoedukasi atau konselor profesional untuk memulihkan perspektif dan rasa aman Anda.",
      },
    ],
    pelajaran_multidisiplin:
      "Ketika atasan langsung menjadi sumber intimidasi atau pelecehan, keamanan karyawan menuntut jalur pelaporan yang melewati atasan tersebut (Chain-of-Command Bypass) sejalan dengan prinsip struktur & budaya organisasi (Pertemuan 3) serta Kepmenaker No. 88 Tahun 2023.",
    tautan_perjalanan_dukungan: "/navigate?issue=bullying_harassment",
  },
  {
    id_skenario: "skenario_hak_dan_kontrak",
    judul: "Permintaan Mendadak Menandatangani Surat Pengunduran Diri",
    id_pilar: "know_your_rights",
    id_masalah_terkait: "employment_rights",
    narasi_situasi:
      "Anda dipanggil ke pertemuan mendadak dan diminta menandatangani draf surat pengunduran diri hari itu juga dengan alasan efisiensi organisasi, padahal Anda tidak berniat mengundurkan diri secara sukarela.",
    pertanyaan_keputusan:
      "Langkah mana yang paling bijaksana untuk melindungi hak normatif ketenagakerjaan Anda secara tertib?",
    daftar_opsi: [
      {
        id_opsi: "opsi_tandatangan_karena_panik",
        label_tindakan:
          "Langsung menandatangani surat pengunduran diri saat itu juga karena merasa terdesak",
        pertimbangan_utama:
          "Penandatanganan pengunduran diri sukarela memiliki konsekuensi hukum yang berbeda dari Pemutusan Hubungan Kerja (PHK).",
        implikasi_potensial:
          "Dapat menghilangkan atau mengurangi hak kompensasi normatif yang seharusnya dilindungi dalam prosedur PHK resmi.",
        opsi_dukungan_relevan: ["legal_information", "legal_support"],
        pendekatan_alternatif:
          "Sampaikan secara sopan bahwa Anda memerlukan waktu untuk membaca dan mempelajari dokumen tersebut secara utuh.",
      },
      {
        id_opsi: "opsi_minta_waktu_dan_telaah_hak",
        label_tindakan:
          "Meminta salinan dokumen serta waktu peninjauan, lalu mempelajari hak dalam UU No. 27 Tahun 2026 & mekanisme bipartit UU PPHI",
        pertimbangan_utama:
          "Menjaga ketenangan psikologis sambil memastikan setiap langkah didasarkan pada informasi hukum ketenagakerjaan yang akurat.",
        implikasi_potensial:
          "Anda dapat menyiapkan poin klarifikasi tertulis atau berkonsultasi dengan pendamping hukum/serikat pekerja sebelum mengambil keputusan.",
        opsi_dukungan_relevan: ["legal_information", "legal_support", "hr_workplace_support"],
        pendekatan_alternatif:
          "Gunakan alat Persiapan Percakapan dengan target Profesional Hukum untuk merangkum riwayat kontrak kerja Anda.",
      },
      {
        id_opsi: "opsi_debat_tanpa_dokumentasi",
        label_tindakan: "Berdebat lisan tanpa menyimpan catatan pertemuan atau dokumen kontrak",
        pertimbangan_utama:
          "Perselisihan hubungan industrial memerlukan rekam jejak komunikasi dan dokumen perjanjian kerja yang jelas.",
        implikasi_potensial:
          "Menyulitkan proses klarifikasi bipartit maupun mediasi apabila terjadi perbedaan klaim di kemudian hari.",
        opsi_dukungan_relevan: ["legal_information", "employee_protection"],
        pendekatan_alternatif:
          "Catat waktu pertemuan, pihak yang hadir, dan pokok pembicaraan di catatan pribadi Anda.",
      },
    ],
    pelajaran_multidisiplin:
      "Persoalan hak dasar dan kontrak kerja (Faktor Hygiene dalam teori Herzberg pada Pertemuan 2: Need / Motivation Theories) tidak boleh direduksi menjadi isu motivasi pribadi; literasi UU No. 27 Tahun 2026 dan UU No. 2 Tahun 2004 (PPHI) membantu pekerja menempuh jalur klarifikasi dan perundingan bipartit secara bermartabat.",
    tautan_perjalanan_dukungan: "/navigate?issue=employment_rights",
  },
  {
    id_skenario: "skenario_adaptasi_digital_dan_karier",
    judul: "Transisi Sistem Kerja Berbasis AI & Ketidakjelasan Ekspektasi Kompetensi",
    id_pilar: "career_growth",
    id_masalah_terkait: "digital_adaptation",
    narasi_situasi:
      "Tim Anda mulai menerapkan alur kerja digital dan otomasi baru secara cepat. Tanpa panduan yang jelas, Anda merasa cemas tertinggal secara kompetensi sekaligus kewalahan oleh banjir notifikasi di banyak aplikasi.",
    pertanyaan_keputusan:
      "Pendekatan mana yang paling konstruktif untuk memulihkan rasa penguasaan kompetensi (Competence) dan kejelasan kerja Anda?",
    daftar_opsi: [
      {
        id_opsi: "opsi_menarik_diri_dari_perubahan",
        label_tindakan: "Menghindari penggunaan sistem baru dan memendam kecemasan sendiri",
        pertimbangan_utama:
          "Penghindaran (avoidance coping) justru memperkuat rasa tidak berdaya terhadap perubahan teknologi kerja.",
        implikasi_potensial:
          "Kesenjangan keterampilan semakin lebar dan menurunkan kepuasan serta makna kerja.",
        opsi_dukungan_relevan: ["career_support", "self_guided_resource"],
        pendekatan_alternatif:
          "Pecah kebutuhan adaptasi menjadi langkah belajar bertahap dan mintakan panduan alur kerja kepada tim.",
      },
      {
        id_opsi: "opsi_pemetaan_kompetensi_dan_norma_digital",
        label_tindakan:
          "Memetakan bagian alur digital yang membutuhkan pelatihan dan mengusulkan penyelarasan kanal komunikasi bersama atasan",
        pertimbangan_utama:
          "Memenuhi kebutuhan dasar otonomi (Autonomy) dan penguasaan keahlian (Competence) dalam Self-Determination Theory.",
        implikasi_potensial:
          "Ekspektasi penggunaan alat baru menjadi terukur dan beban kognitif akibat fragmentasi pesan dapat dikurangi.",
        opsi_dukungan_relevan: ["career_support", "manager_discussion"],
        pendekatan_alternatif:
          "Gunakan fitur Refleksi Makna Kerja & Adaptasi Digital untuk menyusun rencana pengembangan diri.",
      },
      {
        id_opsi: "opsi_multitasking_tanpa_batas",
        label_tindakan: "Membuka seluruh kanal notifikasi sepanjang waktu agar terlihat responsif",
        pertimbangan_utama:
          "Pergantian fokus terus-menerus menguras kapasitas perhatian tanpa meningkatkan kualitas hasil kerja.",
        implikasi_potensial:
          "Meningkatkan kelelahan digital dan mengaburkan fokus pada kontribusi kerja yang bermakna.",
        opsi_dukungan_relevan: ["self_guided_resource", "career_support"],
        pendekatan_alternatif:
          "Sepakati waktu kerja fokus dan saluran komunikasi utama bersama tim.",
      },
    ],
    pelajaran_multidisiplin:
      "Psikologi Kerja UNTAR (Pertemuan 1, 2 & 5) menunjukkan bahwa adaptasi kerja di era digital tumbuh optimal ketika kebutuhan kompetensi, otonomi, dan kejelasan makna kerja didukung melalui komunikasi pengembangan yang terstruktur.",
    tautan_perjalanan_dukungan: "/navigate?issue=digital_adaptation",
  },
];

export const DATA_SKENARIO_KERJA: ResponsDaftarSkenario = skema_respons_daftar_skenario.parse({
  daftar_skenario: daftar_skenario_mentah,
});
