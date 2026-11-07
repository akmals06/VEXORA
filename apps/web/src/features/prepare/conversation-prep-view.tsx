"use client";

import type {
  DrafPercakapan,
  InputPersiapanPercakapan,
  RecipientType,
  SpecificIssueId,
} from "@voxera/contracts";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { SaveBoundaryCard } from "@/components/ui/save-boundary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GalatApiKlien, klien_api_voxera } from "@/lib/api-client";
import {
  DAFTAR_KARTU_MASALAH_BERANDA,
  DAFTAR_PENERIMA_PERCAKAPAN,
  PETA_LABEL_PENERIMA,
} from "@/lib/taxonomy-labels";
import { gunakan_konteks_aplikasi } from "@/providers/app-providers";

const DAFTAR_MASALAH_SPESIFIK = DAFTAR_KARTU_MASALAH_BERANDA.filter(
  (item): item is typeof item & { id: SpecificIssueId } => item.id !== "unsure",
);

export function ConversationPrepView() {
  const { sesi_lokal, perbarui_sesi_lokal } = gunakan_konteks_aplikasi();

  const draf_tersimpan = sesi_lokal.draf_persiapan_percakapan;
  const issue_bawaan: SpecificIssueId =
    sesi_lokal.perjalanan_dukungan_aktif?.id_masalah_utama ??
    draf_tersimpan.id_masalah_terkait ??
    "workload_pressure";

  const [target_penerima, atur_target_penerima] = useState<RecipientType>(
    draf_tersimpan.target_penerima,
  );
  const [id_masalah_terkait, atur_id_masalah_terkait] = useState<SpecificIssueId>(issue_bawaan);

  const [apa_yang_terjadi_dan_waktu, atur_apa_yang_terjadi_dan_waktu] = useState<string>(
    draf_tersimpan.apa_yang_terjadi_dan_waktu ||
      "Dalam beberapa minggu terakhir, terdapat penambahan tanggung jawab proyek secara paralel dengan tenggat waktu yang saling berhimpitan.",
  );
  const [dampak_pada_pekerjaan_atau_kondisi, atur_dampak_pada_pekerjaan_atau_kondisi] =
    useState<string>(
      draf_tersimpan.dampak_pada_pekerjaan_atau_kondisi ||
        "Kualitas ketelitian dokumen berisiko menurun dan waktu istirahat di luar jam kerja mulai terpakai untuk menyelesaikan revisi mendadak.",
    );
  const [konteks_peran_tanpa_nama_wajib, atur_konteks_peran_tanpa_nama_wajib] = useState<string>(
    draf_tersimpan.konteks_peran_tanpa_nama_wajib ||
      "Anggota tim pelaksana operasional dengan koordinasi lintas divisi.",
  );
  const [dukungan_yang_dibutuhkan, atur_dukungan_yang_dibutuhkan] = useState<string>(
    draf_tersimpan.dukungan_yang_dibutuhkan ||
      "Penyelarasan ulang urutan prioritas 3 tugas utama minggu ini serta kejelasan batas jam respons di luar jam kerja.",
  );
  const [hasil_yang_diharapkan, atur_hasil_yang_diharapkan] = useState<string>(
    draf_tersimpan.hasil_yang_diharapkan ||
      "Kesepakatan tertulis mengenai target prioritas realistis dan jadwal tinjauan kapasitas mingguan.",
  );

  const [draf_aktif, atur_draf_aktif] = useState<DrafPercakapan | null>(draf_tersimpan.hasil_draf);
  const [sedang_menyusun, atur_sedang_menyusun] = useState<boolean>(false);
  const [pesan_galat, atur_pesan_galat] = useState<string | null>(null);
  const [status_salin, atur_status_salin] = useState<string | null>(null);

  const tangani_susun_draf = async (event: React.FormEvent) => {
    event.preventDefault();
    atur_sedang_menyusun(true);
    atur_pesan_galat(null);

    const muatan: InputPersiapanPercakapan = {
      target_penerima,
      id_masalah_terkait,
      apa_yang_terjadi_dan_waktu,
      dampak_pada_pekerjaan_atau_kondisi,
      konteks_peran_tanpa_nama_wajib,
      dukungan_yang_dibutuhkan,
      hasil_yang_diharapkan,
    };

    try {
      const hasil = await klien_api_voxera.alat_bantu.susun_draf_percakapan(muatan);
      atur_draf_aktif(hasil);
      perbarui_sesi_lokal({
        draf_persiapan_percakapan: {
          ...muatan,
          hasil_draf: hasil,
        },
      });
    } catch (galat) {
      if (galat instanceof GalatApiKlien) {
        atur_pesan_galat(galat.pesan);
      } else {
        atur_pesan_galat(
          "Gagal menyusun draf percakapan. Pastikan setiap kolom terisi sesuai batas minimum karakter.",
        );
      }
    } finally {
      atur_sedang_menyusun(false);
    }
  };

  const tangani_salin_teks = async () => {
    if (!draf_aktif) {
      return;
    }
    try {
      await navigator.clipboard.writeText(draf_aktif.naskah_siap_salin);
      atur_status_salin("Teks draf berhasil disalin ke papan klip (clipboard).");
      window.setTimeout(() => atur_status_salin(null), 3000);
    } catch {
      atur_status_salin("Gagal menyalin otomatis. Silakan blok dan salin teks secara manual.");
    }
  };

  const tangani_cetak_lokal = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const tangani_hapus_draf_lokal = () => {
    atur_draf_aktif(null);
    perbarui_sesi_lokal({
      draf_persiapan_percakapan: {
        target_penerima: "manager",
        id_masalah_terkait: "workload_pressure",
        apa_yang_terjadi_dan_waktu: "",
        dampak_pada_pekerjaan_atau_kondisi: "",
        konteks_peran_tanpa_nama_wajib: "",
        dukungan_yang_dibutuhkan: "",
        hasil_yang_diharapkan: "",
        hasil_draf: null,
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Card */}
      <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="Alat Bantu Persiapan Bicara" nada="utama" />
          <StatusBadge label="Khusus Sesi Peramban (Tidak Disimpan ke Database)" nada="aman" />
        </div>
        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--vx-text-primary)] sm:text-2xl">
          Persiapan Percakapan & Konsultasi Terstruktur
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-[var(--vx-text-secondary)] sm:text-sm">
          Susun poin komunikasi yang tenang, objektif, dan terfokus sebelum berbicara dengan
          Manajer, HR, Psikolog, Konselor, Pendamping Hukum, atau Mentor Karier. Jawaban teks Anda
          pada halaman ini <strong>tidak pernah disimpan ke database server</strong>.
        </p>
      </section>

      {/* 3-Column Desktop Workspace (Left 3 Cols Recipient | Center 5 Cols Guided Form | Right 4 Cols Preview) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Column 1 (3 Cols): Recipient & Issue Selector */}
        <aside className="space-y-4 lg:col-span-3">
          <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)]">
            <h2 className="text-xs font-bold tracking-wider text-[var(--vx-primary)] uppercase">
              1. Pilih Pihak Tujuan Diskusi / Konsultasi (6 Penerima)
            </h2>
            <div className="mt-3 space-y-2">
              {DAFTAR_PENERIMA_PERCAKAPAN.map((penerima) => {
                const terpilih = target_penerima === penerima.id;
                return (
                  <button
                    key={penerima.id}
                    type="button"
                    onClick={() => atur_target_penerima(penerima.id)}
                    aria-pressed={terpilih}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      terpilih
                        ? "border-[#0A2552] bg-[var(--vx-surface-secondary)] ring-2 ring-[#305FA7]/20"
                        : "border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)]/70 hover:border-[#305FA7]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold text-[var(--vx-text-primary)]">
                        {penerima.label}
                      </span>
                      {terpilih ? <StatusBadge label="Aktif" nada="utama" /> : null}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--vx-text-secondary)]">
                      {penerima.peran_singkat}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-[var(--vx-primary)]">
                      Kapan dipilih: {penerima.kapan_dipilih}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-4 shadow-[var(--vx-shadow-card)]">
            <label
              htmlFor="select-issue-percakapan"
              className="block text-xs font-bold tracking-wider text-[var(--vx-primary)] uppercase"
            >
              2. Konteks Kategori Situasi Kerja
            </label>
            <select
              id="select-issue-percakapan"
              value={id_masalah_terkait}
              onChange={(event) => atur_id_masalah_terkait(event.target.value as SpecificIssueId)}
              className="mt-2.5 min-h-11 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs font-semibold text-[var(--vx-text-primary)]"
            >
              {DAFTAR_MASALAH_SPESIFIK.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.judul}
                </option>
              ))}
            </select>
          </section>
        </aside>

        {/* Column 2 (5 Cols): 5 Guided Prompts Form */}
        <form
          onSubmit={(event) => void tangani_susun_draf(event)}
          className="space-y-4 rounded-[20px] border border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)] lg:col-span-5"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-[var(--vx-text-primary)]">
                3. Susun Poin Terstruktur (5 Panduan Prompt)
              </h2>
              <p className="mt-0.5 text-xs text-[var(--vx-text-secondary)]">
                Target: <strong>{PETA_LABEL_PENERIMA[target_penerima]}</strong>
              </p>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
              <Icon name="chat" size={16} />
            </span>
          </div>

          {pesan_galat ? (
            <div
              role="alert"
              className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] p-3 text-xs font-semibold text-[#991B1B]"
            >
              {pesan_galat}
            </div>
          ) : null}

          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="input-apa-yang-terjadi"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Prompt 1: Apa fakta objektif yang terjadi dan sejak kapan?
              </label>
              <textarea
                id="input-apa-yang-terjadi"
                rows={2}
                required
                minLength={10}
                maxLength={1500}
                value={apa_yang_terjadi_dan_waktu}
                onChange={(event) => atur_apa_yang_terjadi_dan_waktu(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="input-dampak"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Prompt 2: Apa dampaknya pada pekerjaan, kejelasan peran, atau kondisi Anda?
              </label>
              <textarea
                id="input-dampak"
                rows={2}
                required
                minLength={5}
                maxLength={800}
                value={dampak_pada_pekerjaan_atau_kondisi}
                onChange={(event) => atur_dampak_pada_pekerjaan_atau_kondisi(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="input-konteks-peran"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Prompt 3: Konteks peran kerja (tanpa harus menyebut nama asli)
              </label>
              <textarea
                id="input-konteks-peran"
                rows={2}
                maxLength={500}
                value={konteks_peran_tanpa_nama_wajib}
                onChange={(event) => atur_konteks_peran_tanpa_nama_wajib(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="input-dukungan"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Prompt 4: Dukungan atau penyesuaian spesifik apa yang Anda butuhkan?
              </label>
              <textarea
                id="input-dukungan"
                rows={2}
                required
                minLength={5}
                maxLength={600}
                value={dukungan_yang_dibutuhkan}
                onChange={(event) => atur_dukungan_yang_dibutuhkan(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="input-hasil"
                className="block text-xs font-bold text-[var(--vx-text-primary)]"
              >
                Prompt 5: Hasil bersama atau langkah konkret apa yang Anda harapkan?
              </label>
              <textarea
                id="input-hasil"
                rows={2}
                required
                minLength={5}
                maxLength={600}
                value={hasil_yang_diharapkan}
                onChange={(event) => atur_hasil_yang_diharapkan(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] px-3 py-2 text-xs text-[var(--vx-text-primary)]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={sedang_menyusun}
              className="min-h-11 w-full rounded-full bg-[#0C264F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#13356B] disabled:opacity-60"
            >
              {sedang_menyusun
                ? "Menyusun Ringkasan Percakapan..."
                : "Susun & Format Draf Percakapan →"}
            </button>
          </div>
        </form>

        {/* Column 3 (4 Cols): Structured Preview & Export Actions */}
        <div className="space-y-4 lg:col-span-4">
          {draf_aktif ? (
            <section
              aria-labelledby="judul-hasil-draf"
              className="space-y-4 rounded-[20px] border border-[#B6CBE8] bg-[var(--vx-surface-primary)] p-5 shadow-[var(--vx-shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--vx-border-subtle)] pb-3">
                <div>
                  <StatusBadge label="Draf Siap Digunakan" nada="aman" />
                  <h2
                    id="judul-hasil-draf"
                    className="mt-1.5 text-base font-extrabold text-[var(--vx-text-primary)]"
                  >
                    {draf_aktif.judul_draf}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void tangani_salin_teks()}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#0C264F] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#13356B]"
                >
                  <Icon name="copy" size={13} />
                  <span>Salin Teks Ringkasan</span>
                </button>
                <button
                  type="button"
                  onClick={tangani_cetak_lokal}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--vx-border-soft)] bg-[var(--vx-surface-secondary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--vx-text-primary)] transition hover:bg-[var(--vx-surface-secondary-alt)]"
                >
                  <Icon name="printer" size={13} />
                  <span>Cetak / Simpan PDF Lokal</span>
                </button>
                <button
                  type="button"
                  onClick={tangani_hapus_draf_lokal}
                  className="inline-flex min-h-10 items-center rounded-full border border-[#FECACA] bg-[#FEE2E2]/80 px-3 py-1.5 text-xs font-semibold text-[#991B1B]"
                >
                  Bersihkan Draf Ini
                </button>
              </div>

              {status_salin ? (
                <p
                  role="status"
                  className="rounded-xl bg-[#E7F6EF] px-3 py-2 text-xs font-semibold text-[#166534]"
                >
                  {status_salin}
                </p>
              ) : null}

              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                  <h3 className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                    1. Kalimat Pembuka yang Tenang & Konstruktif
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--vx-text-primary)]">
                    “{draf_aktif.pembuka_percakapan}”
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                  <h3 className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                    2. Ringkasan Situasi & Pernyataan Dampak
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--vx-text-primary)]">
                    {draf_aktif.ringkasan_situasi_dan_waktu}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                    <strong>Dampak:</strong> {draf_aktif.pernyataan_dampak}
                  </p>
                </div>

                <div className="rounded-xl border border-[#B6CBE8] bg-[var(--vx-surface-secondary)] p-3.5">
                  <h3 className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                    3. Rincian Dukungan & Kalimat Penutup
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[var(--vx-text-primary)]">
                    {draf_aktif.rincian_dukungan_dan_hasil}
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--vx-text-secondary)]">
                    “{draf_aktif.kalimat_penutup_konstruktif}”
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                  <h3 className="text-[11px] font-bold tracking-wider text-[var(--vx-primary)] uppercase">
                    4. Panduan Khusus vs Hal yang Perlu Dihindari
                  </h3>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <div className="rounded-lg bg-[#E7F6EF]/70 p-2.5 text-xs">
                      <p className="font-bold text-[#166534]">Panduan Khusus Penerima:</p>
                      <ul className="mt-1 space-y-1 text-[var(--vx-text-primary)]">
                        {draf_aktif.panduan_khusus_penerima.map((item) => (
                          <li key={item}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-[#FEF3C7]/70 p-2.5 text-xs">
                      <p className="font-bold text-[#92400E]">Sebaiknya Dihindari:</p>
                      <ul className="mt-1 space-y-1 text-[var(--vx-text-primary)]">
                        {draf_aktif.hal_yang_perlu_dihindari.map((item) => (
                          <li key={item}>✕ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--vx-border-soft)] bg-[var(--vx-bg-workspace)] p-3.5">
                  <p className="text-[11px] italic text-[var(--vx-text-secondary)]">
                    {draf_aktif.peringatan_privasi_penerima}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[var(--vx-border-soft)] bg-[var(--vx-surface-primary)] p-6 text-center shadow-[var(--vx-shadow-card)]">
              <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--vx-surface-secondary)] text-[var(--vx-primary)]">
                <Icon name="chat" size={18} />
              </span>
              <h2 className="mt-3 text-sm font-bold text-[var(--vx-text-primary)]">
                Pratinjau Draf Percakapan
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--vx-text-secondary)]">
                Isi 5 panduan prompt di kolom tengah dan klik{" "}
                <strong>Susun & Format Draf Percakapan</strong> untuk melihat kalimat pembuka, poin
                bicara, serta panduan khusus penerima.
              </p>
            </div>
          )}
        </div>
      </div>

      <SaveBoundaryCard ringkas />
    </div>
  );
}
