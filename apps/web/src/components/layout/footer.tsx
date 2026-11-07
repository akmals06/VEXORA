import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="mt-4 rounded-[22px] border border-white/10 bg-[#0A2552] px-5 py-6 text-[#F8FAFC] shadow-lg sm:px-8 sm:py-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-extrabold text-[#0A2552]">
              VX
            </span>
            <p className="text-base font-extrabold tracking-tight text-white">VOXERA</p>
          </div>
          <p className="mt-2.5 max-w-md text-xs leading-relaxed text-[#BDD0EA]">
            Platform perlindungan dan kesejahteraan psikososial pekerja berbasis navigasi solusi
            terstruktur, literasi hak normatif, dan kesiapan komunikasi kerja yang aman.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
              <Icon name="shield" size={13} />
              Non-Pengawasan HR
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
              <Icon name="lock" size={13} />
              Sesi Lokal Utama
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-bold tracking-wider text-white uppercase">Navigasi Cepat</p>
          <ul className="mt-2.5 space-y-1.5 text-xs text-[#BDD0EA]">
            <li>
              <Link href="/" className="hover:text-white hover:underline">
                Beranda Dashboard
              </Link>
            </li>
            <li>
              <Link href="/navigate" className="hover:text-white hover:underline">
                Navigasi Masalah Kerja
              </Link>
            </li>
            <li>
              <Link href="/journey" className="hover:text-white hover:underline">
                Jalur Dukungan
              </Link>
            </li>
            <li>
              <Link href="/prepare" className="hover:text-white hover:underline">
                Persiapan Percakapan
              </Link>
            </li>
            <li>
              <Link href="/scenarios" className="hover:text-white hover:underline">
                Skenario & Direktori
              </Link>
            </li>
            <li>
              <Link href="/my-journey" className="hover:text-white hover:underline">
                Perjalanan Saya
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-xs font-bold tracking-wider text-white uppercase">
            Batas Layanan & Saluran Darurat
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-[#BDD0EA]">
            VOXERA memberikan informasi edukatif dan dukungan awal non-klinis, bukan diagnosis
            medis/psikologis, nasihat hukum mengikat, atau kanal investigasi HR/pelaporan
            pelanggaran resmi.
          </p>
          <div className="mt-3 rounded-xl bg-white/10 p-3 text-xs text-white">
            <p className="font-semibold">
              Saluran Darurat Nasional: 112 / 119 | SEJIWA 119 ext. 8 | SAPA 129
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-2 border-t border-white/10 pt-4 text-[11px] text-[#BDD0EA] sm:flex-row sm:items-center">
        <p>
          VOXERA: Proyek Akhir Interdisipliner (Psikologi Kerja, Informatika, Hukum, Ekonomi &
          Bisnis)
        </p>
        <Link
          href="/my-journey#session-privacy"
          className="font-semibold text-white hover:underline"
        >
          Kebijakan Privasi & Batas Penyimpanan Sesi ›
        </Link>
      </div>
    </footer>
  );
}
