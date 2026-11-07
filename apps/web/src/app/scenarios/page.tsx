import type { Metadata } from "next";
import { ScenariosView } from "@/features/scenarios/scenarios-view";

export const metadata: Metadata = {
  title: "Skenario Situasi Kerja Interaktif | VOXERA",
  description:
    "Eksplorasi implikasi pilihan tindakan dalam situasi beban kerja, intimidasi atasan, kontrak kerja, dan adaptasi digital.",
};

export default function ScenariosPage() {
  return <ScenariosView />;
}
