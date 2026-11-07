import type { IssueId } from "@voxera/contracts";
import type { SVGProps } from "react";

export type NamaIkon =
  | "dashboard"
  | "compass"
  | "route"
  | "chat"
  | "scenarios"
  | "book"
  | "bookmark"
  | "shield"
  | "scale"
  | "users"
  | "briefcase"
  | "layers"
  | "cpu"
  | "heart-handshake"
  | "help-circle"
  | "alert-triangle"
  | "lifebuoy"
  | "trash"
  | "user"
  | "sun"
  | "moon"
  | "menu"
  | "x"
  | "close"
  | "chevron-right"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "check"
  | "copy"
  | "printer"
  | "eye"
  | "eye-off"
  | "lock"
  | "log-out"
  | "logout"
  | "sparkle"
  | "sparkles-off";

interface PropertiIkon extends SVGProps<SVGSVGElement> {
  nama?: NamaIkon;
  name?: NamaIkon;
  ukuran?: number;
  size?: number;
}

/**
 * Satu sistem ikon garis (1.8px stroke) terpadu untuk seluruh antarmuka VOXERA.
 * Bebas dari emoji, simbol medis, detak jantung, maupun grafis DNA.
 */
export function Icon({ nama, name, ukuran, size, className = "", ...props }: PropertiIkon) {
  const ikon_aktif: NamaIkon = nama ?? name ?? "dashboard";
  const ukuran_aktif: number = ukuran ?? size ?? 18;

  const properti_umum: SVGProps<SVGSVGElement> = {
    width: ukuran_aktif,
    height: ukuran_aktif,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: `shrink-0 ${className}`.trim(),
    ...props,
  };

  switch (ikon_aktif) {
    case "dashboard":
      return (
        <svg {...properti_umum}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "compass":
      return (
        <svg {...properti_umum}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" />
        </svg>
      );
    case "route":
      return (
        <svg {...properti_umum}>
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <path d="M8.5 18h4a3.5 3.5 0 0 0 0-7h-1a3.5 3.5 0 0 1 0-7h4" />
        </svg>
      );
    case "chat":
      return (
        <svg {...properti_umum}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6.5A8 8 0 1 1 21 12Z" />
          <path d="M8 11h8" />
          <path d="M8 14.5h5" />
        </svg>
      );
    case "scenarios":
    case "book":
      return (
        <svg {...properti_umum}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
          <path d="M8 8h7" />
          <path d="M8 12h5" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...properti_umum}>
          <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17l-6-3.5L6 21V4Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...properti_umum}>
          <path d="M12 3 4.5 6v5.5c0 5 3.2 8.7 7.5 10 4.3-1.3 7.5-5 7.5-10V6L12 3Z" />
          <path d="m9.5 12 1.8 1.8 3.5-3.6" />
        </svg>
      );
    case "scale":
      return (
        <svg {...properti_umum}>
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="m5 7-3 6h6l-3-6Z" />
          <path d="m19 7-3 6h6l-3-6Z" />
          <path d="M8 21h8" />
        </svg>
      );
    case "users":
      return (
        <svg {...properti_umum}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M3 19a6 6 0 0 1 12 0" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16.5 19a4.5 4.5 0 0 1 4.5 0" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...properti_umum}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          <path d="M3 12h18" />
        </svg>
      );
    case "layers":
      return (
        <svg {...properti_umum}>
          <polygon points="12 3 3 8 12 13 21 8 12 3" />
          <path d="m3 13 9 5 9-5" />
          <path d="m3 17.5 9 4.5 9-4.5" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...properti_umum}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
    case "heart-handshake":
      return (
        <svg {...properti_umum}>
          <path d="M19 14c1.5-1.5 2.5-3.2 2.5-5A4.5 4.5 0 0 0 13 6.5L12 7.6l-1-1.1A4.5 4.5 0 0 0 2.5 9c0 1.8 1 3.5 2.5 5l7 6.5 7-6.5Z" />
        </svg>
      );
    case "help-circle":
      return (
        <svg {...properti_umum}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.2a2.5 2.5 0 0 1 4.8.8c0 1.6-2.3 2.1-2.3 3.5" />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" />
        </svg>
      );
    case "alert-triangle":
    case "lifebuoy":
      return (
        <svg {...properti_umum}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <path d="m5.6 5.6 3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5" />
        </svg>
      );
    case "trash":
      return (
        <svg {...properti_umum}>
          <path d="M4 7h16" />
          <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
          <path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7" />
        </svg>
      );
    case "user":
      return (
        <svg {...properti_umum}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "sun":
      return (
        <svg {...properti_umum}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
      );
    case "moon":
      return (
        <svg {...properti_umum}>
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...properti_umum}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "x":
    case "close":
      return (
        <svg {...properti_umum}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...properti_umum}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...properti_umum}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...properti_umum}>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg {...properti_umum}>
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      );
    case "check":
      return (
        <svg {...properti_umum}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "copy":
      return (
        <svg {...properti_umum}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case "printer":
      return (
        <svg {...properti_umum}>
          <path d="M6 9V3h12v6" />
          <rect x="3" y="9" width="18" height="8" rx="2" />
          <path d="M6 14h12v7H6v-7Z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...properti_umum}>
          <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "eye-off":
      return (
        <svg {...properti_umum}>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5" />
          <path d="M9.4 5.8A9.8 9.8 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a17.7 17.7 0 0 1-4.2 4.9" />
          <path d="M6.3 6.3A17.4 17.4 0 0 0 2 12s3.5 6.5 10 6.5a9.9 9.9 0 0 0 4.5-1" />
        </svg>
      );
    case "lock":
      return (
        <svg {...properti_umum}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "log-out":
    case "logout":
      return (
        <svg {...properti_umum}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case "sparkle":
    case "sparkles-off":
      return (
        <svg {...properti_umum}>
          <path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" />
        </svg>
      );
  }
}

export function dapatkan_ikon_domain_masalah(id_masalah: IssueId): NamaIkon {
  switch (id_masalah) {
    case "workload_pressure":
      return "briefcase";
    case "workplace_relationships":
      return "users";
    case "bullying_harassment":
      return "shield";
    case "discrimination_fairness":
      return "scale";
    case "role_clarity":
      return "layers";
    case "employment_rights":
      return "scale";
    case "career_growth":
      return "compass";
    case "digital_adaptation":
      return "cpu";
    case "emotional_support":
      return "heart-handshake";
    case "unsure":
      return "help-circle";
  }
}
