import {
  skema_draf_percakapan,
  skema_hasil_refleksi_makna_kerja,
  skema_respons_daftar_skenario,
  skema_respons_direktori_dukungan,
} from "@voxera/contracts";
import type { Express } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { buat_aplikasi } from "../../app.js";

describe("Modul Alat Bantu Interaktif — VEXORA Phase 4", () => {
  const aplikasi: Express = buat_aplikasi();

  describe("POST /api/v1/tools/conversation-prep", () => {
    const daftar_penerima = [
      "manager",
      "hr",
      "psychologist",
      "counselor",
      "legal_professional",
      "career_professional",
    ] as const;

    for (const penerima of daftar_penerima) {
      it(`menghasilkan draf 5-prompt untuk penerima '${penerima}' dengan batas kerahasiaan session_local_only`, async () => {
        const payload = {
          target_penerima: penerima,
          id_masalah_terkait: "workload_pressure",
          apa_yang_terjadi_dan_waktu:
            "Penambahan tugas mendadak di luar jam kerja normal selama dua minggu berturut-turut.",
          dampak_pada_pekerjaan_atau_kondisi:
            "Kualitas laporan menurun dan waktu pemulihan istirahat harian terganggu.",
          konteks_peran_tanpa_nama_wajib: "Staf operasional dan manajer proyek",
          dukungan_yang_dibutuhkan: "Penyelarasan tenggat waktu dan penataan jam kerja fokus",
          hasil_yang_diharapkan:
            "Ekspektasi kerja yang terukur dan disepakati bersama secara tertulis",
        };

        const respons = await request(aplikasi)
          .post("/api/v1/tools/conversation-prep")
          .send(payload);

        expect(respons.status).toBe(200);
        const validasi = skema_draf_percakapan.safeParse(respons.body);
        expect(validasi.success).toBe(true);

        expect(respons.body.target_penerima).toBe(penerima);
        expect(respons.body.pembuka_percakapan).toBeDefined();
        expect(respons.body.ringkasan_situasi_dan_waktu).toBeDefined();
        expect(respons.body.pernyataan_dampak).toBeDefined();
        expect(respons.body.rincian_dukungan_dan_hasil).toBeDefined();
        expect(respons.body.kalimat_penutup_konstruktif).toBeDefined();
        expect(respons.body.naskah_siap_salin.length).toBeGreaterThanOrEqual(30);
        expect(respons.body.kebijakan_penyimpanan).toBe("session_local_only");
        expect(respons.body.peringatan_privasi_penerima).toContain("peramban");
      });
    }

    it("menolak permohonan dengan penerima tidak valid (HTTP 400)", async () => {
      const respons = await request(aplikasi).post("/api/v1/tools/conversation-prep").send({
        target_penerima: "penerima_tidak_dikenal",
        id_masalah_terkait: "workload_pressure",
        apa_yang_terjadi_dan_waktu: "Kejadian yang cukup panjang untuk divalidasi.",
        dampak_pada_pekerjaan_atau_kondisi: "Dampak pada pekerjaan.",
        dukungan_yang_dibutuhkan: "Dukungan yang diharapkan.",
        hasil_yang_diharapkan: "Hasil yang diinginkan bersama.",
      });

      expect(respons.status).toBe(400);
      expect(respons.body.kode).toBe("VALIDASI_BODY_GAGAL");
    });
  });

  describe("GET /api/v1/tools/scenarios", () => {
    it("mengembalikan 4 skenario kerja kurasi dengan pertimbangan multidisiplin dan pendekatan alternatif", async () => {
      const respons = await request(aplikasi).get("/api/v1/tools/scenarios");

      expect(respons.status).toBe(200);
      const validasi = skema_respons_daftar_skenario.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.daftar_skenario).toHaveLength(4);
      const id_skenario = respons.body.daftar_skenario.map(
        (s: { id_skenario: string }) => s.id_skenario,
      );
      expect(id_skenario).toContain("skenario_beban_dan_lembur");
      expect(id_skenario).toContain("skenario_intimidasi_atasan");
      expect(id_skenario).toContain("skenario_hak_dan_kontrak");
      expect(id_skenario).toContain("skenario_adaptasi_digital_dan_karier");

      for (const skenario of respons.body.daftar_skenario) {
        expect(skenario.daftar_opsi.length).toBeGreaterThanOrEqual(3);
        expect(skenario.pelajaran_multidisiplin.length).toBeGreaterThanOrEqual(15);
        for (const opsi of skenario.daftar_opsi) {
          expect(opsi.pertimbangan_utama).toBeDefined();
          expect(opsi.implikasi_potensial).toBeDefined();
          expect(opsi.pendekatan_alternatif).toBeDefined();
          expect(opsi.opsi_dukungan_relevan.length).toBeGreaterThanOrEqual(1);
        }
      }
    });
  });

  describe("POST /api/v1/tools/meaning-reflection", () => {
    it("menghasilkan refleksi kualitatif grounded pada Psikologi Kerja Pertemuan 1, 2, dan 5", async () => {
      const payload = {
        orientasi_saat_ini: "calling_orientation",
        dimensi_makna_utama: "positive_meaning_in_work",
        kebutuhan_sdt_prioritas: "autonomy_control",
        tantangan_kerja_digital: "information_overload_distraction",
      };

      const respons = await request(aplikasi)
        .post("/api/v1/tools/meaning-reflection")
        .send(payload);

      expect(respons.status).toBe(200);
      const validasi = skema_hasil_refleksi_makna_kerja.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.ringkasan_refleksi_non_klinis).toBeDefined();
      expect(respons.body.kaitan_konsep_psikologi_kerja.length).toBeGreaterThanOrEqual(2);
      expect(respons.body.langkah_pengembangan_konstruktif.length).toBeGreaterThanOrEqual(2);
      expect(respons.body.catatan_batas_non_asesmen).toContain(
        "bukan instrumen skrining psikologis",
      );
    });
  });

  describe("GET /api/v1/tools/support-directory", () => {
    it("mengembalikan seluruh daftar direktori kanal dukungan (minimal 6 sumber daya)", async () => {
      const respons = await request(aplikasi).get("/api/v1/tools/support-directory");

      expect(respons.status).toBe(200);
      const validasi = skema_respons_direktori_dukungan.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.daftar_layanan.length).toBeGreaterThanOrEqual(6);
      for (const sumber of respons.body.daftar_layanan) {
        expect(sumber.kode_sumber_daya).toBeDefined();
        expect(sumber.nama_layanan).toBeDefined();
        expect(sumber.deskripsi_peran).toBeDefined();
        expect(sumber.kapan_tepat_digunakan.length).toBeGreaterThanOrEqual(2);
        expect(sumber.batas_kewenangan.length).toBeGreaterThanOrEqual(1);
        expect(sumber.harapan_kerahasiaan).toBeDefined();
        expect(sumber.persiapan_sebelum_menghubungi.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("memfilter direktori berdasarkan kategori_layanan 'legal'", async () => {
      const respons = await request(aplikasi).get(
        "/api/v1/tools/support-directory?kategori_layanan=legal",
      );

      expect(respons.status).toBe(200);
      expect(respons.body.daftar_layanan.length).toBeGreaterThanOrEqual(1);
      for (const sumber of respons.body.daftar_layanan) {
        expect(sumber.kategori_layanan).toBe("legal");
      }
    });

    it("memfilter direktori berdasarkan id_tipe_dukungan 'psychological_support'", async () => {
      const respons = await request(aplikasi).get(
        "/api/v1/tools/support-directory?id_tipe_dukungan=psychological_support",
      );

      expect(respons.status).toBe(200);
      expect(respons.body.daftar_layanan.length).toBeGreaterThanOrEqual(1);
      for (const sumber of respons.body.daftar_layanan) {
        expect(sumber.id_tipe_dukungan).toBe("psychological_support");
      }
    });
  });
});
