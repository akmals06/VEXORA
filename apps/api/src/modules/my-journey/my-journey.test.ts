import { skema_perjalanan_tersimpan, skema_ringkasan_perjalanan_saya } from "@voxera/contracts";
import type { Express } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { buat_aplikasi } from "../../app.js";
import { RepositoriAutentikasiMemori } from "../auth/auth.repository.js";
import { LayananAutentikasi } from "../auth/auth.service.js";
import { RepositoriPerjalananSayaMemori } from "./my-journey.repository.js";
import { LayananPerjalananSaya } from "./my-journey.service.js";

describe("Modul My Journey (Option B Continuity) — VOXERA Phase 4", () => {
  let repositori_auth: RepositoriAutentikasiMemori;
  let repositori_journey: RepositoriPerjalananSayaMemori;
  let layanan_auth: LayananAutentikasi;
  let layanan_journey: LayananPerjalananSaya;
  let aplikasi: Express;
  const ORIGIN_TERPERCAYA = "http://localhost:3000";

  let cookie_pengguna_a: string;
  let cookie_pengguna_b: string;

  beforeEach(async () => {
    repositori_auth = new RepositoriAutentikasiMemori();
    repositori_journey = new RepositoriPerjalananSayaMemori();
    layanan_auth = new LayananAutentikasi(repositori_auth);
    layanan_journey = new LayananPerjalananSaya(repositori_journey);

    aplikasi = buat_aplikasi({
      layanan_autentikasi: layanan_auth,
      layanan_perjalanan: layanan_journey,
      pembatas_laju_autentikasi: (_req, _res, next) => next(),
      konfigurasi: {
        PORT: 4000,
        NODE_ENV: "test",
        CORS_ORIGIN: ORIGIN_TERPERCAYA,
        DATABASE_URL: "postgresql://mock:mock@localhost:5432/voxera_test",
      },
    });

    // Daftarkan Pengguna A
    const res_a = await request(aplikasi)
      .post("/api/v1/auth/register")
      .set("Origin", ORIGIN_TERPERCAYA)
      .send({
        email: "pengguna.a@voxera.id",
        kata_sandi: "KataSandiKuat2026!A",
        nama_alias: "Pekerja A",
      });
    const raw_a = res_a.headers["set-cookie"];
    cookie_pengguna_a = (Array.isArray(raw_a) ? raw_a[0] : String(raw_a)).split(";")[0];

    // Daftarkan Pengguna B
    const res_b = await request(aplikasi)
      .post("/api/v1/auth/register")
      .set("Origin", ORIGIN_TERPERCAYA)
      .send({
        email: "pengguna.b@voxera.id",
        kata_sandi: "KataSandiKuat2026!B",
        nama_alias: "Pekerja B",
      });
    const raw_b = res_b.headers["set-cookie"];
    cookie_pengguna_b = (Array.isArray(raw_b) ? raw_b[0] : String(raw_b)).split(";")[0];
  });

  describe("GET /api/v1/my-journey", () => {
    it("menolak akses tanpa sesi autentikasi dengan HTTP 401", async () => {
      const respons = await request(aplikasi).get("/api/v1/my-journey");
      expect(respons.status).toBe(401);
      expect(respons.body.kode).toBe("AUTENTIKASI_GAGAL");
    });

    it("mengembalikan ringkasan perjalanan kosong untuk pengguna baru yang terautentikasi", async () => {
      const respons = await request(aplikasi)
        .get("/api/v1/my-journey")
        .set("Cookie", cookie_pengguna_a);

      expect(respons.status).toBe(200);
      const validasi = skema_ringkasan_perjalanan_saya.safeParse(respons.body);
      expect(validasi.success).toBe(true);
      expect(respons.body.pengguna.email).toBe("pengguna.a@voxera.id");
      expect(respons.body.daftar_perjalanan).toEqual([]);
    });
  });

  describe("POST /api/v1/my-journey/journeys", () => {
    it("menolak jika tidak menyertakan header Origin CSRF (HTTP 403)", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/my-journey/journeys")
        .set("Cookie", cookie_pengguna_a)
        .send({
          id_masalah_utama: "workload_pressure",
          id_subkategori: "always_on_expectations",
          kelas_hasil_utama: "prepare",
          jalur_dukungan_utama: "manager_discussion",
          daftar_langkah: [
            {
              urutan_langkah: 1,
              kode_langkah: "audit_workload",
              id_tipe_dukungan: "self_guided_resource",
              status_langkah: "belum_dimulai",
            },
          ],
        });

      expect(respons.status).toBe(403);
      expect(respons.body.kode).toBe("AKSES_DITOLAK");
    });

    it("berhasil menyimpan progres perjalanan terstruktur non-sensitif (HTTP 201)", async () => {
      const payload = {
        id_masalah_utama: "workload_pressure",
        id_subkategori: "always_on_expectations",
        kelas_hasil_utama: "prepare",
        jalur_dukungan_utama: "manager_discussion",
        daftar_langkah: [
          {
            urutan_langkah: 1,
            kode_langkah: "audit_workload",
            id_tipe_dukungan: "self_guided_resource",
            status_langkah: "belum_dimulai",
          },
          {
            urutan_langkah: 2,
            kode_langkah: "prepare_discussion",
            id_tipe_dukungan: "manager_discussion",
            status_langkah: "belum_dimulai",
          },
        ],
      };

      const respons = await request(aplikasi)
        .post("/api/v1/my-journey/journeys")
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a)
        .send(payload);

      expect(respons.status).toBe(201);
      const validasi = skema_perjalanan_tersimpan.safeParse(respons.body);
      expect(validasi.success).toBe(true);

      expect(respons.body.id_masalah_utama).toBe("workload_pressure");
      expect(respons.body.status_perjalanan).toBe("aktif");
      expect(respons.body.daftar_langkah).toHaveLength(2);
    });
  });

  describe("PATCH status perjalanan & langkah tindak lanjut", () => {
    let id_perjalanan_dibuat: string;
    let id_langkah_dibuat: string;

    beforeEach(async () => {
      const res = await request(aplikasi)
        .post("/api/v1/my-journey/journeys")
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a)
        .send({
          id_masalah_utama: "role_clarity",
          id_subkategori: "default",
          kelas_hasil_utama: "prepare",
          jalur_dukungan_utama: "manager_discussion",
          daftar_langkah: [
            {
              urutan_langkah: 1,
              kode_langkah: "draft_role_matrix",
              id_tipe_dukungan: "manager_discussion",
              status_langkah: "belum_dimulai",
            },
          ],
        });
      id_perjalanan_dibuat = res.body.id_perjalanan;
      id_langkah_dibuat = res.body.daftar_langkah[0].id_langkah;
    });

    it("memperbarui status perjalanan menjadi 'ditindaklanjuti' oleh pemilik sah", async () => {
      const respons = await request(aplikasi)
        .patch(`/api/v1/my-journey/journeys/${id_perjalanan_dibuat}/status`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a)
        .send({ status_perjalanan: "ditindaklanjuti" });

      expect(respons.status).toBe(200);
      expect(respons.body.status_perjalanan).toBe("ditindaklanjuti");
    });

    it("memperbarui status langkah tindak lanjut menjadi 'selesai' oleh pemilik sah", async () => {
      const respons = await request(aplikasi)
        .patch(`/api/v1/my-journey/journeys/${id_perjalanan_dibuat}/steps/${id_langkah_dibuat}`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a)
        .send({ status_langkah: "selesai" });

      expect(respons.status).toBe(200);
      expect(respons.body.id_langkah).toBe(id_langkah_dibuat);
      expect(respons.body.status_langkah).toBe("selesai");
    });
  });

  describe("IDOR Isolation & DELETE /journeys/:id_perjalanan", () => {
    let id_perjalanan_milik_a: string;
    let id_langkah_milik_a: string;

    beforeEach(async () => {
      const res = await request(aplikasi)
        .post("/api/v1/my-journey/journeys")
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a)
        .send({
          id_masalah_utama: "employment_rights",
          id_subkategori: "termination_contract",
          kelas_hasil_utama: "employee_protection",
          jalur_dukungan_utama: "legal_support",
          daftar_langkah: [
            {
              urutan_langkah: 1,
              kode_langkah: "review_law",
              id_tipe_dukungan: "legal_information",
              status_langkah: "belum_dimulai",
            },
          ],
        });
      id_perjalanan_milik_a = res.body.id_perjalanan;
      id_langkah_milik_a = res.body.daftar_langkah[0].id_langkah;
    });

    it("Pengguna B TIDAK BISA melihat perjalanan Pengguna A (isolasi IDOR)", async () => {
      const respons_b = await request(aplikasi)
        .get("/api/v1/my-journey")
        .set("Cookie", cookie_pengguna_b);

      expect(respons_b.status).toBe(200);
      expect(respons_b.body.daftar_perjalanan).toHaveLength(0);
    });

    it("Pengguna B TIDAK BISA mengubah status perjalanan Pengguna A (HTTP 404 SUMBER_DAYA_TIDAK_DITEMUKAN)", async () => {
      const respons_idor = await request(aplikasi)
        .patch(`/api/v1/my-journey/journeys/${id_perjalanan_milik_a}/status`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_b)
        .send({ status_perjalanan: "diarsipkan" });

      expect(respons_idor.status).toBe(404);
      expect(respons_idor.body.kode).toBe("SUMBER_DAYA_TIDAK_DITEMUKAN");
    });

    it("Pengguna B TIDAK BISA mengubah langkah perjalanan Pengguna A (HTTP 404 SUMBER_DAYA_TIDAK_DITEMUKAN)", async () => {
      const respons_idor = await request(aplikasi)
        .patch(`/api/v1/my-journey/journeys/${id_perjalanan_milik_a}/steps/${id_langkah_milik_a}`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_b)
        .send({ status_langkah: "selesai" });

      expect(respons_idor.status).toBe(404);
      expect(respons_idor.body.kode).toBe("SUMBER_DAYA_TIDAK_DITEMUKAN");
    });

    it("Pengguna B TIDAK BISA menghapus perjalanan Pengguna A (HTTP 404 SUMBER_DAYA_TIDAK_DITEMUKAN)", async () => {
      const respons_idor = await request(aplikasi)
        .delete(`/api/v1/my-journey/journeys/${id_perjalanan_milik_a}`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_b);

      expect(respons_idor.status).toBe(404);
      expect(respons_idor.body.kode).toBe("SUMBER_DAYA_TIDAK_DITEMUKAN");
    });

    it("Pengguna A (pemilik sah) berhasil menghapus perjalanannya sendiri", async () => {
      const respons_hapus = await request(aplikasi)
        .delete(`/api/v1/my-journey/journeys/${id_perjalanan_milik_a}`)
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_pengguna_a);

      expect(respons_hapus.status).toBe(200);
      expect(respons_hapus.body.berhasil).toBe(true);

      // Verifikasi perjalanan sudah hilang dari daftar Pengguna A
      const respons_cek = await request(aplikasi)
        .get("/api/v1/my-journey")
        .set("Cookie", cookie_pengguna_a);

      expect(respons_cek.body.daftar_perjalanan).toHaveLength(0);
    });
  });
});
