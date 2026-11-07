import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Footer } from "@/components/layout/footer";
import { TopNavigation } from "@/components/layout/top-navigation";

interface PropertiPageShell {
  children: ReactNode;
}

export function PageShell({ children }: PropertiPageShell) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--vx-bg-viewport)] px-2 py-3 text-[var(--vx-text-primary)] sm:px-4 sm:py-5 lg:px-6">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#0C264F] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>

      <div className="mx-auto w-full max-w-[1380px]">
        {/* Outer White/Dark Frame matching GeneX desktop application canvas */}
        <div className="rounded-[24px] border border-white/10 bg-[var(--vx-bg-frame)] p-3 shadow-[var(--vx-shadow-frame)] sm:p-4 lg:p-5">
          <TopNavigation />

          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            <DashboardSidebar />

            <main
              id="konten-utama"
              className="min-w-0 flex-1 rounded-[20px] border border-[var(--vx-border-subtle)] bg-[var(--vx-bg-workspace)] p-3.5 sm:p-5 lg:p-6"
            >
              {children}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
