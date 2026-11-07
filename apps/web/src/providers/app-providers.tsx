"use client";

import type { ProfilPengguna } from "@voxera/contracts";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { klien_api_voxera } from "@/lib/api-client";
import {
  apakah_ada_data_sesi_lokal,
  baca_sesi_lokal,
  buat_state_sesi_lokal_kosong,
  hapus_sesi_lokal,
  NAMA_EVENT_SESI_LOKAL,
  simpan_sesi_lokal,
  type StateSesiLokal,
} from "@/lib/session-storage";

export type StatusAutentikasiKlien = "memuat" | "terautentikasi" | "tamu";
export type ModeTemaTampilan = "terang" | "gelap";

interface NilaiKonteksAplikasi {
  sesi_lokal: StateSesiLokal;
  sudah_dihidrasi: boolean;
  ada_data_lokal: boolean;
  perbarui_sesi_lokal: (
    pembaruan:
      | Partial<Omit<StateSesiLokal, "versi" | "diperbarui_pada">>
      | ((sebelumnya: StateSesiLokal) => StateSesiLokal),
  ) => StateSesiLokal;
  bersihkan_sesi_lokal: () => void;
  pengguna: ProfilPengguna | null;
  status_autentikasi: StatusAutentikasiKlien;
  tetapkan_pengguna_terautentikasi: (pengguna_baru: ProfilPengguna | null) => void;
  segar_ulang_sesi_auth: () => Promise<ProfilPengguna | null>;
  mode_tema: ModeTemaTampilan;
  ubah_mode_tema: () => void;
}

const KonteksAplikasi = createContext<NilaiKonteksAplikasi | null>(null);

interface PropertiPenyediaAplikasi {
  children: ReactNode;
}

export function AppProviders({ children }: PropertiPenyediaAplikasi) {
  const [sesi_lokal, atur_sesi_lokal] = useState<StateSesiLokal>(() =>
    buat_state_sesi_lokal_kosong(),
  );
  const [sudah_dihidrasi, atur_sudah_dihidrasi] = useState<boolean>(false);
  const [pengguna, atur_pengguna] = useState<ProfilPengguna | null>(null);
  const [status_autentikasi, atur_status_autentikasi] = useState<StatusAutentikasiKlien>("memuat");
  const [mode_tema, atur_mode_tema] = useState<ModeTemaTampilan>("terang");

  const sinkronkan_dari_storage = useCallback(() => {
    atur_sesi_lokal(baca_sesi_lokal());
  }, []);

  const segar_ulang_sesi_auth = useCallback(async (): Promise<ProfilPengguna | null> => {
    try {
      const respons = await klien_api_voxera.autentikasi.cek_sesi();
      atur_pengguna(respons.pengguna);
      atur_status_autentikasi("terautentikasi");
      return respons.pengguna;
    } catch {
      atur_pengguna(null);
      atur_status_autentikasi("tamu");
      return null;
    }
  }, []);

  useEffect(() => {
    sinkronkan_dari_storage();
    atur_sudah_dihidrasi(true);

    const penangan_perubahan = () => {
      sinkronkan_dari_storage();
    };

    window.addEventListener(NAMA_EVENT_SESI_LOKAL, penangan_perubahan);
    window.addEventListener("storage", penangan_perubahan);

    void segar_ulang_sesi_auth();

    return () => {
      window.removeEventListener(NAMA_EVENT_SESI_LOKAL, penangan_perubahan);
      window.removeEventListener("storage", penangan_perubahan);
    };
  }, [segar_ulang_sesi_auth, sinkronkan_dari_storage]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const elemen_html = document.documentElement;
      if (mode_tema === "gelap") {
        elemen_html.classList.add("dark");
      } else {
        elemen_html.classList.remove("dark");
      }
    }
  }, [mode_tema]);

  const perbarui_sesi_lokal = useCallback(
    (
      pembaruan:
        | Partial<Omit<StateSesiLokal, "versi" | "diperbarui_pada">>
        | ((sebelumnya: StateSesiLokal) => StateSesiLokal),
    ): StateSesiLokal => {
      const hasil = simpan_sesi_lokal(pembaruan);
      atur_sesi_lokal(hasil);
      return hasil;
    },
    [],
  );

  const bersihkan_sesi_lokal = useCallback(() => {
    const kosong = hapus_sesi_lokal();
    atur_sesi_lokal(kosong);
  }, []);

  const tetapkan_pengguna_terautentikasi = useCallback((pengguna_baru: ProfilPengguna | null) => {
    atur_pengguna(pengguna_baru);
    atur_status_autentikasi(pengguna_baru ? "terautentikasi" : "tamu");
  }, []);

  const ubah_mode_tema = useCallback(() => {
    atur_mode_tema((sebelumnya) => (sebelumnya === "terang" ? "gelap" : "terang"));
  }, []);

  const ada_data_lokal = useMemo(() => apakah_ada_data_sesi_lokal(sesi_lokal), [sesi_lokal]);

  const nilai = useMemo<NilaiKonteksAplikasi>(
    () => ({
      sesi_lokal,
      sudah_dihidrasi,
      ada_data_lokal,
      perbarui_sesi_lokal,
      bersihkan_sesi_lokal,
      pengguna,
      status_autentikasi,
      tetapkan_pengguna_terautentikasi,
      segar_ulang_sesi_auth,
      mode_tema,
      ubah_mode_tema,
    }),
    [
      ada_data_lokal,
      bersihkan_sesi_lokal,
      mode_tema,
      pengguna,
      perbarui_sesi_lokal,
      segar_ulang_sesi_auth,
      sesi_lokal,
      status_autentikasi,
      sudah_dihidrasi,
      tetapkan_pengguna_terautentikasi,
      ubah_mode_tema,
    ],
  );

  return <KonteksAplikasi.Provider value={nilai}>{children}</KonteksAplikasi.Provider>;
}

export function gunakan_konteks_aplikasi(): NilaiKonteksAplikasi {
  const konteks = useContext(KonteksAplikasi);
  if (!konteks) {
    throw new Error("gunakan_konteks_aplikasi harus dipanggil di dalam AppProviders.");
  }
  return konteks;
}
