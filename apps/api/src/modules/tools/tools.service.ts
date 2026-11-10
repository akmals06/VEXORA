import {
  type DrafPercakapan,
  type FilterDirektoriDukungan,
  type HasilRefleksiMaknaKerja,
  type InputPersiapanPercakapan,
  type InputRefleksiMaknaKerja,
  type RecipientType,
  type ResponsDaftarSkenario,
  type ResponsDirektoriDukungan,
  skema_draf_percakapan,
  skema_hasil_refleksi_makna_kerja,
  skema_respons_direktori_dukungan,
} from "@voxera/contracts";
import {
  DAFTAR_ITEM_DIREKTORI_DUKUNGAN,
  DATA_DIREKTORI_DUKUNGAN,
} from "../catalog/direktori-dukungan.data.js";
import { REFERENSI_AKADEMIK_DAN_HUKUM as REF } from "../catalog/referensi-hukum.data.js";
import { DATA_SKENARIO_KERJA } from "../catalog/skenario-kerja.data.js";

interface KonfigurasiPenerimaPercakapan {
  label_penerima: string;
  pembuka_standar: string;
  kalimat_penutup: string;
  panduan_khusus: string[];
  hal_dihindari: string[];
  peringatan_privasi: string;
}

const PETA_KONFIGURASI_PENERIMA: Record<RecipientType, KonfigurasiPenerimaPercakapan> = {
  manager: {
    label_penerima: "Atasan Langsung / Manajer",
    pembuka_standar:
      "Saya ingin meminta waktu singkat untuk menyelaraskan prioritas kerja dan mendiskusikan situasi yang sedang memengaruhi alur tugas saya.",
    kalimat_penutup:
      "Terima kasih atas waktunya; apakah kita dapat menyepakati langkah prioritas ini untuk saya tindak lanjuti secara tertulis?",
    panduan_khusus: [
      "Sampaikan kronologi dan dampak secara terukur terhadap target kerja atau kualitas output tim.",
      "Bawa 1–2 opsi solusi konkret (misalnya penyesuaian tenggat waktu atau pembagian ulang tugas).",
    ],
    hal_dihindari: [
      "Menyampaikan keluhan tanpa contoh situasi dan rentang waktu yang jelas.",
      "Menyepakati target baru secara sepihak apabila kapasitas riil belum terbahas.",
    ],
    peringatan_privasi:
      "Draf ini hanya tersimpan di sesi lokal peramban Anda dan tidak pernah dikirim otomatis ke atasan maupun server VEXORA.",
  },
  hr: {
    label_penerima: "Fungsi SDM / HR & Hubungan Industrial",
    pembuka_standar:
      "Saya ingin menyampaikan catatan kronologis dan meminta klarifikasi kebijakan serta fasilitasi resmi terkait situasi kerja yang saya alami.",
    kalimat_penutup:
      "Mohon informasi mengenai tahapan prosedur internal selanjutnya serta perlindungan kerahasiaan atas laporan ini.",
    panduan_khusus: [
      "Fokuskan pada urutan kejadian faktual, waktu, peran terkait, serta rujukan kebijakan perusahaan atau hak normatif.",
      "Minta kejelasan tertulis mengenai prosedur tindak lanjut dan langkah pencegahan retaliasi.",
    ],
    hal_dihindari: [
      "Menyerahkan dokumen asli satu-satunya tanpa menyimpan salinan pribadi di luar perangkat kantor.",
      "Mengasumsikan pembicaraan lisan tidak formal sudah tercatat sebagai laporan resmi.",
    ],
    peringatan_privasi:
      "Draf ini bersifat lokal di sesi peramban Anda. Ingat bahwa HR merupakan fungsi organisasi; simpan salinan catatan pribadi Anda secara mandiri.",
  },
  psychologist: {
    label_penerima: "Psikolog Profesional",
    pembuka_standar:
      "Saya ingin berkonsultasi mengenai tekanan di tempat kerja dan bagaimana kondisi tersebut mulai berdampak pada keseharian serta keseimbangan emosi saya.",
    kalimat_penutup:
      "Berdasarkan gambaran ini, asesmen atau langkah pemulihan psikologis apa yang sebaiknya kita fokuskan terlebih dahulu?",
    panduan_khusus: [
      "Anda tidak perlu menggunakan istilah klinis; ceritakan apa yang Anda alami dan rasakan secara apa adanya.",
      "Sampaikan dampak nyata pada pola tidur, energi, konsentrasi, atau fungsi keseharian Anda.",
    ],
    hal_dihindari: [
      "Menyembunyikan dampak emosional yang berat karena khawatir dianggap kurang tangguh.",
      "Mengharapkan putusan hukum ketenagakerjaan dari sesi konsultasi psikologis.",
    ],
    peringatan_privasi:
      "Catatan persiapan konsultasi psikolog ini 100% berada di sesi lokal peramban Anda (session_local_only) dan tidak pernah disimpan di database VEXORA.",
  },
  counselor: {
    label_penerima: "Konselor Kesejahteraan Kerja",
    pembuka_standar:
      "Saya membutuhkan ruang diskusi suportif untuk mengurai situasi kerja yang sedang membebani pikiran saya dan menyusun strategi menghadapinya.",
    kalimat_penutup:
      "Strategi regulasi diri atau langkah komunikasi praktis mana yang dapat saya latih untuk menghadapi minggu kerja ke depan?",
    panduan_khusus: [
      "Pilih satu atau dua situasi pemicu utama yang paling menguras energi Anda akhir-akhir ini.",
      "Gunakan sesi konseling untuk mengeksplorasi batas diri dan strategi koping yang realistis.",
    ],
    hal_dihindari: [
      "Memaksakan diri menyelesaikan seluruh persoalan struktural kantor dalam satu sesi singkat.",
      "Menyalahkan diri sendiri atas kondisi lingkungan kerja yang berada di luar kendali individu.",
    ],
    peringatan_privasi:
      "Draf persiapan konseling ini hanya tersimpan di sesi peramban Anda dan akan terhapus seketika saat Anda menekan Bersihkan Sesi Lokal.",
  },
  legal_professional: {
    label_penerima: "Pendamping Hukum Ketenagakerjaan / Serikat Pekerja / LBH",
    pembuka_standar:
      "Saya ingin meminta telaah hukum ketenagakerjaan atas kronologi hubungan kerja dan dokumen yang sedang saya hadapi.",
    kalimat_penutup:
      "Berdasarkan UU No. 27 Tahun 2026 dan UU PPHI No. 2 Tahun 2004, langkah administratif atau perundingan bipartit apa yang paling tepat saya tempuh?",
    panduan_khusus: [
      "Susun urutan kejadian secara kronologis (tanggal mulai kerja, status kontrak PKWT/PKWTT, dan perubahan yang terjadi).",
      "Siapkan daftar dokumen pendukung yang Anda miliki (perjanjian kerja, slip upah, atau pesan instruksi tertulis).",
    ],
    hal_dihindari: [
      "Menandatangani surat pengunduran diri atau perjanjian bersama sebelum memahami implikasi hak normatifnya.",
      "Mengubah atau menambahkan klaim yang tidak sesuai dengan bukti dokumen yang ada.",
    ],
    peringatan_privasi:
      "Draf persiapan konsultasi hukum ini hanya berada di sesi peramban Anda dan tidak pernah disimpan di database server VEXORA.",
  },
  career_professional: {
    label_penerima: "Konsultan Karier / Mentor Pengembangan Profesional",
    pembuka_standar:
      "Saya ingin mendiskusikan evaluasi peran saya saat ini, kebutuhan penguatan kompetensi, serta arah perkembangan karier saya ke depan.",
    kalimat_penutup:
      "Langkah pengembangan keahlian atau penataan ulang peran apa yang paling strategis untuk saya jalankan dalam 3–6 bulan mendatang?",
    panduan_khusus: [
      "Jelaskan bagian pekerjaan yang masih memberi makna positif serta area yang terasa stagnan atau membingungkan.",
      "Hubungkan tujuan karier Anda dengan kompetensi spesifik yang ingin dibangun.",
    ],
    hal_dihindari: [
      "Mengambil keputusan transisi karier secara impulsif saat sedang berada di puncak kelelahan sesaat.",
      "Mengabaikan faktor kondisi dasar kerja (hak & beban wajar) ketika menilai kecocokan karier.",
    ],
    peringatan_privasi:
      "Catatan persiapan diskusi karier ini tersimpan khusus di sesi lokal peramban Anda.",
  },
};

const PETA_NARASI_ORIENTASI: Record<InputRefleksiMaknaKerja["orientasi_saat_ini"], string> = {
  job_orientation:
    "Anda saat ini memandang pekerjaan terutama sebagai penopang kebutuhan hidup dan stabilitas dasar (Job Orientation, Pertemuan 1: Meaning of Work). Hal ini wajar dan sehat, terutama ketika prioritas utama Anda adalah kepastian hak, batas waktu kerja, dan keseimbangan hidup di luar kantor.",
  career_orientation:
    "Anda berfokus pada kemajuan peran, pengakuan pencapaian, dan perkembangan kapasitas profesional (Career Orientation, Pertemuan 1: Meaning of Work). Kejelasan jalur belajar dan keadilan evaluasi menjadi faktor kunci bagi keterlibatan kerja Anda.",
  calling_orientation:
    "Anda merasakan keterhubungan nilai pribadi yang kuat dengan tujuan pekerjaan Anda (Calling Orientation, Pertemuan 1: Meaning of Work). Penting untuk tetap menjaga batas waktu istirahat agar dedikasi tinggi tidak berubah menjadi pengurasan energi tanpa disadari.",
  exploring_transition:
    "Anda sedang berada pada fase meninjau ulang kesesuaian peran dan mengeksplorasi transisi arah kerja baru secara sadar (Pertemuan 1: Sustainable Career).",
};

const PETA_KONSEP_DIMENSI_MAKNA: Record<InputRefleksiMaknaKerja["dimensi_makna_utama"], string> = {
  positive_meaning_in_work:
    "Positive Meaning in Work (Pertemuan 1: Meaning of Work): Pengalaman bahwa tugas yang dikerjakan memiliki nilai penting dan signifikansi personal.",
  meaning_making_through_work:
    "Meaning Making through Work (Pertemuan 1: Meaning of Work): Peran pekerjaan sebagai ruang memperdalam pemahaman diri, ketangguhan, dan pertumbuhan hidup.",
  greater_good_motivations:
    "Greater Good Motivations (Pertemuan 1: Meaning of Work): Dorongan untuk memberi dampak positif yang bermanfaat bagi rekan, pengguna layanan, atau masyarakat luas.",
};

const PETA_KONSEP_SDT: Record<InputRefleksiMaknaKerja["kebutuhan_sdt_prioritas"], string> = {
  autonomy_control:
    "Kebutuhan Otonomi (Self-Determination Theory, Pertemuan 2: Need / Motivation Theories): Kebutuhan memiliki ruang kendali atas cara mengatur ritme kerja dan pengambilan keputusan tugas.",
  competence_mastery:
    "Kebutuhan Kompetensi (Self-Determination Theory, Pertemuan 2: Need / Motivation Theories): Kebutuhan merasakan penguasaan keahlian yang memadai dan kejelasan standar keberhasilan kerja.",
  relatedness_support:
    "Kebutuhan Keterhubungan (Self-Determination Theory, Pertemuan 2: Need / Motivation Theories): Kebutuhan akan relasi kerja yang saling menghargai, aman secara psikologis, dan suportif.",
};

const PETA_LANGKAH_TANTANGAN_DIGITAL: Record<
  InputRefleksiMaknaKerja["tantangan_kerja_digital"],
  string[]
> = {
  information_overload_distraction: [
    "Tetapkan blok waktu kerja fokus tanpa interupsi notifikasi non-darurat dan sepakati ekspektasi waktu respons bersama tim.",
    "Susun prioritas harian menjadi maksimal 3 luaran utama agar kapasitas perhatian tidak habis oleh pergantian konteks digital.",
  ],
  ai_workflow_adaptation: [
    "Pilih satu alur kerja spesifik untuk dipelajari secara bertahap dan mintakan panduan standar penggunaan alat baru kepada atasan atau rekan.",
    "Gunakan ruang Persiapan Percakapan untuk mengusulkan sesi berbagi pengetahuan atau pelatihan praktis di tim.",
  ],
  skill_development_need: [
    "Petakan keterampilan inti yang paling dibutuhkan untuk peran Anda dalam 6 bulan ke depan dan alokasikan waktu belajar terproteksi.",
    "Diskusikan dukungan pengembangan kompetensi bersama manajer atau mentor karier menggunakan agenda tertulis.",
  ],
  role_clarity_in_digital_work: [
    "Dokumentasikan batas tanggung jawab, kanal komunikasi utama, serta indikator selesai (definition of done) pada kolaborasi hibrida/digital.",
    "Selaraskan ekspektasi jam kerja aktif bersama atasan agar kolaborasi digital tidak mengaburkan waktu istirahat.",
  ],
};

/**
 * Fungsi deterministik untuk menyusun draf persiapan percakapan 5-prompt
 * tanpa memanggil AI eksternal, tanpa menulis ke database, dan tanpa mencatat isi ke log.
 */
export function susun_draf_persiapan_percakapan(input: InputPersiapanPercakapan): DrafPercakapan {
  const konfigurasi = PETA_KONFIGURASI_PENERIMA[input.target_penerima];
  const konteks_peran_bersih = input.konteks_peran_tanpa_nama_wajib.trim();

  const ringkasan_situasi = konteks_peran_bersih
    ? `${input.apa_yang_terjadi_dan_waktu.trim()} (Konteks peran: ${konteks_peran_bersih})`
    : input.apa_yang_terjadi_dan_waktu.trim();

  const pernyataan_dampak = input.dampak_pada_pekerjaan_atau_kondisi.trim();
  const rincian_dukungan = `Dukungan yang dibutuhkan: ${input.dukungan_yang_dibutuhkan.trim()} | Hasil yang diharapkan: ${input.hasil_yang_diharapkan.trim()}`;

  const naskah_siap_salin = [
    `[Catatan Persiapan Komunikasi - Tujuan: ${konfigurasi.label_penerima}]`,
    `1. Pembuka: ${konfigurasi.pembuka_standar}`,
    `2. Situasi & Waktu: ${ringkasan_situasi}`,
    `3. Dampak pada Pekerjaan / Kondisi: ${pernyataan_dampak}`,
    `4. Dukungan yang Dibutuhkan: ${input.dukungan_yang_dibutuhkan.trim()}`,
    `5. Hasil & Tindak Lanjut yang Diharapkan: ${input.hasil_yang_diharapkan.trim()}`,
    `6. Penutup: ${konfigurasi.kalimat_penutup}`,
  ].join("\n\n");

  return skema_draf_percakapan.parse({
    judul_draf: `Catatan Persiapan Diskusi: ${konfigurasi.label_penerima}`,
    target_penerima: input.target_penerima,
    id_masalah_terkait: input.id_masalah_terkait,
    pembuka_percakapan: konfigurasi.pembuka_standar,
    ringkasan_situasi_dan_waktu: ringkasan_situasi,
    pernyataan_dampak,
    rincian_dukungan_dan_hasil: rincian_dukungan,
    kalimat_penutup_konstruktif: konfigurasi.kalimat_penutup,
    panduan_khusus_penerima: konfigurasi.panduan_khusus,
    hal_yang_perlu_dihindari: konfigurasi.hal_dihindari,
    naskah_siap_salin,
    peringatan_privasi_penerima: konfigurasi.peringatan_privasi,
    kebijakan_penyimpanan: "session_local_only",
  });
}

/**
 * Fungsi deterministik untuk menyusun refleksi kualitatif makna kerja dan adaptasi digital
 * berdasarkan materi Psikologi Kerja UNTAR Pertemuan 1, 2 & 5 (tanpa skor numerik atau asesmen klinis).
 */
export function susun_refleksi_makna_kerja(
  input: InputRefleksiMaknaKerja,
): HasilRefleksiMaknaKerja {
  const ringkasan_orientasi = PETA_NARASI_ORIENTASI[input.orientasi_saat_ini];
  const konsep_dimensi = PETA_KONSEP_DIMENSI_MAKNA[input.dimensi_makna_utama];
  const konsep_sdt = PETA_KONSEP_SDT[input.kebutuhan_sdt_prioritas];
  const langkah_digital = PETA_LANGKAH_TANTANGAN_DIGITAL[input.tantangan_kerja_digital];

  return skema_hasil_refleksi_makna_kerja.parse({
    ringkasan_refleksi_non_klinis: ringkasan_orientasi,
    kaitan_konsep_psikologi_kerja: [
      konsep_dimensi,
      konsep_sdt,
      REF.PSIKOLOGI_PERTEMUAN_1,
      REF.PSIKOLOGI_PERTEMUAN_5,
    ],
    langkah_pengembangan_konstruktif: langkah_digital,
    tautan_persiapan_percakapan: "/prepare?recipient=career_professional&issue=career_growth",
    catatan_batas_non_asesmen:
      "Refleksi makna kerja dan adaptasi digital ini merupakan alat pemetaan diri kualitatif berbasis materi Psikologi Kerja (bukan instrumen skrining psikologis maupun diagnosis klinis).",
  });
}

export class LayananAlatBantu {
  buat_draf_percakapan(input: InputPersiapanPercakapan): DrafPercakapan {
    return susun_draf_persiapan_percakapan(input);
  }

  dapatkan_daftar_skenario(): ResponsDaftarSkenario {
    return DATA_SKENARIO_KERJA;
  }

  evaluasi_refleksi_makna_kerja(input: InputRefleksiMaknaKerja): HasilRefleksiMaknaKerja {
    return susun_refleksi_makna_kerja(input);
  }

  dapatkan_direktori_dukungan(filter?: FilterDirektoriDukungan): ResponsDirektoriDukungan {
    if (!filter || (!filter.id_tipe_dukungan && !filter.kategori_layanan)) {
      return DATA_DIREKTORI_DUKUNGAN;
    }

    const hasil_filter = DAFTAR_ITEM_DIREKTORI_DUKUNGAN.filter((item) => {
      const cocok_tipe =
        !filter.id_tipe_dukungan || item.id_tipe_dukungan === filter.id_tipe_dukungan;
      const cocok_kategori =
        !filter.kategori_layanan || item.kategori_layanan === filter.kategori_layanan;
      return cocok_tipe && cocok_kategori;
    });

    const daftar_final = hasil_filter.length > 0 ? hasil_filter : DAFTAR_ITEM_DIREKTORI_DUKUNGAN;

    return skema_respons_direktori_dukungan.parse({
      daftar_layanan: daftar_final,
    });
  }
}
