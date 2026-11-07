import type { ReactNode } from "react";

export type NadaStatusBadge =
  "netral" | "utama" | "peringatan" | "aman" | "info" | "sukses" | "bahaya";

interface PropertiStatusBadge {
  label?: string;
  nada?: NadaStatusBadge;
  varian?: NadaStatusBadge;
  children?: ReactNode;
  className?: string;
}

const peta_kelas_nada: Record<NadaStatusBadge, string> = {
  netral:
    "bg-[#E8F0FA] text-[#16243A] border-[#D9E4F2] dark:bg-[#193460] dark:text-[#E2E8F0] dark:border-[#264373]",
  utama:
    "bg-[#DDE9F7] text-[#0A2552] border-[#B6CBE8] dark:bg-[#1F3E72] dark:text-[#DBEAFE] dark:border-[#305FA7]",
  info: "bg-[#DDE9F7] text-[#0A2552] border-[#B6CBE8] dark:bg-[#1F3E72] dark:text-[#DBEAFE] dark:border-[#305FA7]",
  aman: "bg-[#E7F6EF] text-[#166534] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800",
  sukses:
    "bg-[#E7F6EF] text-[#166534] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800",
  peringatan:
    "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800",
  bahaya:
    "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA] dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800",
};

export function StatusBadge({
  label,
  nada,
  varian,
  children,
  className = "",
}: PropertiStatusBadge) {
  const nada_aktif: NadaStatusBadge = nada ?? varian ?? "netral";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight ${peta_kelas_nada[nada_aktif]} ${className}`}
    >
      {children ?? label}
    </span>
  );
}
