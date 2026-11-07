-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "pengguna" (
    "id_pengguna" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "nama_alias" TEXT NOT NULL,
    "hash_kata_sandi" TEXT NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id_pengguna")
);

-- CreateTable
CREATE TABLE "sesi_pengguna" (
    "id_sesi" UUID NOT NULL,
    "id_pengguna" UUID NOT NULL,
    "hash_token" TEXT NOT NULL,
    "kedaluwarsa_pada" TIMESTAMP(3) NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesi_pengguna_pkey" PRIMARY KEY ("id_sesi")
);

-- CreateTable
CREATE TABLE "perjalanan_tersimpan" (
    "id_perjalanan" UUID NOT NULL,
    "id_pengguna" UUID NOT NULL,
    "id_masalah_utama" TEXT NOT NULL,
    "id_subkategori" TEXT NOT NULL,
    "kelas_hasil_utama" TEXT NOT NULL,
    "jalur_dukungan_utama" TEXT NOT NULL,
    "status_perjalanan" TEXT NOT NULL DEFAULT 'aktif',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perjalanan_tersimpan_pkey" PRIMARY KEY ("id_perjalanan")
);

-- CreateTable
CREATE TABLE "langkah_tindak_lanjut" (
    "id_langkah" UUID NOT NULL,
    "id_perjalanan" UUID NOT NULL,
    "urutan_langkah" INTEGER NOT NULL,
    "kode_langkah" TEXT NOT NULL,
    "id_tipe_dukungan" TEXT NOT NULL,
    "status_langkah" TEXT NOT NULL DEFAULT 'belum_dimulai',
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "langkah_tindak_lanjut_pkey" PRIMARY KEY ("id_langkah")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sesi_pengguna_hash_token_key" ON "sesi_pengguna"("hash_token");

-- CreateIndex
CREATE INDEX "sesi_pengguna_id_pengguna_idx" ON "sesi_pengguna"("id_pengguna");

-- CreateIndex
CREATE INDEX "perjalanan_tersimpan_id_pengguna_dibuat_pada_idx" ON "perjalanan_tersimpan"("id_pengguna", "dibuat_pada");

-- CreateIndex
CREATE INDEX "langkah_tindak_lanjut_id_perjalanan_urutan_langkah_idx" ON "langkah_tindak_lanjut"("id_perjalanan", "urutan_langkah");

-- AddForeignKey
ALTER TABLE "sesi_pengguna" ADD CONSTRAINT "sesi_pengguna_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id_pengguna") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perjalanan_tersimpan" ADD CONSTRAINT "perjalanan_tersimpan_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id_pengguna") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langkah_tindak_lanjut" ADD CONSTRAINT "langkah_tindak_lanjut_id_perjalanan_fkey" FOREIGN KEY ("id_perjalanan") REFERENCES "perjalanan_tersimpan"("id_perjalanan") ON DELETE CASCADE ON UPDATE CASCADE;

