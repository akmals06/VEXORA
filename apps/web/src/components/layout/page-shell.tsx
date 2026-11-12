import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";
import { WelcomeIntro } from "@/components/layout/welcome-intro";

interface PropertiPageShell {
  children: ReactNode;
}

export function PageShell({ children }: PropertiPageShell) {
  return (
    <div className="min-h-screen bg-[var(--vx-bg-viewport)] px-0 py-0 text-[var(--vx-text-primary)] sm:px-4 sm:py-4 lg:px-6">
      <WelcomeIntro />
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#0C264F] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>

      <div className="sticky top-0 z-50 border-b border-[var(--vx-border-soft)] bg-[var(--vx-bg-viewport)]">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-3 sm:px-5 lg:px-7">
          <TopNavigation />
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col sm:min-h-[calc(100vh-2rem)]">
        <div className="flex min-h-0 flex-1 gap-0 pt-0 sm:gap-4 sm:pt-4 lg:gap-5">
          <DashboardSidebar />
          <main
            id="konten-utama"
            className="min-w-0 flex-1 px-3 py-4 sm:rounded-2xl sm:border sm:border-[var(--vx-border-soft)] sm:bg-[var(--vx-bg-workspace)] sm:p-4 lg:p-6"
          >
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
