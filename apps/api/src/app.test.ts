import { skema_respons_kesehatan } from "@voxera/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { buat_aplikasi } from "./app.js";

describe("VEXORA API — Phase 0 Foundation", () => {
  const aplikasi = buat_aplikasi();

  it("GET /api/v1/health mengembalikan HTTP 200 dan memenuhi kontrak skema", async () => {
    const respons = await request(aplikasi).get("/api/v1/health");

    expect(respons.status).toBe(200);
    expect(respons.headers["x-content-type-options"]).toBe("nosniff");

    const hasil_validasi = skema_respons_kesehatan.safeParse(respons.body);
    expect(hasil_validasi.success).toBe(true);
    expect(respons.body.status).toBe("ok");
    expect(respons.body.layanan).toBe("voxera-api");
    expect(respons.body.fase).toBe("phase-0");
  });

  it("GET /api/v1/health menolak query detail yang tidak valid dengan HTTP 400", async () => {
    const respons = await request(aplikasi).get("/api/v1/health?detail=tidak_valid");

    expect(respons.status).toBe(400);
    expect(respons.body).toEqual({
      status: "error",
      kode: "VALIDASI_KUERY_GAGAL",
      pesan: "Parameter query tidak valid.",
    });
  });

  it("mengembalikan HTTP 404 terstruktur untuk rute yang tidak terdaftar", async () => {
    const respons = await request(aplikasi).get("/api/v1/rute-tidak-ada");

    expect(respons.status).toBe(404);
    expect(respons.body.status).toBe("error");
    expect(respons.body.kode).toBe("RUTE_TIDAK_DITEMUKAN");
  });
});
