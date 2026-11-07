import {
  type ItemKatalogMasalah,
  type ResponsKatalogMasalah,
  skema_respons_katalog_masalah,
} from "@voxera/contracts";
import { REFERENSI_AKADEMIK_DAN_HUKUM as REF } from "./referensi-hukum.data.js";

const daftar_katalog_masalah_mentah: ItemKatalogMasalah[] = [
  {
    id_masalah: "workload_pressure",
    judul: "Tekanan Beban Kerja & Jam Kerja",
    ringkasan_situasi:
      "Volume pekerjaan yang terus menumpuk, tenggat waktu tidak realistis, atau tuntutan selalu siap dihubungi di luar jam kerja.",
    contoh_situasi: [
      "Target pekerjaan ditambah terus tanpa penyesuaian tenggat waktu atau sumber daya.",
      "Diharapkan membalas pesan kerja larut malam atau akhir pekan secara terus-menerus.",
      "Merasa kelelahan berkepanjangan hingga sulit berkonsentrasi pada tugas utama.",
    ],
    id_pilar_utama: "work_wellbeing",
    kelas_hasil_default: "prepare",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "subkategori_beban",
        teks_pertanyaan: "Bagian mana dari beban kerja yang paling membebani Anda saat ini?",
        alasan_ditanyakan:
          "Membedakan antara penataan prioritas kerja, batas jam kerja, atau hak kompensasi lembur.",
        daftar_opsi: [
          {
            id_opsi: "excessive_volume",
            label: "Volume tugas terlalu banyak dibandingkan waktu yang tersedia",
            penjelasan_konteks: "Fokus pada negosiasi ulang prioritas dan kapasitas kerja.",
          },
          {
            id_opsi: "unrealistic_deadlines",
            label: "Tenggat waktu mendadak dan berubah-ubah tanpa koordinasi",
            penjelasan_konteks: "Fokus pada penyelarasan ekspektasi bersama pengambil keputusan.",
          },
          {
            id_opsi: "always_on_expectations",
            label: "Tuntutan selalu aktif di luar jam kerja atau lembur tanpa kejelasan",
            penjelasan_konteks: "Melibatkan batas istirahat dan literasi hak waktu kerja.",
          },
        ],
      },
      {
        id_pertanyaan: "sumber_masalah",
        teks_pertanyaan: "Bagaimana respons atasan langsung ketika kapasitas kerja dibicarakan?",
        alasan_ditanyakan:
          "Menentukan apakah diskusi langsung dengan atasan aman dilakukan atau perlu dukungan jalur lain.",
        daftar_opsi: [
          {
            id_opsi: "supportive_or_unaware",
            label: "Terbuka berdiskusi atau belum mengetahui beban penuh saya",
          },
          {
            id_opsi: "direct_supervisor",
            label: "Atasan langsung menolak diskusi atau menekan secara sepihak",
          },
        ],
      },
      {
        id_pertanyaan: "dampak_hak",
        teks_pertanyaan: "Apakah situasi ini melibatkan kerja lembur tanpa pencatatan atau upah?",
        alasan_ditanyakan:
          "Memastikan perlindungan hak normatif waktu kerja dan lembur tidak direduksi menjadi sekadar isu manajemen waktu pribadi.",
        daftar_opsi: [
          {
            id_opsi: "normal_hours",
            label: "Masih dalam kerangka jam kerja atau fleksibilitas yang disepakati",
          },
          {
            id_opsi: "unpaid_overtime",
            label: "Ada penugasan lembur rutin tanpa persetujuan atau kompensasi yang jelas",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PERMENAKER_K3_2018,
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
    ],
  },
  {
    id_masalah: "workplace_relationships",
    judul: "Konflik & Hubungan Kerja",
    ringkasan_situasi:
      "Ketegangan komunikasi, gesekan kerja sama tim, atau kesalahpahaman berulang dengan rekan kerja maupun atasan.",
    contoh_situasi: [
      "Koordinasi lintas tim sering buntu karena saling lempar tanggung jawab.",
      "Umpan balik kerja disampaikan secara menyudutkan di depan anggota tim lain.",
      "Komunikasi dengan atasan atau rekan terasa dingin dan menghambat pekerjaan.",
    ],
    id_pilar_utama: "work_wellbeing",
    kelas_hasil_default: "prepare",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "peran_terlibat",
        teks_pertanyaan: "Dengan siapa gesekan atau hambatan komunikasi ini terutama terjadi?",
        alasan_ditanyakan:
          "Menyesuaikan strategi komunikasi serta menjaga keamanan posisi Anda dalam struktur organisasi.",
        daftar_opsi: [
          {
            id_opsi: "peer_coworker",
            label: "Rekan kerja setara atau anggota tim lintas divisi",
          },
          {
            id_opsi: "direct_supervisor",
            label: "Atasan langsung yang memiliki wewenang penilaian kerja",
          },
          {
            id_opsi: "team_dynamics",
            label: "Dinamika kelompok atau budaya komunikasi satu tim",
          },
        ],
      },
      {
        id_pertanyaan: "pola_kejadian",
        teks_pertanyaan: "Seberapa sering gesekan ini terjadi?",
        alasan_ditanyakan:
          "Membedakan kesalahpahaman situasional dari pola relasi kerja yang membutuhkan fasilitasi pihak ketiga.",
        daftar_opsi: [
          {
            id_opsi: "isolated_incident",
            label: "Baru terjadi satu-dua kali pada proyek tertentu",
          },
          {
            id_opsi: "ongoing_repeated",
            label: "Berulang terus-menerus dan mulai mengganggu psikologis atau kinerja",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_6,
      REF.PSIKOLOGI_PERTEMUAN_2,
    ],
  },
  {
    id_masalah: "bullying_harassment",
    judul: "Perundungan, Intimidasi & Pelecehan",
    ringkasan_situasi:
      "Perlakuan merendahkan, intimidasi verbal/non-verbal, pengucilan sengaja, atau tindakan pelecehan di lingkungan kerja.",
    contoh_situasi: [
      "Dihina, dipermalukan, atau diteriaki secara berulang dalam forum kerja.",
      "Mengalami komentar, isyarat, atau tindakan bernuansa seksual yang tidak diinginkan.",
      "Diancam akan dipersulit penilaian kerjanya bila menyampaikan keberatan.",
    ],
    id_pilar_utama: "safe_workplace",
    kelas_hasil_default: "employee_protection",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "bentuk_perlakuan",
        teks_pertanyaan: "Bentuk perlakuan mana yang paling mendekati situasi yang Anda hadapi?",
        alasan_ditanyakan:
          "Menentukan kanal perlindungan internal/eksternal serta rujukan pendampingan yang paling relevan.",
        daftar_opsi: [
          {
            id_opsi: "verbal_intimidation_bullying",
            label: "Intimidasi verbal, penghinaan, atau perundungan berulang",
          },
          {
            id_opsi: "sexual_harassment",
            label: "Pelecehan seksual verbal, fisik, atau digital di lingkungan kerja",
          },
          {
            id_opsi: "social_exclusion_sabotage",
            label: "Pengucilan sistematis atau penghambatan akses informasi kerja",
          },
        ],
      },
      {
        id_pertanyaan: "sumber_masalah",
        teks_pertanyaan: "Siapa pihak yang melakukan perlakuan tersebut?",
        alasan_ditanyakan:
          "Mengaktifkan penjaga keamanan jalur pelaporan (Chain-of-Command Guardrail) bila melibatkan atasan langsung.",
        daftar_opsi: [
          {
            id_opsi: "direct_supervisor",
            label: "Atasan langsung atau pejabat struktural di atas saya",
          },
          {
            id_opsi: "peer_or_other",
            label: "Rekan kerja setara, pihak lintas divisi, atau klien",
          },
        ],
      },
      {
        id_pertanyaan: "kekhawatiran_retaliasi",
        teks_pertanyaan: "Apakah Anda khawatir akan ada tindakan balasan (retaliasi) bila melapor?",
        alasan_ditanyakan:
          "Memprioritaskan langkah dokumentasi kronologis pribadi dan kanal perlindungan yang menjaga kerahasiaan.",
        daftar_opsi: [
          {
            id_opsi: "yes",
            label: "Ya, ada kekhawatiran retaliasi terhadap posisi atau keamanan saya",
          },
          {
            id_opsi: "no_or_unsure",
            label: "Belum tahu atau ingin memahami prosedur aman terlebih dahulu",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.KEPMENAKER_88_2023,
      REF.UU_TPKS_2022,
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
    ],
  },
  {
    id_masalah: "discrimination_fairness",
    judul: "Diskriminasi & Ketidakadilan Perlakuan",
    ringkasan_situasi:
      "Perlakuan tidak setara dalam penugasan, promosi, penilaian, atau fasilitas kerja berdasarkan latar belakang identitas atau kondisi pribadi.",
    contoh_situasi: [
      "Kesempatan promosi atau pelatihan dihambat karena gender, usia, kehamilan, atau latar belakang.",
      "Standar evaluasi kinerja diterapkan secara timpang dibandingkan rekan dengan peran setara.",
      "Permintaan akomodasi kerja yang wajar ditolak tanpa alasan objektif.",
    ],
    id_pilar_utama: "safe_workplace",
    kelas_hasil_default: "prepare",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "konteks_ketidakadilan",
        teks_pertanyaan: "Dalam aspek apa ketidakadilan atau pembedaan perlakuan tersebut tampak?",
        alasan_ditanyakan:
          "Membantu memetakan hak kesetaraan kerja serta persiapan data objektif yang relevan.",
        daftar_opsi: [
          {
            id_opsi: "identity_based_discrimination",
            label: "Perlakuan berbeda terkait gender, kehamilan, usia, agama, atau disabilitas",
          },
          {
            id_opsi: "unfair_evaluation_promotion",
            label: "Penilaian kinerja atau akses pengembangan karier yang tidak transparan",
          },
          {
            id_opsi: "retaliatory_treatment",
            label: "Perlakuan merugikan setelah menyampaikan pendapat atau hak normatif",
          },
        ],
      },
      {
        id_pertanyaan: "sumber_masalah",
        teks_pertanyaan: "Apakah kebijakan atau perlakuan ini berasal dari atasan langsung Anda?",
        alasan_ditanyakan:
          "Menghindari rute diskusi tunggal ke atasan langsung apabila atasan tersebut merupakan sumber perlakuan tidak adil.",
        daftar_opsi: [
          {
            id_opsi: "direct_supervisor",
            label: "Ya, berasal dari keputusan atau sikap atasan langsung",
          },
          {
            id_opsi: "policy_or_other",
            label: "Berasal dari proses organisasi umum atau pihak lain",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PSIKOLOGI_PERTEMUAN_4,
    ],
  },
  {
    id_masalah: "role_clarity",
    judul: "Ketidakjelasan Peran & Ekspektasi Kerja",
    ringkasan_situasi:
      "Batas tanggung jawab yang kabur (role ambiguity), instruksi bertabrakan dari beberapa pihak (role conflict), atau perubahan mandat tanpa panduan.",
    contoh_situasi: [
      "Menerima arahan yang saling bertentangan dari dua atasan atau pemangku kepentingan.",
      "Deskripsi pekerjaan tidak sesuai dengan tugas harian yang dinilai dalam evaluasi.",
      "Lingkup tanggung jawab meluas tanpa kejelasan wewenang pengambilan keputusan.",
    ],
    id_pilar_utama: "work_wellbeing",
    kelas_hasil_default: "prepare",
    skrining_psikologis_relevan: false,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "jenis_ketidakjelasan",
        teks_pertanyaan: "Tantangan peran mana yang paling sering Anda alami?",
        alasan_ditanyakan:
          "Menentukan apakah langkah terbaik berupa penyusunan matriks ekspektasi peran atau penyelarasan lintas atasan.",
        daftar_opsi: [
          {
            id_opsi: "role_ambiguity",
            label: "Target keberhasilan dan batas tanggung jawab tidak pernah dijelaskan",
          },
          {
            id_opsi: "conflicting_instructions",
            label: "Instruksi kerja sering bertabrakan antar-atasan atau antar-divisi",
          },
          {
            id_opsi: "scope_creep",
            label: "Tugas tambahan di luar peran utama terus bertambah secara permanen",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PERMENAKER_K3_2018,
    ],
  },
  {
    id_masalah: "employment_rights",
    judul: "Hak Ketenagakerjaan, Kontrak & Kondisi Kerja",
    ringkasan_situasi:
      "Pertanyaan atau kendala seputar kontrak kerja (PKWT/PKWTT), pengupahan, waktu istirahat/cuti, keselamatan kerja, atau ancaman pemutusan hubungan kerja.",
    contoh_situasi: [
      "Perubahan isi kontrak, pemotongan upah, atau penundaan pembayaran hak tanpa kesepakatan.",
      "Kesulitan mengambil hak cuti normatif atau istirahat kerja yang layak.",
      "Diminta menandatangani surat pengunduran diri atau kesepakatan PHK secara mendadak.",
    ],
    id_pilar_utama: "know_your_rights",
    kelas_hasil_default: "understand",
    skrining_psikologis_relevan: false,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "jenis_hak",
        teks_pertanyaan:
          "Aspek hak ketenagakerjaan mana yang sedang ingin Anda pahami atau siapkan?",
        alasan_ditanyakan:
          "Menyajikan informasi literasi hukum kerja yang relevan serta langkah persiapan dokumen secara proporsional.",
        daftar_opsi: [
          {
            id_opsi: "wages_overtime",
            label: "Upah, tunjangan, lembur, atau pemotongan penghasilan",
          },
          {
            id_opsi: "contract_leave_status",
            label: "Status kontrak kerja (PKWT/PKWTT), mutasi, atau hak cuti/istirahat",
          },
          {
            id_opsi: "termination_contract",
            label: "Tekanan mengundurkan diri atau proses Pemutusan Hubungan Kerja (PHK)",
          },
        ],
      },
      {
        id_pertanyaan: "kondisi_komunikasi",
        teks_pertanyaan: "Bagaimana tahapan komunikasi terkait masalah hak ini di tempat kerja?",
        alasan_ditanyakan:
          "Menentukan apakah fokus utama saat ini adalah klarifikasi internal HR atau rujukan konsultasi hukum ketenagakerjaan.",
        daftar_opsi: [
          {
            id_opsi: "initial_clarification",
            label: "Baru ingin memeriksa aturan dan menyiapkan pertanyaan ke HR/manajemen",
          },
          {
            id_opsi: "dispute_or_pressure",
            label: "Sudah ada tekanan menandatangani dokumen atau penolakan hak normatif",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.UU_PELINDUNGAN_KETENAGAKERJAAN_2026,
      REF.UU_PPHI_2004,
      REF.PSIKOLOGI_PERTEMUAN_2,
    ],
  },
  {
    id_masalah: "career_growth",
    judul: "Arah Karier, Makna Kerja & Pengembangan Diri",
    ringkasan_situasi:
      "Merasa stagnan, kehilangan arah atau makna dalam pekerjaan, bingung merencanakan transisi karier, atau membutuhkan penguatan kompetensi.",
    contoh_situasi: [
      "Merasa pekerjaan saat ini berjalan otomatis tetapi kehilangan makna dan tujuan jangka panjang.",
      "Ingin berdiskusi tentang rencana pengembangan kompetensi atau jalur karier secara terstruktur.",
      "Sedang mempertimbangkan apakah perlu bertahan, bernegosiasi peran, atau menyiapkan transisi.",
    ],
    id_pilar_utama: "career_growth",
    kelas_hasil_default: "understand",
    skrining_psikologis_relevan: false,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "fokus_karier",
        teks_pertanyaan: "Apa yang paling Anda butuhkan terkait perjalanan karier Anda saat ini?",
        alasan_ditanyakan:
          "Menghubungkan refleksi makna kerja (Job, Career, Calling) dengan langkah pengembangan praktis.",
        daftar_opsi: [
          {
            id_opsi: "stagnation_meaning",
            label: "Mengeksplorasi kembali makna kerja dan mengatasi rasa jenuh/stagnan",
          },
          {
            id_opsi: "skill_progression",
            label: "Menyusun rencana peningkatan keahlian dan diskusi perkembangan karier",
          },
          {
            id_opsi: "role_transition",
            label: "Menimbang kecocokan peran saat ini dan kesiapan transisi karier",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PSIKOLOGI_PERTEMUAN_6,
    ],
  },
  {
    id_masalah: "digital_adaptation",
    judul: "Adaptasi Kerja Digital, Otomasi & Kejelasan Alur Kerja",
    ringkasan_situasi:
      "Kewalahan menghadapi banjir notifikasi digital, tuntutan adaptasi alat kerja berbasis AI/otomasi, atau kaburnya batas kerja hibrida/jarak jauh.",
    contoh_situasi: [
      "Perubahan sistem digital atau AI yang cepat tanpa pelatihan memadai membuat cemas tertinggal.",
      "Banjir pesan instan di berbagai aplikasi memecah fokus dan menguras energi mental.",
      "Koordinasi kerja jarak jauh/hibrida membuat ekspektasi kehadiran dan hasil kerja tidak sinkron.",
    ],
    id_pilar_utama: "career_growth",
    kelas_hasil_default: "understand",
    skrining_psikologis_relevan: false,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "tantangan_digital",
        teks_pertanyaan: "Aspek kerja digital mana yang paling memengaruhi keseharian kerja Anda?",
        alasan_ditanyakan:
          "Menyediakan strategi adaptasi kerja digital dan persiapan dukungan pelatihan yang tepat sasaran.",
        daftar_opsi: [
          {
            id_opsi: "ai_automation_uncertainty",
            label: "Adaptasi terhadap sistem baru/AI dan kebutuhan peningkatan keterampilan",
          },
          {
            id_opsi: "digital_overload_fragmentation",
            label: "Kelelahan akibat banjir kanal komunikasi dan interupsi digital terus-menerus",
          },
          {
            id_opsi: "remote_hybrid_alignment",
            label: "Kurangnya kejelasan alur koordinasi dan batas kerja pada sistem hibrida/remote",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.PSIKOLOGI_PERTEMUAN_5,
    ],
  },
  {
    id_masalah: "emotional_support",
    judul: "Kelelahan Emosional & Kebutuhan Dukungan Psikologis",
    ringkasan_situasi:
      "Merasa terkuras secara emosional akibat situasi kerja, cemas menghadapi hari kerja, atau ingin mencari ruang dukungan psikologis yang aman.",
    contoh_situasi: [
      "Merasa tegang, sulit tidur, atau kehilangan energi setiap kali memikirkan situasi kantor.",
      "Membutuhkan strategi mengelola emosi saat menghadapi tekanan situasi kerja sehari-hari.",
      "Ingin berkonsultasi dengan konselor atau psikolog tetapi bingung harus mulai menceritakan dari mana.",
    ],
    id_pilar_utama: "professional_support",
    kelas_hasil_default: "psychological_support",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "kebutuhan_dukungan_emosional",
        teks_pertanyaan: "Dukungan seperti apa yang terasa paling membantu bagi Anda saat ini?",
        alasan_ditanyakan:
          "Menyesuaikan antara panduan regulasi emosi mandiri dan persiapan konsultasi bersama profesional psikologi.",
        daftar_opsi: [
          {
            id_opsi: "emotional_exhaustion_coping",
            label: "Panduan praktis menenangkan diri dan memulihkan batas energi kerja",
          },
          {
            id_opsi: "work_anxiety_regulation",
            label: "Strategi menghadapi rasa cemas atau tertekan sebelum dan saat bekerja",
          },
          {
            id_opsi: "professional_counseling_readiness",
            label: "Persiapan terstruktur untuk berdiskusi dengan konselor atau psikolog",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_6,
      REF.PSIKOLOGI_PERTEMUAN_4,
      REF.PSIKOLOGI_PERTEMUAN_2,
      REF.UU_PDP_2022,
    ],
  },
  {
    id_masalah: "unsure",
    judul: "Belum Yakin / Masalah Terasa Bercampur",
    ringkasan_situasi:
      "Situasi kerja terasa rumit karena melibatkan beberapa hal sekaligus. Gunakan panduan langkah demi langkah ini untuk memilah masalah utama Anda.",
    contoh_situasi: [
      "Merasa tidak nyaman di tempat kerja tetapi sulit menentukan apakah ini soal beban, relasi, atau hak.",
      "Mengalami tekanan tugas sekaligus gesekan dengan atasan sehingga bingung mana yang harus diurai dulu.",
    ],
    id_pilar_utama: "work_wellbeing",
    kelas_hasil_default: "understand",
    skrining_psikologis_relevan: true,
    daftar_pertanyaan_cabang: [
      {
        id_pertanyaan: "orientasi_disambiguasi",
        teks_pertanyaan:
          "Jika harus memilih satu hal yang paling mendesak untuk diurai lebih dulu, mana yang paling mendekati kondisi Anda?",
        alasan_ditanyakan:
          "Membantu mengarahkan eksplorasi ke domain masalah kerja yang paling tepat tanpa memaksa Anda menjawab kuesioner panjang.",
        daftar_opsi: [
          {
            id_opsi: "workload_or_role",
            label: "Beban kerja berlebih, kejelasan tanggung jawab, atau kelelahan kerja",
          },
          {
            id_opsi: "interpersonal_or_safety",
            label: "Gesekan hubungan kerja, perlakuan tidak adil, atau perilaku mengintimidasi",
          },
          {
            id_opsi: "rights_or_career",
            label: "Kepastian kontrak/upah, arah perkembangan karier, atau adaptasi kerja digital",
          },
        ],
      },
    ],
    landasan_akademik_hukum: [
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_3,
      REF.PSIKOLOGI_PERTEMUAN_4,
    ],
  },
];

export const DATA_KATALOG_MASALAH: ResponsKatalogMasalah = skema_respons_katalog_masalah.parse({
  daftar_masalah: daftar_katalog_masalah_mentah,
});
