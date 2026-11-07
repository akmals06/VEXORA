import { describe, expect, it } from "vitest";
import { validasi_url_database } from "./client.js";

describe("validasi_url_database", () => {
  it("menerima URL PostgreSQL yang valid", () => {
    const url = "postgresql://voxera_user:rahasia123@localhost:5432/voxera_dev?schema=public";
    expect(validasi_url_database(url)).toBe(url);
  });

  it("menolak URL kosong atau undefined", () => {
    expect(() => validasi_url_database(undefined)).toThrow();
    expect(() => validasi_url_database("")).toThrow();
  });

  it("menolak URL yang masih menggunakan placeholder contoh", () => {
    const url_placeholder =
      "postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/voxera_dev?schema=public";
    expect(() => validasi_url_database(url_placeholder)).toThrow();
  });

  it("menolak protokol selain PostgreSQL", () => {
    expect(() => validasi_url_database("mysql://root:pass@localhost:3306/db")).toThrow();
  });
});
