import { describe, expect, it } from "vitest";
import { skema_kuery_kesehatan, skema_respons_kesehatan } from "./health.schema.js";

describe("skema_respons_kesehatan", () => {
  it("menerima payload respons kesehatan yang valid", () => {
    const data_valid = {
      status: "ok",
      layanan: "voxera-api",
      fase: "phase-0",
      lingkungan: "test",
      waktu_server: new Date().toISOString(),
    };

    const hasil = skema_respons_kesehatan.safeParse(data_valid);
    expect(hasil.success).toBe(true);
  });

  it("menolak payload dengan status yang tidak sesuai kontrak", () => {
    const data_tidak_valid = {
      status: "gagal",
      layanan: "voxera-api",
      fase: "phase-0",
      lingkungan: "test",
      waktu_server: "bukan-iso-date",
    };

    const hasil = skema_respons_kesehatan.safeParse(data_tidak_valid);
    expect(hasil.success).toBe(false);
  });

  it("memberikan nilai default 'ringkas' pada kuery kesehatan", () => {
    const hasil = skema_kuery_kesehatan.parse({});
    expect(hasil.detail).toBe("ringkas");
  });
});
