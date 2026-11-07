import type { Express } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { buat_aplikasi } from "../../app.js";
import { buat_pembatas_laju_autentikasi } from "../../middlewares/rate-limit.middleware.js";
import { RepositoriAutentikasiMemori } from "./auth.repository.js";
import { LayananAutentikasi } from "./auth.service.js";

describe("Modul Autentikasi — VOXERA Phase 4", () => {
  let repositori_memori: RepositoriAutentikasiMemori;
  let layanan_autentikasi: LayananAutentikasi;
  let aplikasi: Express;
  const ORIGIN_TERPERCAYA = "http://localhost:3000";

  beforeEach(() => {
    repositori_memori = new RepositoriAutentikasiMemori();
    layanan_autentikasi = new LayananAutentikasi(repositori_memori);
    aplikasi = buat_aplikasi({
      layanan_autentikasi,
      konfigurasi: {
        PORT: 4000,
        NODE_ENV: "test",
        CORS_ORIGIN: ORIGIN_TERPERCAYA,
        DATABASE_URL: "postgresql://mock:mock@localhost:5432/voxera_test",
      },
    });
  });

  describe("POST /api/v1/auth/register", () => {
    it("berhasil mendaftarkan pengguna baru, menyetel cookie sesi HttpOnly, dan tidak membocorkan token di body", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/register")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "pekerja.aman@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
          nama_alias: "Pekerja Aman",
        });

      expect(respons.status).toBe(201);
      expect(respons.body.pengguna.email).toBe("pekerja.aman@voxera.id");
      expect(respons.body.pengguna.nama_alias).toBe("Pekerja Aman");
      expect(respons.body.kedaluwarsa_pada).toBeDefined();
      expect(respons.body.token_sesi).toBeUndefined();
      expect(respons.body.token).toBeUndefined();
      expect(respons.body.kata_sandi).toBeUndefined();

      // Verifikasi cookie sesi HttpOnly
      const cookie_header = respons.headers["set-cookie"];
      expect(cookie_header).toBeDefined();
      const string_cookie = Array.isArray(cookie_header) ? cookie_header[0] : String(cookie_header);
      expect(string_cookie).toContain("voxera_session=");
      expect(string_cookie).toContain("HttpOnly");
      expect(string_cookie).toContain("Path=/");
      expect(string_cookie).toContain("SameSite=Lax");
      expect(respons.headers["cache-control"]).toContain("no-store");
    });

    it("menolak pendaftaran dengan email duplikat dengan HTTP 409", async () => {
      await request(aplikasi).post("/api/v1/auth/register").set("Origin", ORIGIN_TERPERCAYA).send({
        email: "duplikat@voxera.id",
        kata_sandi: "KataSandiKuat2026!",
        nama_alias: "Pekerja Pertama",
      });

      const respons_duplikat = await request(aplikasi)
        .post("/api/v1/auth/register")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "duplikat@voxera.id",
          kata_sandi: "KataSandiKuat2026!Lain",
          nama_alias: "Pekerja Kedua",
        });

      expect(respons_duplikat.status).toBe(409);
      expect(respons_duplikat.body.kode).toBe("KONFLIK_DATA");
    });

    it("menolak registrasi jika kata sandi terlalu pendek atau format email salah (HTTP 400)", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/register")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "bukan-email",
          kata_sandi: "pendek",
          nama_alias: "X",
        });

      expect(respons.status).toBe(400);
      expect(respons.body.kode).toBe("VALIDASI_BODY_GAGAL");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(aplikasi).post("/api/v1/auth/register").set("Origin", ORIGIN_TERPERCAYA).send({
        email: "terdaftar@voxera.id",
        kata_sandi: "KataSandiKuat2026!",
        nama_alias: "Pengguna Terdaftar",
      });
    });

    it("berhasil login dengan kredensial benar dan menyetel cookie sesi", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "terdaftar@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
        });

      expect(respons.status).toBe(200);
      expect(respons.body.pengguna.email).toBe("terdaftar@voxera.id");
      expect(respons.body.kedaluwarsa_pada).toBeDefined();
      expect(respons.headers["set-cookie"]).toBeDefined();
    });

    it("mengembalikan generic HTTP 401 jika kata sandi salah (tanpa enumerasi akun)", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "terdaftar@voxera.id",
          kata_sandi: "KataSandiSalahTotal!",
        });

      expect(respons.status).toBe(401);
      expect(respons.body.kode).toBe("AUTENTIKASI_GAGAL");
      expect(respons.body.pesan).toBe("Email atau kata sandi tidak valid.");
    });

    it("mengembalikan generic HTTP 401 jika email tidak terdaftar (konstan waktu)", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "tidak-ada@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
        });

      expect(respons.status).toBe(401);
      expect(respons.body.kode).toBe("AUTENTIKASI_GAGAL");
      expect(respons.body.pesan).toBe("Email atau kata sandi tidak valid.");
    });
  });

  describe("GET /api/v1/auth/session & POST /api/v1/auth/logout", () => {
    it("mengembalikan sesi aktif untuk cookie yang valid, dan menolak setelah logout", async () => {
      const respons_reg = await request(aplikasi)
        .post("/api/v1/auth/register")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "sesi.test@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
          nama_alias: "Uji Sesi",
        });

      const cookie_raw = respons_reg.headers["set-cookie"];
      const cookie_string = Array.isArray(cookie_raw) ? cookie_raw[0] : String(cookie_raw);
      const cookie_sesi = cookie_string.split(";")[0];

      // Verifikasi sesi aktif
      const respons_sesi = await request(aplikasi)
        .get("/api/v1/auth/session")
        .set("Cookie", cookie_sesi);

      expect(respons_sesi.status).toBe(200);
      expect(respons_sesi.body.pengguna.email).toBe("sesi.test@voxera.id");

      // Logout
      const respons_logout = await request(aplikasi)
        .post("/api/v1/auth/logout")
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_sesi);

      expect(respons_logout.status).toBe(200);
      expect(respons_logout.body.berhasil).toBe(true);
      const logout_cookie = String(respons_logout.headers["set-cookie"]);
      expect(logout_cookie).toContain("Max-Age=0");

      // Sesi ditolak setelah logout
      const respons_setelah_logout = await request(aplikasi)
        .get("/api/v1/auth/session")
        .set("Cookie", cookie_sesi);

      expect(respons_setelah_logout.status).toBe(401);
    });

    it("menolak GET /session jika cookie tidak disertakan", async () => {
      const respons = await request(aplikasi).get("/api/v1/auth/session");
      expect(respons.status).toBe(401);
      expect(respons.body.kode).toBe("AUTENTIKASI_GAGAL");
    });
  });

  describe("DELETE /api/v1/auth/account", () => {
    it("menghapus akun beserta seluruh sesi dan membersihkan cookie", async () => {
      const respons_reg = await request(aplikasi)
        .post("/api/v1/auth/register")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "hapus.akun@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
          nama_alias: "Pengguna Hapus",
        });

      const cookie_raw = respons_reg.headers["set-cookie"];
      const cookie_string = Array.isArray(cookie_raw) ? cookie_raw[0] : String(cookie_raw);
      const cookie_sesi = cookie_string.split(";")[0];

      const respons_hapus = await request(aplikasi)
        .delete("/api/v1/auth/account")
        .set("Origin", ORIGIN_TERPERCAYA)
        .set("Cookie", cookie_sesi);

      expect(respons_hapus.status).toBe(200);
      expect(respons_hapus.body.berhasil).toBe(true);
      expect(String(respons_hapus.headers["set-cookie"])).toContain("Max-Age=0");

      // Tidak bisa login lagi
      const respons_login_lagi = await request(aplikasi)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({
          email: "hapus.akun@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
        });

      expect(respons_login_lagi.status).toBe(401);
    });
  });

  describe("CSRF Guard & Rate Limiting", () => {
    it("menolak permintaan mutasi POST jika Origin tidak cocok dengan allowlist CORS (HTTP 403)", async () => {
      const respons = await request(aplikasi)
        .post("/api/v1/auth/login")
        .set("Origin", "http://situs-jahat-penyerang.com")
        .send({
          email: "siapapun@voxera.id",
          kata_sandi: "KataSandiKuat2026!",
        });

      expect(respons.status).toBe(403);
      expect(respons.body.kode).toBe("AKSES_DITOLAK");
      expect(respons.body.pesan).toContain("Origin");
    });

    it("memicu HTTP 429 ketika pembatas laju mendeteksi permintaan beruntun melampaui batas", async () => {
      const pembatas_ketat = buat_pembatas_laju_autentikasi({
        jendela_ms: 60 * 1000,
        batas_maksimum: 2,
      });

      const app_rate_limited = buat_aplikasi({
        layanan_autentikasi,
        pembatas_laju_autentikasi: pembatas_ketat.middleware,
        konfigurasi: {
          PORT: 4000,
          NODE_ENV: "test",
          CORS_ORIGIN: ORIGIN_TERPERCAYA,
          DATABASE_URL: "postgresql://mock:mock@localhost:5432/voxera_test",
        },
      });

      // Panggilan 1
      await request(app_rate_limited)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({ email: "rate@voxera.id", kata_sandi: "PasswordSalah1!" });

      // Panggilan 2
      await request(app_rate_limited)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({ email: "rate@voxera.id", kata_sandi: "PasswordSalah2!" });

      // Panggilan 3 (melebihi batas 2)
      const respons_terblokir = await request(app_rate_limited)
        .post("/api/v1/auth/login")
        .set("Origin", ORIGIN_TERPERCAYA)
        .send({ email: "rate@voxera.id", kata_sandi: "PasswordSalah3!" });

      expect(respons_terblokir.status).toBe(429);
      expect(respons_terblokir.body.kode).toBe("BATAS_PERMINTAAN_TERLAMPAUI");
    });
  });
});
