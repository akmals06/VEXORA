import type {
  DrafPercakapan,
  PerjalananDukungan,
  PerjalananTersimpan,
  ResponsAutentikasi,
} from "@voxera/contracts";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClearSessionModal } from "@/components/layout/clear-session-modal";
import { PageShell } from "@/components/layout/page-shell";
import { UrgentSupportModal } from "@/components/layout/urgent-support-modal";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { HomeView } from "@/features/home/home-view";
import { SupportJourneyView } from "@/features/journey/support-journey-view";
import { MyJourneyView } from "@/features/my-journey/my-journey-view";
import { IssueNavigatorView } from "@/features/navigator/issue-navigator-view";
import { ConversationPrepView } from "@/features/prepare/conversation-prep-view";
import { ScenariosView } from "@/features/scenarios/scenarios-view";
import { GalatApiKlien, klien_api_voxera } from "@/lib/api-client";
import { dapatkan_url_dasar_api_v1 } from "@/lib/env";
import {
  apakah_ada_data_sesi_lokal,
  baca_sesi_lokal,
  buat_state_sesi_lokal_kosong,
  hapus_sesi_lokal,
  KUNCI_SESI_LOKAL,
  simpan_sesi_lokal,
} from "@/lib/session-storage";
import {
  DAFTAR_KARTU_MASALAH_BERANDA,
  DAFTAR_OPSI_DISAMBIGUASI_UNSURE,
  DAFTAR_PENERIMA_PERCAKAPAN,
  DAFTAR_PILAR_PRODUK,
  PETA_LABEL_MASALAH,
  PETA_LABEL_PENERIMA,
  PETA_LABEL_PILAR,
  PETA_LABEL_TIPE_DUKUNGAN,
} from "@/lib/taxonomy-labels";
import { AppProviders } from "@/providers/app-providers";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

class PenyimpananSesiTiruan {
  private readonly peta = new Map<string, string>();

  getItem(kunci: string): string | null {
    return this.peta.get(kunci) ?? null;
  }

  setItem(kunci: string, nilai: string): void {
    this.peta.set(kunci, nilai);
  }

  removeItem(kunci: string): void {
    this.peta.delete(kunci);
  }

  clear(): void {
    this.peta.clear();
  }
}

const CONTOH_PERJALANAN_AKTIF: PerjalananDukungan = {
  id_masalah_utama: "bullying_harassment",
  id_subkategori: "sexual_harassment",
  judul_perjalanan: "Rencana Perlindungan Diri, Dokumentasi Aman & Navigasi Kanal Pendampingan",
  kelas_hasil_utama: "employee_protection",
  kelas_hasil_sekunder: ["prepare", "workplace_support"],
  apakah_atasan_dilewati: true,
  ringkasan_konteks_kerja:
    "Anda melaporkan adanya indikasi intimidasi, perundungan, atau pelecehan di lingkungan kerja yang memerlukan prioritas keamanan psikologis dan kanal perlindungan yang tepat.",
  jalur_dukungan_utama: "employee_protection",
  jalur_dukungan_sekunder: ["hr_workplace_support", "psychological_support", "legal_support"],
  rekomendasi_skrining_psikologis: {
    direkomendasikan_secara_kondisional: true,
    wajib_diisi: false,
    status_instrumen: "menunggu_instrumen_tim_psikologi",
    penjelasan_batas_non_klinis:
      "Pemeriksaan kesejahteraan psikologis ini sepenuhnya bersifat sukarela, hanya memberikan indikasi awal non-klinis di sesi peramban Anda, dan bukan diagnosis klinis.",
    alasan_relevansi_kontekstual:
      "Paparan intimidasi, perundungan, atau pelecehan merupakan bahaya psikososial serius yang dapat berdampak langsung pada rasa aman dan kesejahteraan psikologis Anda.",
    kebijakan_penyimpanan: "in_session_only_never_persisted",
  },
  dukungan_psikologis_non_klinis: [
    {
      kategori: "psychoeducation",
      judul: "Validasi Pengalaman & Pemahaman Bahaya Psikososial",
      panduan_praktis:
        "Perlakuan merendahkan atau pelecehan di tempat kerja bukanlah kesalahan korban dan bukan ujian ketahanan mental yang wajar.",
      batasan_etik:
        "Dukungan ini membantu pemulihan rasa aman awal, bukan pengganti pendampingan psikolog atau perlindungan hukum.",
    },
  ],
  rekomendasi_rujukan_profesional: {
    direkomendasikan: false,
    alasan_pemicu: [],
    penjelasan_peran_konselor_psikolog:
      "Konselor dapat membantu pemetaan masalah dan strategi koping adaptif jangka pendek, sedangkan Psikolog dapat memberikan asesmen dan intervensi psikologis profesional sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya. Fungsi tiap kanal profesional dapat berbeda sesuai spesialisasi serta kebutuhan Anda. Rujukan dan konsultasi profesional sepenuhnya bersifat sukarela serta menghormati keputusan mandiri Anda.",
    catatan_kerahasiaan:
      "Konsultasi profesional tunduk pada kode etik kerahasiaan profesi; catatan persiapan Anda di VOXERA hanya tersimpan di sesi lokal peramban Anda.",
    tautan_persiapan_konsultasi: "/prepare?recipient=psychologist&issue=bullying_harassment",
  },
  daftar_langkah_rekomendasi: [
    {
      urutan_langkah: 1,
      kode_langkah: "prepare_private_chronology",
      judul_langkah: "Susun Ringkasan Kronologis Kejadian di Sesi Lokal",
      deskripsi_langkah:
        "Catat urutan kejadian, waktu, dampak yang dirasakan, dan konteks peran menggunakan alat Persiapan Situasi (tersimpan hanya di sesi peramban Anda).",
      alasan_relevansi:
        "Membantu Anda memiliki pegangan faktual yang rapi sebelum berbicara dengan pihak pendamping, HR, atau Satgas PPKST.",
      id_tipe_dukungan: "employee_protection",
      tautan_fitur_internal: "/prepare?recipient=hr&issue=bullying_harassment",
      status_langkah: "belum_dimulai",
    },
    {
      urutan_langkah: 2,
      kode_langkah: "navigate_safe_reporting_channel",
      judul_langkah: "Pelajari Kanal Perlindungan Internal & Satgas Pencegahan",
      deskripsi_langkah:
        "Tinjau peran Satgas Pencegahan dan Penanganan Kekerasan di Tempat Kerja (Kepmenaker No. 88 Tahun 2023) atau kanal HR independen.",
      alasan_relevansi:
        "Memastikan Anda memilih jalur pengaduan yang memiliki mandat perlindungan korban dan pencegahan retaliasi.",
      id_tipe_dukungan: "hr_workplace_support",
      tautan_fitur_internal: "/journey#support-directory",
      status_langkah: "belum_dimulai",
    },
  ],
  daftar_peringatan_penjaga: [
    {
      kode: "chain_of_command_bypass",
      judul: "Penjaga Keamanan Jalur Pelaporan (Melewati Atasan Langsung)",
      pesan:
        "Karena situasi ini melibatkan atasan langsung atau risiko retaliasi, VOXERA tidak mengarahkan Anda untuk berhadapan langsung secara tunggal dengan atasan tersebut, melainkan melalui kanal dukungan SDM/HR, perlindungan kerja, atau pendampingan profesional.",
      lapisan_batas: "workplace_issue_navigation",
    },
    {
      kode: "non_diagnostic_boundary",
      judul: "Batas Etik Non-Diagnostik Psikologi",
      pesan:
        "VOXERA memberikan navigasi masalah kerja, psikoedukasi, dan persiapan konsultasi. Hasil pemetaan ini bukan diagnosis klinis psikologis maupun psikiatris.",
      lapisan_batas: "workplace_issue_navigation",
    },
  ],
  landasan_akademik_hukum: [
    "Psikologi Kerja UNTAR Pertemuan 3 (Organization: strategy, structure, systems, people, culture, chain of command, span of control, centralization, stakeholders, HRM, organizational culture, AI/work implications)",
    "Kepmenaker No. 88 Tahun 2023 tentang Pedoman Pencegahan dan Penanganan Kekerasan Seksual di Tempat Kerja (Satgas PPKST)",
  ],
};

describe("VOXERA Phase 5 Frontend Suite (@voxera/web)", () => {
  let penyimpanan_sesi: PenyimpananSesiTiruan;

  beforeEach(() => {
    penyimpanan_sesi = new PenyimpananSesiTiruan();
    vi.stubGlobal("window", {
      sessionStorage: penyimpanan_sesi,
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setTimeout: globalThis.setTimeout,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("1. Home & Domain Entry + Antislop R-02 Hygiene", () => {
    it("merender halaman Beranda problem-first beserta 10 domain masalah kerja dan 5 pilar produk tanpa tanda pisah em (—)", () => {
      expect(DAFTAR_KARTU_MASALAH_BERANDA).toHaveLength(10);
      expect(DAFTAR_PILAR_PRODUK).toHaveLength(5);
      expect(DAFTAR_PENERIMA_PERCAKAPAN).toHaveLength(6);
      expect(DAFTAR_OPSI_DISAMBIGUASI_UNSURE).toHaveLength(9);

      const html = renderToStaticMarkup(
        <AppProviders>
          <HomeView />
        </AppProviders>,
      );

      expect(html).toContain("Apa yang sedang Anda hadapi di tempat kerja?");
      for (const kartu of DAFTAR_KARTU_MASALAH_BERANDA) {
        expect(html).toContain(kartu.judul.replace(/&/g, "&amp;"));
      }
      for (const pilar of DAFTAR_PILAR_PRODUK) {
        expect(html).toContain(pilar.judul.replace(/&/g, "&amp;"));
      }
      expect(html).not.toContain("—");
    });

    it("memastikan 6 ID penerima percakapan sesuai kontrak yang disetujui, bebas karakter em dash (—), bebas atribusi akademik tak didukung, serta memuat rumusan peran psikolog yang akurat (§3)", () => {
      const id_penerima_disetujui = [
        "manager",
        "hr",
        "psychologist",
        "counselor",
        "legal_professional",
        "career_professional",
      ];
      expect(DAFTAR_PENERIMA_PERCAKAPAN.map((p) => p.id)).toEqual(id_penerima_disetujui);
      expect(Object.keys(PETA_LABEL_PENERIMA)).toEqual(id_penerima_disetujui);
      expect(DAFTAR_PENERIMA_PERCAKAPAN.map((p) => p.id as string)).not.toContain("legal_support");
      expect(DAFTAR_PENERIMA_PERCAKAPAN.map((p) => p.id as string)).not.toContain("trusted_peer");

      const semua_teks = [
        ...Object.values(PETA_LABEL_PILAR),
        ...Object.values(PETA_LABEL_MASALAH),
        ...Object.values(PETA_LABEL_PENERIMA),
        ...Object.values(PETA_LABEL_TIPE_DUKUNGAN),
        ...DAFTAR_PENERIMA_PERCAKAPAN.map((p) => p.peran_singkat),
      ];
      for (const teks of semua_teks) {
        expect(teks).not.toContain("—");
        expect(teks).not.toMatch(/Wrzesniewski|Steger|Boundary Theory|Hackman|Oldham|Schein/i);
      }

      const info_psikolog = DAFTAR_PENERIMA_PERCAKAPAN.find((p) => p.id === "psychologist");
      expect(info_psikolog?.peran_singkat).toContain(
        "sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya",
      );
    });
  });

  describe("2. Session-Local State Manager (voxera_session_v1) & Clear Session", () => {
    it("menyimpan, membaca, mereset jawaban cabang saat domain berganti, dan menghapus state sementara di sessionStorage tanpa pernah menyimpan kredensial autentikasi", () => {
      const awal = baca_sesi_lokal();
      expect(awal.progres_navigator.id_masalah).toBeNull();
      expect(apakah_ada_data_sesi_lokal(awal)).toBe(false);

      simpan_sesi_lokal((sebelumnya) => ({
        ...sebelumnya,
        progres_navigator: {
          ...sebelumnya.progres_navigator,
          id_masalah: "workload_pressure",
          indeks_langkah: 1,
          jawaban_cabang: { subkategori_beban: "excessive_volume" },
        },
        draf_persiapan_percakapan: {
          ...sebelumnya.draf_persiapan_percakapan,
          target_penerima: "manager",
          apa_yang_terjadi_dan_waktu: "Tambahan tiga proyek mendadak dalam dua minggu terakhir.",
        },
      }));

      const tersimpan = baca_sesi_lokal();
      expect(tersimpan.progres_navigator.id_masalah).toBe("workload_pressure");
      expect(tersimpan.progres_navigator.jawaban_cabang.subkategori_beban).toBe("excessive_volume");
      expect(apakah_ada_data_sesi_lokal(tersimpan)).toBe(true);

      // Mengganti domain mereset jawaban cabang lama agar tidak mencemari evaluasi baru
      simpan_sesi_lokal((sebelumnya) => ({
        ...sebelumnya,
        progres_navigator: {
          ...sebelumnya.progres_navigator,
          id_masalah: "employment_rights",
          id_masalah_terdisambiguasi: undefined,
          indeks_langkah: 1,
          jawaban_cabang: {},
        },
      }));
      const setelah_ganti_domain = baca_sesi_lokal();
      expect(setelah_ganti_domain.progres_navigator.id_masalah).toBe("employment_rights");
      expect(setelah_ganti_domain.progres_navigator.jawaban_cabang).toEqual({});

      const mentah_json = penyimpanan_sesi.getItem(KUNCI_SESI_LOKAL) ?? "";
      expect(mentah_json).not.toContain("kata_sandi");
      expect(mentah_json).not.toContain("hash_token");
      expect(mentah_json).not.toContain('voxera_session"');
      expect(mentah_json).not.toContain("__Host-voxera_session");

      const setelah_dihapus = hapus_sesi_lokal();
      expect(setelah_dihapus.progres_navigator.id_masalah).toBeNull();
      expect(apakah_ada_data_sesi_lokal(setelah_dihapus)).toBe(false);
      expect(penyimpanan_sesi.getItem(KUNCI_SESI_LOKAL)).toBeNull();
    });

    it("otomatis memulihkan state kosong yang aman apabila JSON di sessionStorage rusak", () => {
      penyimpanan_sesi.setItem(KUNCI_SESI_LOKAL, "{json-rusak-tidak-valid");
      const pulih = baca_sesi_lokal();
      expect(pulih.versi).toBe(1);
      expect(pulih.perjalanan_dukungan_aktif).toBeNull();
    });
  });

  describe("3. Typed API Client: Navigator, Conversation Prep, Screening Boundary, Scenarios & Directory", () => {
    it("menormalisasi URL dasar API v1 secara konsisten", () => {
      expect(dapatkan_url_dasar_api_v1("http://localhost:4000")).toBe(
        "http://localhost:4000/api/v1",
      );
      expect(dapatkan_url_dasar_api_v1("http://localhost:4000/api/v1/")).toBe(
        "http://localhost:4000/api/v1",
      );
    });

    it("memvalidasi evaluasi navigator (termasuk disambiguasi unsure & P-07) serta batas skrining psikologis", async () => {
      const contoh_batas_skrining = {
        status_ketersediaan: "menunggu_persetujuan_tim_psikologi",
        id_instrumen: null,
        nama_instrumen: null,
        konstruk_psikologis: null,
        peringatan_bukan_diagnosis:
          "Instrumen skrining psikologis sedang menunggu spesifikasi tervalidasi dari tim Psikologi.",
        penyimpanan_diizinkan: "session_local_only",
        dapat_dilewati_kapan_saja: true,
      };

      const fetch_tiruan = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        expect(init?.credentials).toBe("include");
        if (url.endsWith("/navigator/evaluate")) {
          return new Response(JSON.stringify(CONTOH_PERJALANAN_AKTIF), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url.endsWith("/navigator/screening-boundary")) {
          return new Response(JSON.stringify(contoh_batas_skrining), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("{}", { status: 404 });
      });

      vi.stubGlobal("fetch", fetch_tiruan);

      const hasil_perjalanan = await klien_api_voxera.navigator.evaluasi_perjalanan({
        id_masalah: "unsure",
        id_masalah_terdisambiguasi: "bullying_harassment",
        id_subkategori: "sexual_harassment",
        jawaban_cabang: {
          orientasi_disambiguasi: "interpersonal_or_safety",
          bentuk_perlakuan: "sexual_harassment",
          sumber_masalah: "direct_supervisor",
          kekhawatiran_retaliasi: "yes",
        },
        tujuan_langkah_berikutnya: "understand_situation",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      });

      expect(hasil_perjalanan.id_masalah_utama).toBe("bullying_harassment");
      expect(hasil_perjalanan.apakah_atasan_dilewati).toBe(true);
      expect(hasil_perjalanan.rekomendasi_rujukan_profesional.direkomendasikan).toBe(false);

      const skrining = await klien_api_voxera.navigator.ambil_batas_skrining();
      expect(skrining.status_ketersediaan).toBe("menunggu_persetujuan_tim_psikologi");
      expect(skrining.penyimpanan_diizinkan).toBe("session_local_only");
      expect(skrining.dapat_dilewati_kapan_saja).toBe(true);
    });

    it("menyusun draf persiapan percakapan 5-prompt untuk 6 penerima dengan kebijakan session_local_only", async () => {
      const contoh_draf: DrafPercakapan = {
        judul_draf: "Catatan Persiapan Diskusi: Psikolog Profesional",
        target_penerima: "psychologist",
        id_masalah_terkait: "emotional_support",
        pembuka_percakapan:
          "Saya ingin berkonsultasi mengenai tekanan di tempat kerja dan bagaimana kondisi tersebut mulai berdampak pada keseharian serta keseimbangan emosi saya.",
        ringkasan_situasi_dan_waktu:
          "Selama sebulan terakhir, beban kerja dan tekanan target membuat saya terus merasa tegang.",
        pernyataan_dampak: "Sulit tidur malam dan konsentrasi menurun saat pagi hari.",
        rincian_dukungan_dan_hasil:
          "Dukungan yang dibutuhkan: Ruang evaluasi dan strategi regulasi emosi | Hasil yang diharapkan: Rencana pemulihan batas diri yang realistis",
        kalimat_penutup_konstruktif:
          "Berdasarkan gambaran ini, asesmen atau langkah pemulihan psikologis apa yang sebaiknya kita fokuskan terlebih dahulu?",
        panduan_khusus_penerima: [
          "Anda tidak perlu menggunakan istilah klinis; ceritakan apa yang Anda alami dan rasakan secara apa adanya.",
          "Sampaikan dampak nyata pada pola tidur, energi, konsentrasi, atau fungsi keseharian Anda.",
        ],
        hal_yang_perlu_dihindari: [
          "Menyembunyikan dampak emosional yang berat karena khawatir dianggap kurang tangguh.",
          "Mengharapkan putusan hukum ketenagakerjaan dari sesi konsultasi psikologis.",
        ],
        naskah_siap_salin:
          "[Catatan Persiapan Komunikasi - Tujuan: Psikolog Profesional]\n\n1. Pembuka: Saya ingin berkonsultasi...",
        peringatan_privasi_penerima:
          "Catatan persiapan konsultasi psikolog ini 100% berada di sesi lokal peramban Anda (session_local_only) dan tidak pernah disimpan di database VOXERA.",
        kebijakan_penyimpanan: "session_local_only",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify(contoh_draf), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      const draf = await klien_api_voxera.alat_bantu.susun_draf_percakapan({
        target_penerima: "psychologist",
        id_masalah_terkait: "emotional_support",
        apa_yang_terjadi_dan_waktu:
          "Selama sebulan terakhir, beban kerja dan tekanan target membuat saya terus merasa tegang.",
        dampak_pada_pekerjaan_atau_kondisi:
          "Sulit tidur malam dan konsentrasi menurun saat pagi hari.",
        konteks_peran_tanpa_nama_wajib: "Anggota tim operasional",
        dukungan_yang_dibutuhkan: "Ruang evaluasi dan strategi regulasi emosi",
        hasil_yang_diharapkan: "Rencana pemulihan batas diri yang realistis",
      });

      expect(draf.target_penerima).toBe("psychologist");
      expect(draf.kebijakan_penyimpanan).toBe("session_local_only");
      expect(draf.judul_draf).not.toContain("—");
    });

    it("memastikan klien_api_voxera.alat_bantu hanya memanggil 4 endpoint Fase 4 yang disetujui (/tools/conversation-prep, /tools/scenarios, /tools/meaning-reflection, /tools/support-directory)", async () => {
      expect(Object.keys(klien_api_voxera.alat_bantu)).toEqual([
        "susun_draf_percakapan",
        "ambil_daftar_skenario",
        "evaluasi_refleksi_makna",
        "ambil_direktori_dukungan",
      ]);

      const daftar_panggilan: Array<{ url: string; method: string }> = [];
      const fetch_tiruan = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        daftar_panggilan.push({ url, method: init?.method ?? "GET" });
        if (url.endsWith("/tools/scenarios")) {
          return new Response(
            JSON.stringify({
              daftar_skenario: [
                {
                  id_skenario: "skenario_1",
                  judul: "Skenario 1",
                  id_pilar: "work_wellbeing",
                  id_masalah_terkait: "workload_pressure",
                  narasi_situasi: "Narasi situasi kerja yang cukup panjang untuk validasi kontrak.",
                  pertanyaan_keputusan: "Pertanyaan keputusan skenario?",
                  daftar_opsi: [
                    {
                      id_opsi: "opsi_a",
                      label_tindakan: "Tindakan A",
                      pertimbangan_utama: "Pertimbangan utama tindakan A.",
                      implikasi_potensial: "Implikasi potensial tindakan A.",
                      opsi_dukungan_relevan: ["manager_discussion"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan A.",
                    },
                    {
                      id_opsi: "opsi_b",
                      label_tindakan: "Tindakan B",
                      pertimbangan_utama: "Pertimbangan utama tindakan B.",
                      implikasi_potensial: "Implikasi potensial tindakan B.",
                      opsi_dukungan_relevan: ["self_guided_resource"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan B.",
                    },
                    {
                      id_opsi: "opsi_c",
                      label_tindakan: "Tindakan C",
                      pertimbangan_utama: "Pertimbangan utama tindakan C.",
                      implikasi_potensial: "Implikasi potensial tindakan C.",
                      opsi_dukungan_relevan: ["hr_workplace_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan C.",
                    },
                  ],
                  pelajaran_multidisiplin: "Pelajaran multidisiplin yang cukup panjang.",
                  tautan_perjalanan_dukungan: "/navigate?issue=workload_pressure",
                },
                {
                  id_skenario: "skenario_2",
                  judul: "Skenario 2",
                  id_pilar: "safe_workplace",
                  id_masalah_terkait: "bullying_harassment",
                  narasi_situasi: "Narasi situasi kerja kedua yang cukup panjang.",
                  pertanyaan_keputusan: "Pertanyaan keputusan skenario kedua?",
                  daftar_opsi: [
                    {
                      id_opsi: "opsi_a",
                      label_tindakan: "Tindakan A",
                      pertimbangan_utama: "Pertimbangan utama tindakan A.",
                      implikasi_potensial: "Implikasi potensial tindakan A.",
                      opsi_dukungan_relevan: ["employee_protection"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan A.",
                    },
                    {
                      id_opsi: "opsi_b",
                      label_tindakan: "Tindakan B",
                      pertimbangan_utama: "Pertimbangan utama tindakan B.",
                      implikasi_potensial: "Implikasi potensial tindakan B.",
                      opsi_dukungan_relevan: ["hr_workplace_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan B.",
                    },
                    {
                      id_opsi: "opsi_c",
                      label_tindakan: "Tindakan C",
                      pertimbangan_utama: "Pertimbangan utama tindakan C.",
                      implikasi_potensial: "Implikasi potensial tindakan C.",
                      opsi_dukungan_relevan: ["psychological_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan C.",
                    },
                  ],
                  pelajaran_multidisiplin: "Pelajaran multidisiplin skenario kedua.",
                  tautan_perjalanan_dukungan: "/navigate?issue=bullying_harassment",
                },
                {
                  id_skenario: "skenario_3",
                  judul: "Skenario 3",
                  id_pilar: "know_your_rights",
                  id_masalah_terkait: "employment_rights",
                  narasi_situasi: "Narasi situasi kerja ketiga yang cukup panjang.",
                  pertanyaan_keputusan: "Pertanyaan keputusan skenario ketiga?",
                  daftar_opsi: [
                    {
                      id_opsi: "opsi_a",
                      label_tindakan: "Tindakan A",
                      pertimbangan_utama: "Pertimbangan utama tindakan A.",
                      implikasi_potensial: "Implikasi potensial tindakan A.",
                      opsi_dukungan_relevan: ["legal_information"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan A.",
                    },
                    {
                      id_opsi: "opsi_b",
                      label_tindakan: "Tindakan B",
                      pertimbangan_utama: "Pertimbangan utama tindakan B.",
                      implikasi_potensial: "Implikasi potensial tindakan B.",
                      opsi_dukungan_relevan: ["legal_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan B.",
                    },
                    {
                      id_opsi: "opsi_c",
                      label_tindakan: "Tindakan C",
                      pertimbangan_utama: "Pertimbangan utama tindakan C.",
                      implikasi_potensial: "Implikasi potensial tindakan C.",
                      opsi_dukungan_relevan: ["hr_workplace_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan C.",
                    },
                  ],
                  pelajaran_multidisiplin: "Pelajaran multidisiplin skenario ketiga.",
                  tautan_perjalanan_dukungan: "/navigate?issue=employment_rights",
                },
                {
                  id_skenario: "skenario_4",
                  judul: "Skenario 4",
                  id_pilar: "career_growth",
                  id_masalah_terkait: "digital_adaptation",
                  narasi_situasi: "Narasi situasi kerja keempat yang cukup panjang.",
                  pertanyaan_keputusan: "Pertanyaan keputusan skenario keempat?",
                  daftar_opsi: [
                    {
                      id_opsi: "opsi_a",
                      label_tindakan: "Tindakan A",
                      pertimbangan_utama: "Pertimbangan utama tindakan A.",
                      implikasi_potensial: "Implikasi potensial tindakan A.",
                      opsi_dukungan_relevan: ["career_support"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan A.",
                    },
                    {
                      id_opsi: "opsi_b",
                      label_tindakan: "Tindakan B",
                      pertimbangan_utama: "Pertimbangan utama tindakan B.",
                      implikasi_potensial: "Implikasi potensial tindakan B.",
                      opsi_dukungan_relevan: ["manager_discussion"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan B.",
                    },
                    {
                      id_opsi: "opsi_c",
                      label_tindakan: "Tindakan C",
                      pertimbangan_utama: "Pertimbangan utama tindakan C.",
                      implikasi_potensial: "Implikasi potensial tindakan C.",
                      opsi_dukungan_relevan: ["self_guided_resource"],
                      pendekatan_alternatif: "Pendekatan alternatif tindakan C.",
                    },
                  ],
                  pelajaran_multidisiplin: "Pelajaran multidisiplin skenario keempat.",
                  tautan_perjalanan_dukungan: "/navigate?issue=digital_adaptation",
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/tools/meaning-reflection")) {
          return new Response(
            JSON.stringify({
              ringkasan_refleksi_non_klinis:
                "Ringkasan refleksi kualitatif makna kerja berdasarkan materi kuliah Psikologi Kerja yang diberikan.",
              kaitan_konsep_psikologi_kerja: [
                "Positive Meaning in Work (Pertemuan 1: Meaning of Work)",
                "Kebutuhan Otonomi (Self-Determination Theory, Pertemuan 2)",
              ],
              langkah_pengembangan_konstruktif: [
                "Tetapkan blok waktu kerja fokus tanpa interupsi notifikasi non-darurat.",
                "Diskusikan dukungan pengembangan kompetensi bersama manajer atau mentor karier.",
              ],
              tautan_persiapan_percakapan:
                "/prepare?recipient=career_professional&issue=career_growth",
              catatan_batas_non_asesmen:
                "Refleksi makna kerja ini merupakan alat pemetaan diri kualitatif (bukan instrumen skrining psikologis).",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.includes("/tools/support-directory")) {
          return new Response(
            JSON.stringify({
              daftar_layanan: [
                {
                  kode_sumber_daya: "dir_psikolog_klinis_kerja",
                  nama_layanan: "Layanan Konsultasi Psikolog Berlisensi",
                  id_tipe_dukungan: "psychological_support",
                  kategori_layanan: "psychological",
                  deskripsi_peran:
                    "Psikolog dapat memberikan asesmen dan intervensi psikologis profesional sesuai kompetensi, kualifikasi, dan ruang lingkup praktiknya.",
                  kapan_tepat_digunakan: [
                    "Saat tekanan kerja mengganggu tidur atau fungsi keseharian.",
                    "Saat membutuhkan ruang evaluasi psikologis rahasia.",
                  ],
                  batas_kewenangan: [
                    "Cakupan layanan mengikuti kompetensi dan ruang lingkup praktik masing-masing psikolog.",
                  ],
                  harapan_kerahasiaan: "Dijamin oleh Kode Etik Psikologi Indonesia.",
                  persiapan_sebelum_menghubungi: [
                    "Catat sejak kapan beban emosional dirasakan.",
                    "Gunakan alat Persiapan Percakapan VOXERA.",
                  ],
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response("{}", { status: 404 });
      });

      vi.stubGlobal("fetch", fetch_tiruan);

      const hasil_skenario = await klien_api_voxera.alat_bantu.ambil_daftar_skenario();
      expect(hasil_skenario.daftar_skenario).toHaveLength(4);

      const hasil_refleksi = await klien_api_voxera.alat_bantu.evaluasi_refleksi_makna({
        orientasi_saat_ini: "career_orientation",
        dimensi_makna_utama: "positive_meaning_in_work",
        kebutuhan_sdt_prioritas: "autonomy_control",
        tantangan_kerja_digital: "information_overload_distraction",
      });
      expect(hasil_refleksi.tautan_persiapan_percakapan).toBe(
        "/prepare?recipient=career_professional&issue=career_growth",
      );

      const hasil_direktori = await klien_api_voxera.alat_bantu.ambil_direktori_dukungan({
        kategori_layanan: "psychological",
      });
      expect(hasil_direktori.daftar_layanan).toHaveLength(1);

      expect(daftar_panggilan.map((p) => `${p.method} ${new URL(p.url).pathname}`)).toEqual([
        "GET /api/v1/tools/scenarios",
        "POST /api/v1/tools/meaning-reflection",
        "GET /api/v1/tools/support-directory",
      ]);
    });
  });

  describe("4. Authentication & My Journey Continuity Client Flows", () => {
    it("menjalankan alur register, login, cek sesi, simpan perjalanan, perbarui status langkah, hapus perjalanan, logout, serta menangani galat 401/503", async () => {
      const contoh_auth: ResponsAutentikasi = {
        kedaluwarsa_pada: "2026-11-14T12:00:00.000Z",
        pengguna: {
          id_pengguna: "11111111-1111-4111-8111-111111111111",
          email: "raka@contoh.id",
          nama_alias: "Raka",
          dibuat_pada: "2026-11-07T12:00:00.000Z",
        },
      };

      const contoh_perjalanan_tersimpan: PerjalananTersimpan = {
        id_perjalanan: "22222222-2222-4222-8222-222222222222",
        id_pengguna: "11111111-1111-4111-8111-111111111111",
        id_masalah_utama: "workload_pressure",
        id_subkategori: "excessive_volume",
        kelas_hasil_utama: "prepare",
        jalur_dukungan_utama: "manager_discussion",
        status_perjalanan: "aktif",
        daftar_langkah: [
          {
            id_langkah: "33333333-3333-4333-8333-333333333333",
            id_perjalanan: "22222222-2222-4222-8222-222222222222",
            urutan_langkah: 1,
            kode_langkah: "audit_workload_capacity",
            id_tipe_dukungan: "self_guided_resource",
            status_langkah: "sedang_berjalan",
            diperbarui_pada: "2026-11-07T12:05:00.000Z",
          },
        ],
        dibuat_pada: "2026-11-07T12:00:00.000Z",
        diperbarui_pada: "2026-11-07T12:05:00.000Z",
      };

      const fetch_tiruan = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        expect(init?.credentials).toBe("include");
        if (url.endsWith("/auth/register")) {
          return new Response(JSON.stringify(contoh_auth), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url.endsWith("/my-journey") && init?.method === "GET") {
          return new Response(
            JSON.stringify({
              pengguna: contoh_auth.pengguna,
              daftar_perjalanan: [contoh_perjalanan_tersimpan],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/my-journey/journeys") && init?.method === "POST") {
          return new Response(JSON.stringify(contoh_perjalanan_tersimpan), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url.includes("/steps/") && init?.method === "PATCH") {
          return new Response(
            JSON.stringify({
              ...contoh_perjalanan_tersimpan.daftar_langkah[0],
              status_langkah: "selesai",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/auth/logout")) {
          return new Response(
            JSON.stringify({ berhasil: true, pesan: "Sesi berhasil diakhiri." }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/auth/account") && init?.method === "DELETE") {
          return new Response(
            JSON.stringify({
              berhasil: true,
              pesan:
                "Akun dan seluruh perjalanan tersimpan di server berhasil dihapus secara permanen.",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        if (url.endsWith("/auth/login")) {
          return new Response(
            JSON.stringify({
              kode: "LAYANAN_DATABASE_TIDAK_TERSEDIA",
              pesan:
                "Layanan penyimpanan akun sedang tidak tersedia. Fitur eksplorasi utama tetap dapat digunakan tanpa akun.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response("{}", { status: 404 });
      });

      vi.stubGlobal("fetch", fetch_tiruan);

      const terdaftar = await klien_api_voxera.autentikasi.daftar({
        email: "raka@contoh.id",
        nama_alias: "Raka",
        kata_sandi: "SandiAman123!",
      });
      expect(terdaftar.pengguna.nama_alias).toBe("Raka");

      const tersimpan = await klien_api_voxera.perjalanan_saya.simpan_perjalanan({
        id_masalah_utama: "workload_pressure",
        id_subkategori: "excessive_volume",
        kelas_hasil_utama: "prepare",
        jalur_dukungan_utama: "manager_discussion",
        daftar_langkah: [
          {
            urutan_langkah: 1,
            kode_langkah: "audit_workload_capacity",
            id_tipe_dukungan: "self_guided_resource",
            status_langkah: "sedang_berjalan",
          },
        ],
      });
      expect(tersimpan.id_masalah_utama).toBe("workload_pressure");

      const ringkasan = await klien_api_voxera.perjalanan_saya.ambil_ringkasan();
      expect(ringkasan.daftar_perjalanan).toHaveLength(1);

      const langkah_diperbarui = await klien_api_voxera.perjalanan_saya.perbarui_status_langkah(
        tersimpan.id_perjalanan,
        tersimpan.daftar_langkah[0]!.id_langkah,
        { status_langkah: "selesai" },
      );
      expect(langkah_diperbarui.status_langkah).toBe("selesai");

      const keluar = await klien_api_voxera.autentikasi.keluar();
      expect(keluar.berhasil).toBe(true);

      const hapus_akun = await klien_api_voxera.autentikasi.hapus_akun();
      expect(hapus_akun.berhasil).toBe(true);

      const janji_masuk_503 = klien_api_voxera.autentikasi.masuk({
        email: "raka@contoh.id",
        kata_sandi: "SandiAman123!",
      });
      await expect(janji_masuk_503).rejects.toBeInstanceOf(GalatApiKlien);
      await expect(janji_masuk_503).rejects.toMatchObject({
        status: 503,
        kode: "LAYANAN_DATABASE_TIDAK_TERSEDIA",
      });
    });

    it("mengekstrak header Retry-After secara deterministik saat menerima respons batas laju HTTP 429", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              kode: "TERLALU_BANYAK_PERMINTAAN_AUTH",
              pesan: "Terlalu banyak percobaan autentikasi.",
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": "900",
              },
            },
          ),
        ),
      );

      const janji_masuk_429 = klien_api_voxera.autentikasi.masuk({
        email: "raka@contoh.id",
        kata_sandi: "SandiAman123!",
      });
      await expect(janji_masuk_429).rejects.toBeInstanceOf(GalatApiKlien);
      await expect(janji_masuk_429).rejects.toMatchObject({
        status: 429,
        kode: "TERLALU_BANYAK_PERMINTAAN_AUTH",
        retry_after_detik: 900,
      });
    });
  });

  describe("5. Rendering Views: Navigator, Journey, Prepare, Scenarios, My Journey & Modals", () => {
    it("merender seluruh tampilan halaman utama, batas skrining psikologis jujur, 6 penerima persiapan percakapan, skenario, dan batas penyimpanan Opsi B", () => {
      const state_awal = buat_state_sesi_lokal_kosong();
      expect(state_awal.draf_persiapan_percakapan.target_penerima).toBe("manager");

      const html_navigator = renderToStaticMarkup(
        <AppProviders>
          <IssueNavigatorView />
        </AppProviders>,
      );
      expect(html_navigator).toContain("Pemetaan Situasi &amp; Kebutuhan Dukungan Kerja");
      expect(html_navigator).not.toContain("—");

      const html_journey = renderToStaticMarkup(
        <AppProviders>
          <SupportJourneyView />
        </AppProviders>,
      );
      expect(html_journey).toContain(
        "Batas Etik Pemeriksaan Awal Kesejahteraan Psikologis (Non-Diagnostik)",
      );
      expect(html_journey).toContain("Tidak Mengarang Kuesioner");
      expect(html_journey).toContain("session_local_only");
      expect(html_journey).not.toContain("—");

      const html_prepare = renderToStaticMarkup(
        <AppProviders>
          <ConversationPrepView />
        </AppProviders>,
      );
      expect(html_prepare).toContain("1. Pilih Pihak Tujuan Diskusi / Konsultasi (6 Penerima)");
      expect(html_prepare).toContain("Prompt 1:");
      expect(html_prepare).toContain("Prompt 5:");
      expect(html_prepare).not.toContain("—");

      const html_scenarios = renderToStaticMarkup(
        <AppProviders>
          <ScenariosView />
        </AppProviders>,
      );
      expect(html_scenarios).toContain("4 Skenario Keputusan Kerja Interaktif");
      expect(html_scenarios).toContain("Eksplorasi Skenario Situasi Tempat Kerja");
      expect(html_scenarios).not.toContain("—");

      const html_my_journey = renderToStaticMarkup(
        <AppProviders>
          <MyJourneyView />
        </AppProviders>,
      );
      expect(html_my_journey).toContain(
        "Transparansi Batas Penyimpanan Data (Minimisasi Data Opsi B)",
      );
      expect(html_my_journey).toContain("Masuk ke Akun Kontinuitas");
      expect(html_my_journey).toContain("Buat Akun Baru (Alias)");
      expect(html_my_journey).toContain("Tampilkan kata sandi");
      expect(html_my_journey).not.toContain("—");

      const html_shell = renderToStaticMarkup(
        <AppProviders>
          <PageShell>
            <HomeView />
          </PageShell>
        </AppProviders>,
      );
      expect(html_shell).toContain("Navigasi samping dashboard");
      expect(html_shell).toContain("Navigasi cepat seluler");
      expect(html_shell).toContain("Sesi Lokal Privat");
      expect(html_shell).not.toContain("—");

      // Pastikan tidak ada atribusi akademik yang tidak didukung di seluruh tampilan
      for (const html_halaman of [
        html_navigator,
        html_journey,
        html_prepare,
        html_scenarios,
        html_my_journey,
      ]) {
        expect(html_halaman).not.toMatch(
          /Wrzesniewski|Steger|Boundary Theory|Hackman|Oldham|Schein/i,
        );
      }

      const html_modal_darurat = renderToStaticMarkup(
        <UrgentSupportModal terbuka={true} tutup={() => {}} />,
      );
      expect(html_modal_darurat).toContain("Bantuan Darurat &amp; Keselamatan Diri");
      // 4 Kategori terpisah secara jelas (Section 9-13)
      expect(html_modal_darurat).toContain(
        "1. Darurat Keselamatan Fisik Langsung (Immediate Physical Emergency)",
      );
      expect(html_modal_darurat).toContain(
        "pada wilayah pemerintah daerah yang telah mendukung integrasi layanan 112",
      );
      expect(html_modal_darurat).toContain(
        "2. Tekanan Psikologis Berat / Risiko Membahayakan Diri (Kemenkes RI)",
      );
      expect(html_modal_darurat).toContain("Healing119.id");
      expect(html_modal_darurat).toContain("119 ext. 8");
      expect(html_modal_darurat).toContain("pertolongan pertama psikologis");
      expect(html_modal_darurat).toContain("bukan terapi psikologis jangka panjang");
      expect(html_modal_darurat).toContain("3. Kekerasan terhadap Perempuan dan Anak (SAPA 129)");
      expect(html_modal_darurat).toContain("08-111-129-129");
      expect(html_modal_darurat).toContain(
        "mandat khusus perlindungan perempuan dan anak, bukan saluran keluhan kerja umum",
      );
      expect(html_modal_darurat).toContain("4. Pelecehan atau Kekerasan Seksual di Tempat Kerja");
      expect(html_modal_darurat).toContain(
        "Satgas Pencegahan dan Penanganan Kekerasan Seksual di perusahaan, jika tersedia / telah dibentuk",
      );

      const html_modal_bersih = renderToStaticMarkup(
        <ClearSessionModal
          terbuka={true}
          ada_data_lokal={true}
          tutup={() => {}}
          konfirmasi_bersihkan={() => {}}
        />,
      );
      expect(html_modal_bersih).toContain("voxera_session_v1");

      const html_batas_simpan = renderToStaticMarkup(<SaveBoundaryCard />);
      expect(html_batas_simpan).toContain("Yang Dapat Disimpan ke Akun Opsional:");
      expect(html_batas_simpan).toContain(
        "Yang Tidak Pernah Disimpan ke Server (Khusus Sesi Peramban):",
      );
    });
  });
});
