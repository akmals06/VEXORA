import type { Metadata } from "next";
import { SupportJourneyView } from "@/features/journey/support-journey-view";

export const metadata: Metadata = {
  title: "Jalur Dukungan & Direktori Kanal | VOXERA",
  description:
    "Rencana langkah dukungan kerja terpersonalisasi, batas etik skrining psikologis, refleksi makna kerja, dan direktori kanal pendamping.",
};

export default function JourneyPage() {
  return <SupportJourneyView />;
}
