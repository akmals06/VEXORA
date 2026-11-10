import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { TopNavigation } from "@/components/layout/top-navigation";
import { WelcomeIntro } from "@/components/layout/welcome-intro";

interface PropertiPageShell {
  children: ReactNode;
}

export function PageShell({ children }: PropertiPageShell) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--vx-bg-viewport)] px-2 py-3 text-[var(--vx-text-primary)] sm:px-4 sm:py-5 lg:px-6">
      <WelcomeIntro />
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#0C264F] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>

      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1380px] flex-col gap-4 sm:min-h-[calc(100vh-2.5rem)] sm:gap-5">
        <div className="vx-navbar-editorial sticky top-3 z-50 w-full rounded-2xl border px-3 py-3 sm:top-5 sm:px-5 sm:py-4 lg:px-6">
          <TopNavigation />
        </div>

        <main id="konten-utama" className="min-w-0 flex-1 p-3.5 sm:p-5 lg:p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
