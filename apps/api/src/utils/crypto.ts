import { createHash, randomBytes, scrypt as scrypt_callback, timingSafeEqual } from "node:crypto";

/**
 * Parameter baseline OWASP Password Storage Cheat Sheet untuk scrypt:
 * N = 2^17 (131072), r = 8, p = 1, panjang kunci = 64 byte, salt >= 16 byte.
 * Memori yang dibutuhkan = 128 * N * r = 128 MiB -> maxmem disetel eksplisit ke 256 MiB.
 */
export const PARAMETER_SCRYPT_OWASP = {
  N: 131072,
  r: 8,
  p: 1,
  panjang_kunci: 64,
  panjang_salt: 16,
  maxmem: 256 * 1024 * 1024,
} as const;

const VERSI_FORMAT_SCRYPT = "v1";
const BATAS_KONKURENSI_SCRYPT = 2;

export interface ParameterHashTersimpan {
  versi: string;
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  kunci_turunan: Buffer;
}

let jumlah_derivasi_aktif = 0;
const antrean_derivasi: Array<() => void> = [];

function ambil_slot_derivasi(): Promise<void> {
  if (jumlah_derivasi_aktif < BATAS_KONKURENSI_SCRYPT) {
    jumlah_derivasi_aktif += 1;
    return Promise.resolve();
  }
  return new Promise((selesai) => {
    antrean_derivasi.push(() => {
      jumlah_derivasi_aktif += 1;
      selesai();
    });
  });
}

function lepaskan_slot_derivasi(): void {
  jumlah_derivasi_aktif -= 1;
  const berikutnya = antrean_derivasi.shift();
  if (berikutnya) {
    berikutnya();
  }
}

async function jalankan_scrypt_async(
  kata_sandi: string,
  salt: Buffer,
  panjang_kunci: number,
  opsi: { N: number; r: number; p: number; maxmem: number },
): Promise<Buffer> {
  await ambil_slot_derivasi();
  try {
    return await new Promise<Buffer>((resolve, reject) => {
      scrypt_callback(kata_sandi, salt, panjang_kunci, opsi, (galat, kunci_turunan) => {
        if (galat) {
          reject(galat);
          return;
        }
        resolve(kunci_turunan);
      });
    });
  } finally {
    lepaskan_slot_derivasi();
  }
}

/**
 * Menghasilkan hash kata sandi berformat versi:
 * scrypt$v1$n=131072,r=8,p=1$<salt_hex>$<derived_key_hex>
 */
export async function hash_kata_sandi(kata_sandi: string): Promise<string> {
  const salt = randomBytes(PARAMETER_SCRYPT_OWASP.panjang_salt);
  const kunci_turunan = await jalankan_scrypt_async(
    kata_sandi,
    salt,
    PARAMETER_SCRYPT_OWASP.panjang_kunci,
    {
      N: PARAMETER_SCRYPT_OWASP.N,
      r: PARAMETER_SCRYPT_OWASP.r,
      p: PARAMETER_SCRYPT_OWASP.p,
      maxmem: PARAMETER_SCRYPT_OWASP.maxmem,
    },
  );

  return `scrypt$${VERSI_FORMAT_SCRYPT}$n=${PARAMETER_SCRYPT_OWASP.N},r=${PARAMETER_SCRYPT_OWASP.r},p=${PARAMETER_SCRYPT_OWASP.p}$${salt.toString("hex")}$${kunci_turunan.toString("hex")}`;
}

/**
 * Mengurai dan memvalidasi representasi hash kata sandi yang tersimpan.
 * Mengembalikan null bila format rusak atau parameter di luar batas aman.
 */
export function urai_hash_kata_sandi(hash_tersimpan: string): ParameterHashTersimpan | null {
  const bagian = hash_tersimpan.split("$");
  if (bagian.length !== 5) {
    return null;
  }

  const [algoritma, versi, string_parameter, salt_hex, kunci_hex] = bagian;
  if (
    algoritma !== "scrypt" ||
    versi !== VERSI_FORMAT_SCRYPT ||
    !string_parameter ||
    !salt_hex ||
    !kunci_hex
  ) {
    return null;
  }

  const kecocokan_param = /^n=(\d+),r=(\d+),p=(\d+)$/.exec(string_parameter);
  if (!kecocokan_param) {
    return null;
  }

  const N = Number(kecocokan_param[1]);
  const r = Number(kecocokan_param[2]);
  const p = Number(kecocokan_param[3]);

  const apakah_n_pangkat_dua = N >= 16384 && N <= 1048576 && (N & (N - 1)) === 0;
  if (!apakah_n_pangkat_dua || r < 1 || r > 32 || p < 1 || p > 16) {
    return null;
  }

  if (
    !/^[0-9a-f]+$/i.test(salt_hex) ||
    salt_hex.length < PARAMETER_SCRYPT_OWASP.panjang_salt * 2 ||
    salt_hex.length % 2 !== 0
  ) {
    return null;
  }

  if (
    !/^[0-9a-f]+$/i.test(kunci_hex) ||
    kunci_hex.length !== PARAMETER_SCRYPT_OWASP.panjang_kunci * 2
  ) {
    return null;
  }

  return {
    versi,
    N,
    r,
    p,
    salt: Buffer.from(salt_hex, "hex"),
    kunci_turunan: Buffer.from(kunci_hex, "hex"),
  };
}

/**
 * Memverifikasi kata sandi terhadap hash tersimpan secara constant-time (timingSafeEqual).
 */
export async function verifikasi_kata_sandi(
  kata_sandi: string,
  hash_tersimpan: string,
): Promise<boolean> {
  const terurai = urai_hash_kata_sandi(hash_tersimpan);
  if (!terurai) {
    return false;
  }

  const kunci_kandidat = await jalankan_scrypt_async(
    kata_sandi,
    terurai.salt,
    terurai.kunci_turunan.length,
    {
      N: terurai.N,
      r: terurai.r,
      p: terurai.p,
      maxmem: PARAMETER_SCRYPT_OWASP.maxmem,
    },
  );

  if (kunci_kandidat.length !== terurai.kunci_turunan.length) {
    return false;
  }

  return timingSafeEqual(kunci_kandidat, terurai.kunci_turunan);
}

const SALT_DUMMY_TETAP = randomBytes(PARAMETER_SCRYPT_OWASP.panjang_salt).toString("hex");
const KUNCI_DUMMY_TETAP = randomBytes(PARAMETER_SCRYPT_OWASP.panjang_kunci).toString("hex");
const HASH_DUMMY_TETAP = `scrypt$${VERSI_FORMAT_SCRYPT}$n=${PARAMETER_SCRYPT_OWASP.N},r=${PARAMETER_SCRYPT_OWASP.r},p=${PARAMETER_SCRYPT_OWASP.p}$${SALT_DUMMY_TETAP}$${KUNCI_DUMMY_TETAP}`;

/**
 * Menjalankan derivasi scrypt dummy saat akun tidak ditemukan pada proses login
 * untuk mencegah enumerasi akun melalui perbedaan waktu respons yang mencolok.
 */
export async function verifikasi_kata_sandi_dummy(kata_sandi: string): Promise<void> {
  await verifikasi_kata_sandi(kata_sandi, HASH_DUMMY_TETAP);
}

/**
 * Menghasilkan token sesi acak kriptografis 32-byte (256-bit) dalam format base64url.
 * Sama sekali tidak memuat ID pengguna, email, peran, atau metadata apa pun.
 */
export function buat_token_sesi_mentah(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Memvalidasi bentuk token sesi mentah (43 karakter base64url yang mewakili 32 byte).
 */
export function validasi_format_token_sesi(token_kandidat: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token_kandidat);
}

/**
 * Menghitung digest SHA-256 satu arah dari token sesi mentah untuk penyimpanan di SesiPengguna.hash_token.
 */
export function hash_token_sesi(token_mentah: string): string {
  return createHash("sha256").update(token_mentah, "utf8").digest("hex");
}
