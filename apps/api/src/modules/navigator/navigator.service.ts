import {
  type BatasKonfigurasiSkrining,
  type InputNavigator,
  type LangkahPerjalananDukungan,
  type OutcomeClass,
  type PeringatanPenjaga,
  type PerjalananDukungan,
  type ProfessionalReferralReason,
  type ResponsKatalogMasalah,
  type SpecificIssueId,
  type SupportTypeId,
  skema_batas_konfigurasi_skrining,
  skema_perjalanan_dukungan,
} from "@voxera/contracts";
import {
  type DefinisiLangkahDasar,
  PERINGATAN_PENJAGA_STANDAR,
  PETA_ATURAN_DOMAIN,
} from "../catalog/aturan-perjalanan.data.js";
import { DATA_KATALOG_MASALAH } from "../catalog/katalog-masalah.data.js";

function resolusi_domain_utama(input: InputNavigator): SpecificIssueId {
  if (input.id_masalah === "unsure") {
    if (input.id_masalah_terdisambiguasi) {
      return input.id_masalah_terdisambiguasi;
    }
    const petunjuk = input.jawaban_cabang.orientasi_disambiguasi;
    if (petunjuk === "interpersonal_or_safety") {
      return "workplace_relationships";
    }
    if (petunjuk === "rights_or_career") {
      return "employment_rights";
    }
    return "workload_pressure";
  }
  return input.id_masalah;
}

function apakah_melibatkan_atasan_langsung(input: InputNavigator): boolean {
  const cabang = input.jawaban_cabang;
  return (
    cabang.sumber_masalah === "direct_supervisor" ||
    cabang.peran_terlibat === "direct_supervisor" ||
    cabang.kekhawatiran_retaliasi === "yes"
  );
}

function apakah_memicu_prioritas_hak_dasar(
  id_domain: SpecificIssueId,
  input: InputNavigator,
  apakah_domain_hak: boolean,
): boolean {
  const cabang = input.jawaban_cabang;
  return (
    apakah_domain_hak ||
    cabang.dampak_hak === "unpaid_overtime" ||
    cabang.jenis_hak !== undefined ||
    cabang.kondisi_komunikasi === "dispute_or_pressure" ||
    input.id_subkategori === "unpaid_overtime" ||
    input.id_subkategori === "always_on_expectations" ||
    input.id_subkategori === "termination_contract" ||
    id_domain === "employment_rights"
  );
}

/**
 * Fungsi murni (pure & deterministic) untuk mengevaluasi jalur dukungan VOXERA
 * dalam 6 tahap terstruktur tanpa skor klinis maupun putusan hukum otomatis.
 */
export function evaluasi_jalur_dukungan(input: InputNavigator): PerjalananDukungan {
  // Tahap 1: Resolusi domain & disambiguasi kategori "unsure"
  const id_masalah_utama = resolusi_domain_utama(input);
  const definisi_domain = PETA_ATURAN_DOMAIN[id_masalah_utama];

  // Tahap 2: Lookup subkategori atau fallback aman ke aturan default domain
  const aturan_aktif =
    definisi_domain.aturan_subkategori[input.id_subkategori] ??
    definisi_domain.aturan_default_domain;

  let kelas_hasil_utama: OutcomeClass = aturan_aktif.kelas_hasil_utama;
  const set_kelas_sekunder = new Set<OutcomeClass>(aturan_aktif.kelas_hasil_sekunder);
  let jalur_dukungan_utama: SupportTypeId = aturan_aktif.jalur_dukungan_utama;
  const set_jalur_sekunder = new Set<SupportTypeId>(aturan_aktif.jalur_dukungan_sekunder);
  let daftar_langkah_mentah: DefinisiLangkahDasar[] = aturan_aktif.langkah_dasar.map((langkah) => ({
    ...langkah,
  }));
  const daftar_peringatan: PeringatanPenjaga[] = [];

  // Tahap 3: Evaluasi Guardrail Tempat Kerja (Chain-of-Command & Rights-Protection)
  const apakah_atasan_dilewati = apakah_melibatkan_atasan_langsung(input);
  if (apakah_atasan_dilewati) {
    if (jalur_dukungan_utama === "manager_discussion") {
      jalur_dukungan_utama =
        id_masalah_utama === "bullying_harassment" || id_masalah_utama === "discrimination_fairness"
          ? "employee_protection"
          : "hr_workplace_support";
    }
    set_jalur_sekunder.delete("manager_discussion");
    set_jalur_sekunder.add("hr_workplace_support");
    set_jalur_sekunder.add("psychological_support");

    daftar_langkah_mentah = daftar_langkah_mentah.map((langkah) => {
      if (langkah.id_tipe_dukungan !== "manager_discussion") {
        return langkah;
      }
      return {
        ...langkah,
        judul_langkah: `${langkah.judul_langkah} (Melalui Jalur HR / Pendamping Aman)`,
        deskripsi_langkah:
          "Karena situasi melibatkan atasan langsung atau kekhawatiran retaliasi, siapkan dokumentasi terstruktur ini untuk dikonsultasikan bersama HR atau kanal perlindungan pekerja, bukan secara tunggal kepada atasan langsung.",
        id_tipe_dukungan: "hr_workplace_support",
        tautan_fitur_internal: langkah.tautan_fitur_internal.replace(
          "recipient=manager",
          "recipient=hr",
        ),
      };
    });

    daftar_peringatan.push(PERINGATAN_PENJAGA_STANDAR.chain_of_command_bypass);
  }

  const prioritas_hak_aktif = apakah_memicu_prioritas_hak_dasar(
    id_masalah_utama,
    input,
    definisi_domain.apakah_domain_hak_atau_keamanan,
  );
  if (prioritas_hak_aktif) {
    if (
      jalur_dukungan_utama !== "legal_information" &&
      jalur_dukungan_utama !== "legal_support" &&
      jalur_dukungan_utama !== "employee_protection"
    ) {
      set_jalur_sekunder.add("legal_information");
    }
    daftar_peringatan.push(PERINGATAN_PENJAGA_STANDAR.hygiene_rights_protection_priority);
  }

  // Tahap 4: Penyelarasan Tujuan Langkah Berikutnya (Goal Alignment)
  if (input.tujuan_langkah_berikutnya === "prepare_conversation") {
    if (kelas_hasil_utama !== "prepare") {
      set_kelas_sekunder.add(kelas_hasil_utama);
      kelas_hasil_utama = "prepare";
    }
  } else if (input.tujuan_langkah_berikutnya === "explore_support_options") {
    daftar_langkah_mentah.push({
      kode_langkah: "explore_support_directory_options",
      judul_langkah: "Telusuri Direktori Kanal Dukungan & Pendampingan",
      deskripsi_langkah:
        "Bandingkan peran, batas kewenangan, dan tingkat kerahasiaan dari kanal HR, konselor, psikolog, maupun lembaga bantuan hukum.",
      alasan_relevansi:
        "Sesuai tujuan Anda untuk memetakan opsi kanal dukungan yang paling tepat sebelum bertindak.",
      id_tipe_dukungan: jalur_dukungan_utama,
      tautan_fitur_internal: "/journey#support-directory",
    });
  } else if (input.tujuan_langkah_berikutnya === "request_professional_support") {
    if (kelas_hasil_utama !== "psychological_support" && kelas_hasil_utama !== "legal_support") {
      set_kelas_sekunder.add(kelas_hasil_utama);
      kelas_hasil_utama =
        id_masalah_utama === "employment_rights" ? "legal_support" : "psychological_support";
    }
    set_jalur_sekunder.add("psychological_support");
    daftar_langkah_mentah.push({
      kode_langkah: "prepare_professional_referral_consultation",
      judul_langkah: "Siapkan Catatan Konsultasi Bersama Profesional (Psikolog/Konselor/Hukum)",
      deskripsi_langkah:
        "Gunakan panduan rujukan profesional dan alat Persiapan Percakapan untuk merangkum kebutuhan pendampingan Anda secara aman.",
      alasan_relevansi:
        "Sesuai pilihan Anda untuk segera terhubung dengan dukungan profesional yang kompeten.",
      id_tipe_dukungan: "psychological_support",
      tautan_fitur_internal: `/prepare?recipient=psychologist&issue=${id_masalah_utama}`,
    });
  }

  set_kelas_sekunder.delete(kelas_hasil_utama);
  set_jalur_sekunder.delete(jalur_dukungan_utama);
  if (set_jalur_sekunder.size === 0) {
    set_jalur_sekunder.add(
      jalur_dukungan_utama === "psychological_support"
        ? "self_guided_resource"
        : "psychological_support",
    );
  }

  // Tahap 5: Evaluasi Dukungan Psikologis Non-Klinis & Rujukan Profesional (P-03, P-06, P-07)
  // Rujukan profesional HANYA dipicu oleh 4 kondisi yang disetujui:
  // (A) Permintaan eksplisit karyawan
  // (B) Kondisi rujukan skrining yang disetujui (saat ini belum ada instrumen/cutoff yang disetujui)
  // (C) Hambatan fungsi harian yang dilaporkan sendiri
  // (D) Aturan etik psikologi yang disetujui eksplisit (tidak mengarang aturan sebelum disetujui)
  // Isu perundungan/pelecehan/konflik memicu jalur perlindungan & hak, BUKAN rujukan otomatis.
  const alasan_pemicu_rujukan: ProfessionalReferralReason[] = [];
  if (
    input.meminta_dukungan_psikolog_konselor ||
    input.tujuan_langkah_berikutnya === "request_professional_support"
  ) {
    alasan_pemicu_rujukan.push("explicit_employee_request");
  }
  if (input.melaporkan_hambatan_fungsi_harian) {
    alasan_pemicu_rujukan.push("self_reported_daily_functioning_interference");
    daftar_peringatan.push(PERINGATAN_PENJAGA_STANDAR.confidential_psychological_boundary);
  }

  const rujukan_direkomendasikan = alasan_pemicu_rujukan.length > 0;
  const skrining_direkomendasikan =
    definisi_domain.skrining_psikologis_relevan ||
    input.meminta_dukungan_psikolog_konselor ||
    input.melaporkan_hambatan_fungsi_harian;

  // Tahap 6: Injeksi Batas Etik Psikologi & Hukum Wajib serta Penomoran Langkah
  daftar_peringatan.push(
    PERINGATAN_PENJAGA_STANDAR.non_diagnostic_boundary,
    PERINGATAN_PENJAGA_STANDAR.non_legal_verdict_boundary,
  );

  const daftar_langkah_rekomendasi: LangkahPerjalananDukungan[] = daftar_langkah_mentah
    .slice(0, 10)
    .map((langkah, indeks) => ({
      urutan_langkah: indeks + 1,
      kode_langkah: langkah.kode_langkah,
      judul_langkah: langkah.judul_langkah,
      deskripsi_langkah: langkah.deskripsi_langkah,
      alasan_relevansi: langkah.alasan_relevansi,
      id_tipe_dukungan: langkah.id_tipe_dukungan,
      tautan_fitur_internal: langkah.tautan_fitur_internal,
      status_langkah: "belum_dimulai",
    }));

  return skema_perjalanan_dukungan.parse({
    id_masalah_utama,
    id_subkategori: input.id_subkategori,
    judul_perjalanan: aturan_aktif.judul_perjalanan,
    kelas_hasil_utama,
    kelas_hasil_sekunder: Array.from(set_kelas_sekunder),
    apakah_atasan_dilewati,
    ringkasan_konteks_kerja: aturan_aktif.ringkasan_konteks_kerja,
    jalur_dukungan_utama,
    jalur_dukungan_sekunder: Array.from(set_jalur_sekunder),
    rekomendasi_skrining_psikologis: {
      direkomendasikan_secara_kondisional: skrining_direkomendasikan,
      wajib_diisi: false,
      status_instrumen: "menunggu_instrumen_tim_psikologi",
      penjelasan_batas_non_klinis:
        "Pemeriksaan kesejahteraan psikologis ini sepenuhnya bersifat sukarela, hanya memberikan indikasi awal non-klinis di sesi peramban Anda, dan bukan diagnosis klinis.",
      alasan_relevansi_kontekstual: definisi_domain.alasan_skrining_kontekstual,
      kebijakan_penyimpanan: "in_session_only_never_persisted",
    },
    dukungan_psikologis_non_klinis: definisi_domain.dukungan_psikologis_non_klinis,
    rekomendasi_rujukan_profesional: {
      direkomendasikan: rujukan_direkomendasikan,
      alasan_pemicu: alasan_pemicu_rujukan,
      penjelasan_peran_konselor_psikolog:
        "Konselor dapat membantu pemetaan masalah dan strategi koping adaptif jangka pendek, sedangkan Psikolog dapat memberikan asesmen dan intervensi psikologis profesional sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya. Fungsi tiap kanal profesional dapat berbeda sesuai spesialisasi serta kebutuhan Anda. Rujukan dan konsultasi profesional sepenuhnya bersifat sukarela serta menghormati keputusan mandiri Anda.",
      catatan_kerahasiaan:
        "Konsultasi profesional tunduk pada kode etik kerahasiaan profesi; catatan persiapan Anda di VOXERA hanya tersimpan di sesi lokal peramban Anda.",
      tautan_persiapan_konsultasi: `/prepare?recipient=psychologist&issue=${id_masalah_utama}`,
    },
    daftar_langkah_rekomendasi,
    daftar_peringatan_penjaga: daftar_peringatan,
    landasan_akademik_hukum: definisi_domain.landasan_akademik_hukum,
  });
}

export class LayananNavigator {
  dapatkan_katalog_masalah(): ResponsKatalogMasalah {
    return DATA_KATALOG_MASALAH;
  }

  evaluasi_perjalanan(input: InputNavigator): PerjalananDukungan {
    return evaluasi_jalur_dukungan(input);
  }

  dapatkan_batas_skrining_psikologis(): BatasKonfigurasiSkrining {
    return skema_batas_konfigurasi_skrining.parse({
      status_ketersediaan: "menunggu_persetujuan_tim_psikologi",
      id_instrumen: null,
      nama_instrumen: null,
      konstruk_psikologis: null,
      peringatan_bukan_diagnosis:
        "Instrumen skrining psikologis sedang menunggu spesifikasi tervalidasi dari tim Psikologi. Saat diaktifkan, skrining ini hanya memberikan indikasi awal di sesi lokal peramban dan bukan merupakan diagnosis klinis.",
      penyimpanan_diizinkan: "session_local_only",
      dapat_dilewati_kapan_saja: true,
    });
  }
}
