# VEXORA

**Platform Perlindungan Pekerja dan Kesejahteraan Psikososial di Tempat Kerja**

VEXORA adalah platform web interdisipliner yang dikembangkan sebagai Proyek Akhir kolaboratif lintas bidang ilmu (**Psikologi Kerja, Ilmu Komputer/Informatika, Hukum Ketenagakerjaan, serta Ekonomi & Bisnis**). Platform ini membantu pekerja memahami situasi kerja yang mereka hadapi, mengenali hak normatif ketenagakerjaan, menavigasi jalur dukungan yang aman, serta mempersiapkan komunikasi profesional tanpa harus langsung membuat akun.

---

## Struktur Monorepo

VEXORA dibangun menggunakan arsitektur **modular monorepo** berbasis **pnpm Workspaces** dan **Turborepo**:

```text
.
├── apps/
│   ├── web/                # Frontend Next.js 16 App Router (@voxera/web)
│   └── api/                # Backend REST API Express 5 + TypeScript (@voxera/api)
├── packages/
│   ├── database/           # Skema Prisma ORM 7 + adaptor PostgreSQL (@voxera/database)
│   ├── contracts/          # Skema validasi Zod & tipe DTO lintas batas (@voxera/contracts)
│   └── config/             # Konfigurasi bersama TypeScript & ESLint (@voxera/config)
├── package.json            # Skrip orkestrasi utama monorepo
├── pnpm-workspace.yaml     # Definisi ruang kerja pnpm
└── turbo.json              # Pipeline tugas Turborepo
```

---

## Tumpukan Teknologi (Technology Stack)

| Lapisan          | Teknologi                  | Versi                         | Keterangan                                                 |
| :--------------- | :------------------------- | :---------------------------- | :--------------------------------------------------------- |
| Runtime          | Node.js                    | `>=22.0.0`                    | Dukungan runtime LTS aktif                                 |
| Package Manager  | pnpm                       | `11.9.0`                      | Resolusi dependensi workspace dengan satu lockfile         |
| Orkestrasi Build | Turborepo                  | `2.11.10`                     | Eksekusi tugas paralel sadar-dependensi                    |
| Bahasa           | TypeScript                 | `5.9.3`                       | Strict mode aktif di seluruh paket                         |
| Frontend         | Next.js + React            | `16.4.5` / `19.3.1`           | App Router dengan Server & Client Components               |
| Styling          | Tailwind CSS               | `4.3.4`                       | Konfigurasi CSS-first via `@tailwindcss/postcss`           |
| Backend          | Express.js                 | `5.3.0`                       | Modular monolith REST API di bawah `/api/v1`               |
| Keamanan HTTP    | Helmet + CORS              | `8.3.0` / `2.8.6`             | Header keamanan HTTP dan pembatasan origin ketat           |
| Database & ORM   | PostgreSQL + Prisma        | `17.x` / `7.10.1`             | Prisma ORM 7 dengan `@prisma/adapter-pg`                   |
| Validasi Kontrak | Zod                        | `4.6.7`                       | Validasi input/output runtime dan kontrak tipe bersama     |
| Kualitas & Uji   | ESLint + Prettier + Vitest | `9.39.5` / `3.9.10` / `5.1.0` | Linting, pemformatan, serta pengujian unit & integrasi API |

---

## Prasyarat Sistem

- **Node.js** `>=22.0.0`
- **pnpm** `>=10.0.0`
- **PostgreSQL** `>=15` (opsional untuk pengembangan lokal; hanya diperlukan jika ingin menguji penyimpanan akun opsional ke database PostgreSQL hidup)

---

## Instalasi & Konfigurasi Lingkungan

1. **Kloning repositori dan masuk ke direktori proyek:**

   ```powershell
   git clone https://github.com/akmals06/VEXORA.git
   cd VEXORA
   ```

2. **Instal seluruh dependensi workspace:**

   ```powershell
   pnpm install
   ```

3. **Salin berkas `.env.example` menjadi `.env` lokal (berkas `.env` diabaikan oleh Git):**

   - **Root (`.env.example` -> `.env`)**: Pengaturan umum `NODE_ENV=development`.
   - **Frontend (`apps/web/.env.example` -> `apps/web/.env.local`)**:
     - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1`
   - **Backend (`apps/api/.env.example` -> `apps/api/.env`)**:
     - `NODE_ENV=development`
     - `PORT=4000`
     - `CORS_ORIGIN=http://localhost:3000`
     - `LOG_LEVEL=info`
     - `SESSION_TTL_DAYS=7`
     - `DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/voxera_dev?schema=public`
   - **Database (`packages/database/.env.example` -> `packages/database/.env`)**:
     - `DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/voxera_dev?schema=public`

---

## Perintah Pengembangan, Pengujian & Verifikasi

Jalankan perintah berikut dari direktori root repositori:

| Perintah            | Deskripsi                                                                    |
| :------------------ | :--------------------------------------------------------------------------- |
| `pnpm dev`          | Menjalankan server pengembangan frontend (`:3000`) dan backend API (`:4000`) |
| `pnpm build`        | Membangun seluruh paket dan aplikasi untuk produksi melalui Turborepo        |
| `pnpm lint`         | Menjalankan pemeriksaan statis ESLint di seluruh paket workspace             |
| `pnpm typecheck`    | Menjalankan pemeriksaan tipe TypeScript (`tsc --noEmit`) di seluruh paket    |
| `pnpm test`         | Menjalankan seluruh pengujian unit, kontrak, dan integrasi melalui Vitest    |
| `pnpm format`       | Memformat kode sumber menggunakan Prettier                                   |
| `pnpm format:check` | Memverifikasi kepatuhan format kode terhadap aturan Prettier                 |
| `pnpm db:validate`  | Memvalidasi skema Prisma (`packages/database/prisma/schema.prisma`)          |
| `pnpm db:generate`  | Menghasilkan artefak Prisma Client di `@voxera/database`                     |

---

## Fitur Utama & Batas Privasi

1. **Beranda Masalah & Kepercayaan (`/`)**: Kanvas bento berbasis situasi dengan 10 domain masalah kerja, indikator privasi sesi lokal, dan akses cepat bantuan darurat.
2. **Navigator Masalah Kerja (`/navigate`)**: Alur pemetaan 3 tahap (termasuk disambiguasi terstruktur untuk kondisi _"Belum Yakin"_ / `unsure`) yang dievaluasi oleh mesin perutean deterministik 6 tahap.
3. **Jalur Dukungan Terpadu (`/journey`)**: Rencana dukungan multidisiplin (Psikologi Kerja, Literasi Hukum Ketenagakerjaan, Komunikasi Praktis), pelacak langkah tindak lanjut, refleksi makna kerja non-klinis, serta batas etik pemeriksaan awal non-diagnostik.
4. **Alat Persiapan Percakapan (`/prepare`)**: Penyusun draf komunikasi 5-prompt untuk 6 target penerima (`manager`, `hr`, `psychologist`, `counselor`, `legal_professional`, `career_professional`) yang disimpan khusus di sesi peramban lokal (`session_local_only`).
5. **Skenario & Direktori Dukungan (`/scenarios`)**: Simulasi keputusan tempat kerja, refleksi makna kerja & adaptasi digital, serta direktori saluran dukungan internal dan eksternal.
6. **Perjalanan Saya & Kontrol Sesi (`/my-journey`)**: Transparansi batas penyimpanan 3 lapis (`session_local_only`, `optional_account_saved`, `never_persisted`), penghapusan sesi lokal sekali klik, serta akun opsional berbasis kuki `HttpOnly` untuk menyimpan langkah non-sensitif lintas perangkat.
