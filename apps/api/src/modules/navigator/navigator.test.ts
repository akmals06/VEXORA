import {
  skema_batas_konfigurasi_skrining,
  skema_perjalanan_dukungan,
  skema_respons_katalog_masalah,
} from "@voxera/contracts";
import type { Express } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { buat_aplikasi } from "../../app.js";

describe("Modul Navigator — VOXERA Phase 4", () => {
  const aplikasi: Express = buat_aplikasi();

  describe("GET /api/v1/navigator/catalog", () => {
    it("mengembalikan 10 domain masalah kerja non-klinis dan memenuhi kontrak Zod", async () => {
      const respons = await request(aplikasi).get("/api/v1/navigator/catalog");

      expect(respons.status).toBe(200);
      const validasi = skema_respons_katalog_masalah.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.daftar_masalah).toHaveLength(10);
      const daftar_id = respons.body.daftar_masalah.map(
        (m: { id_masalah: string }) => m.id_masalah,
      );
      expect(daftar_id).toContain("workload_pressure");
      expect(daftar_id).toContain("workplace_relationships");
      expect(daftar_id).toContain("bullying_harassment");
      expect(daftar_id).toContain("discrimination_fairness");
      expect(daftar_id).toContain("role_clarity");
      expect(daftar_id).toContain("employment_rights");
      expect(daftar_id).toContain("career_growth");
      expect(daftar_id).toContain("digital_adaptation");
      expect(daftar_id).toContain("emotional_support");
      expect(daftar_id).toContain("unsure");

      for (const domain of respons.body.daftar_masalah) {
        expect(domain.daftar_pertanyaan_cabang.length).toBeGreaterThanOrEqual(1);
        expect(domain.landasan_akademik_hukum.length).toBeGreaterThanOrEqual(1);
        expect(domain.contoh_situasi.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("POST /api/v1/navigator/evaluate", () => {
    it("mengevaluasi domain workload_pressure secara deterministik dan memenuhi skema perjalanan dukungan", async () => {
      const payload = {
        id_masalah: "workload_pressure",
        id_subkategori: "always_on_expectations",
        jawaban_cabang: {
          sumber_beban: "excessive_volume",
          pola_waktu: "regular_after_hours",
        },
        tujuan_langkah_berikutnya: "prepare_conversation",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      const validasi = skema_perjalanan_dukungan.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.id_masalah_utama).toBe("workload_pressure");
      expect(respons.body.kelas_hasil_utama).toBe("prepare");
      expect(respons.body.daftar_langkah_rekomendasi.length).toBeGreaterThanOrEqual(2);

      // Verifikasi penjaga etik wajib non-diagnostik & non-adjudikatif
      const kode_penjaga = respons.body.daftar_peringatan_penjaga.map(
        (p: { kode: string }) => p.kode,
      );
      expect(kode_penjaga).toContain("non_diagnostic_boundary");
      expect(kode_penjaga).toContain("non_legal_verdict_boundary");
    });

    it("melakukan disambiguasi domain 'unsure' ke domain spesifik yang dipilih", async () => {
      const payload = {
        id_masalah: "unsure",
        id_masalah_terdisambiguasi: "role_clarity",
        id_subkategori: "default",
        jawaban_cabang: {
          orientasi_disambiguasi: "role_or_expectations",
        },
        tujuan_langkah_berikutnya: "understand_situation",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      expect(respons.body.id_masalah_utama).toBe("role_clarity");
    });

    it("menolak permintaan evaluasi 'unsure' tanpa id_masalah_terdisambiguasi (HTTP 400)", async () => {
      const payload = {
        id_masalah: "unsure",
        id_subkategori: "default",
        jawaban_cabang: {},
        tujuan_langkah_berikutnya: "understand_situation",
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(400);
      expect(respons.body.kode).toBe("VALIDASI_BODY_GAGAL");
    });

    it("memicu Chain-of-Command Bypass ketika sumber masalah melibatkan direct_supervisor", async () => {
      const payload = {
        id_masalah: "bullying_harassment",
        id_subkategori: "default",
        jawaban_cabang: {
          sumber_masalah: "direct_supervisor",
          bentuk_perlakuan: "verbal_intimidation_bullying",
        },
        tujuan_langkah_berikutnya: "explore_support_options",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      expect(respons.body.apakah_atasan_dilewati).toBe(true);

      // Verifikasi peringatan chain-of-command bypass
      const kode_penjaga = respons.body.daftar_peringatan_penjaga.map(
        (p: { kode: string }) => p.kode,
      );
      expect(kode_penjaga).toContain("chain_of_command_bypass");

      // Verifikasi tidak mengarahkan secara tunggal ke diskusi atasan langsung
      expect(respons.body.jalur_dukungan_utama).not.toBe("manager_discussion");
    });

    it("memicu prioritas hak dasar & kondisi kerja (Hygiene Factor) pada masalah lembur/upah", async () => {
      const payload = {
        id_masalah: "employment_rights",
        id_subkategori: "termination_contract",
        jawaban_cabang: {
          kondisi_komunikasi: "dispute_or_pressure",
          jenis_hak: "severance_compensation",
        },
        tujuan_langkah_berikutnya: "understand_situation",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      const kode_penjaga = respons.body.daftar_peringatan_penjaga.map(
        (p: { kode: string }) => p.kode,
      );
      expect(kode_penjaga).toContain("hygiene_rights_protection_priority");
    });

    it("memicu rujukan profesional (P-07) jika pengguna melaporkan hambatan fungsi harian atau meminta konseling", async () => {
      const payload = {
        id_masalah: "emotional_support",
        id_subkategori: "default",
        jawaban_cabang: {
          kebutuhan_dukungan_emosional: "emotional_exhaustion_coping",
        },
        tujuan_langkah_berikutnya: "request_professional_support",
        meminta_dukungan_psikolog_konselor: true,
        melaporkan_hambatan_fungsi_harian: true,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      expect(respons.body.rekomendasi_rujukan_profesional.direkomendasikan).toBe(true);
      expect(respons.body.rekomendasi_rujukan_profesional.alasan_pemicu).toContain(
        "explicit_employee_request",
      );
      expect(respons.body.rekomendasi_rujukan_profesional.alasan_pemicu).toContain(
        "self_reported_daily_functioning_interference",
      );

      // Peringatan batas kerahasiaan & keamanan diri
      const kode_penjaga = respons.body.daftar_peringatan_penjaga.map(
        (p: { kode: string }) => p.kode,
      );
      expect(kode_penjaga).toContain("confidential_psychological_boundary");
    });

    it("Kasus Regresi 1: Isu pelecehan seksual mengaktifkan proteksi tempat kerja & hak normatif tanpa rujukan psikologis otomatis (P-07)", async () => {
      const payload = {
        id_masalah: "bullying_harassment",
        id_subkategori: "default",
        jawaban_cabang: {
          bentuk_perlakuan: "sexual_harassment",
          sumber_masalah: "peer_or_other",
          kekhawatiran_retaliasi: "yes",
        },
        tujuan_langkah_berikutnya: "explore_support_options",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      // Prioritas perlindungan tempat kerja & pencegahan kekerasan seksual (Kepmenaker 88/2023, Satgas PPKST)
      expect(respons.body.kelas_hasil_utama).toBe("employee_protection");
      expect(respons.body.jalur_dukungan_utama).toBe("employee_protection");

      // Dukungan psikologis dan hukum tetap tersedia dan terlihat jelas di opsi sekunder (sukarela)
      expect(respons.body.jalur_dukungan_sekunder).toContain("psychological_support");
      expect(respons.body.jalur_dukungan_sekunder).toContain("legal_support");

      // P-07: TIDAK menyimpulkan rujukan klinis/psikologis otomatis tanpa permintaan atau hambatan fungsi harian
      expect(respons.body.rekomendasi_rujukan_profesional.direkomendasikan).toBe(false);
      expect(respons.body.rekomendasi_rujukan_profesional.alasan_pemicu).toHaveLength(0);
    });

    it("Kasus Regresi 2: Isu pelecehan seksual + permintaan eksplisit pengguna memicu rujukan profesional (P-07)", async () => {
      const payload = {
        id_masalah: "bullying_harassment",
        id_subkategori: "default",
        jawaban_cabang: {
          bentuk_perlakuan: "sexual_harassment",
          sumber_masalah: "peer_or_other",
          kekhawatiran_retaliasi: "no_or_unsure",
        },
        tujuan_langkah_berikutnya: "request_professional_support",
        meminta_dukungan_psikolog_konselor: true,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons = await request(aplikasi).post("/api/v1/navigator/evaluate").send(payload);

      expect(respons.status).toBe(200);
      // Rujukan aktif karena ada permintaan eksplisit pengguna
      expect(respons.body.rekomendasi_rujukan_profesional.direkomendasikan).toBe(true);
      expect(respons.body.rekomendasi_rujukan_profesional.alasan_pemicu).toContain(
        "explicit_employee_request",
      );
      expect(respons.body.rekomendasi_rujukan_profesional.alasan_pemicu).not.toContain(
        "approved_ethical_referral_rule",
      );
    });

    it("Kasus Regresi 3: Arsitektur rujukan mendukung evaluasi instrumen masa depan tanpa fabrikasi cutoff atau instrumen buatan", async () => {
      // 1. Skrining boundary belum diisi instrumen (menunggu persetujuan tim psikologi)
      const respons_batas = await request(aplikasi).get("/api/v1/navigator/screening-boundary");
      expect(respons_batas.status).toBe(200);
      expect(respons_batas.body.status_ketersediaan).toBe("menunggu_persetujuan_tim_psikologi");
      expect(respons_batas.body.id_instrumen).toBeNull();
      expect(respons_batas.body.nama_instrumen).toBeNull();

      // 2. Evaluasi navigator tanpa permintaan eksplisit atau hambatan harian tidak memicu rujukan
      const payload_tanpa_rujukan = {
        id_masalah: "workload_pressure",
        id_subkategori: "default",
        jawaban_cabang: {},
        tujuan_langkah_berikutnya: "understand_situation",
        meminta_dukungan_psikolog_konselor: false,
        melaporkan_hambatan_fungsi_harian: false,
      };

      const respons_eval = await request(aplikasi)
        .post("/api/v1/navigator/evaluate")
        .send(payload_tanpa_rujukan);

      expect(respons_eval.status).toBe(200);
      expect(respons_eval.body.rekomendasi_skrining_psikologis.status_instrumen).toBe(
        "menunggu_instrumen_tim_psikologi",
      );
      expect(respons_eval.body.rekomendasi_rujukan_profesional.direkomendasikan).toBe(false);
      expect(respons_eval.body.rekomendasi_rujukan_profesional.alasan_pemicu).toHaveLength(0);
    });
  });

  describe("GET /api/v1/navigator/screening-boundary", () => {
    it("mengembalikan konfigurasi skrining instrument-agnostic menunggu persetujuan tim psikologi", async () => {
      const respons = await request(aplikasi).get("/api/v1/navigator/screening-boundary");

      expect(respons.status).toBe(200);
      const validasi = skema_batas_konfigurasi_skrining.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.status_ketersediaan).toBe("menunggu_persetujuan_tim_psikologi");
      expect(respons.body.id_instrumen).toBeNull();
      expect(respons.body.nama_instrumen).toBeNull();
      expect(respons.body.penyimpanan_diizinkan).toBe("session_local_only");
      expect(respons.body.dapat_dilewati_kapan_saja).toBe(true);
    });
  });
});
