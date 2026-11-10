import type { Metadata } from "next";
import { MyJourneyView } from "@/features/my-journey/my-journey-view";

export const metadata: Metadata = {
  title: "Perjalanan Saya (Kontinuitas Opsional) | VEXORA",
  description:
    "Kelola progres langkah tindak lanjut terstruktur lintas sesi dengan prinsip minimisasi data Opsi B.",
};

export default function MyJourneyPage() {
  return <MyJourneyView />;
}
