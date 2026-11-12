"use client";

import { useState } from "react";

export function WelcomeIntro() {
  const [terbuka, atur_terbuka] = useState(true);

  const masuk_ke_web = () => {
    atur_terbuka(false);
  };

  if (!terbuka) return null;

  return (
    <div className="vx-intro-screen fixed inset-0 z-[100] grid min-h-screen place-items-center overflow-y-auto px-5 py-10 sm:px-8">
      <section
        aria-labelledby="judul-intro-voxera"
        aria-modal="true"
        className="relative w-full max-w-5xl"
        role="dialog"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="vx-intro-reveal inline-flex items-center justify-center gap-3 text-left" style={{ animationDelay: "80ms" }}>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--vx-cta-navy)] text-sm font-extrabold text-white shadow-lg shadow-[var(--vx-cta-navy)]/15">VX</span>
            <span>
              <span className="block text-sm font-extrabold tracking-[0.16em]">VEXORA</span>
              <span className="block text-[11px] text-[var(--vx-text-secondary)]">Perlindungan &amp; Kesejahteraan Kerja</span>
            </span>
          </div>

          <div aria-hidden="true" className="vx-intro-reveal mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[var(--vx-primary)]/60 to-transparent sm:mt-14" style={{ animationDelay: "180ms" }} />
          <h1 id="judul-intro-voxera" className="vx-intro-reveal mx-auto mt-8 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:mt-10 sm:text-6xl lg:text-7xl" style={{ animationDelay: "340ms" }}>
            Memahami situasi kerja<span className="text-[var(--vx-primary)]">.</span><br className="hidden sm:block" /> Menemukan langkah yang lebih terarah.
          </h1>
          <p className="vx-intro-reveal mx-auto mt-6 max-w-3xl text-sm leading-7 text-[var(--vx-text-secondary)] sm:mt-8 sm:text-base sm:leading-8" style={{ animationDelay: "460ms" }}>
            VEXORA adalah platform perlindungan dan kesejahteraan psikososial pekerja. Platform ini membantu Anda memahami tantangan di tempat kerja, menyiapkan percakapan, mempelajari pilihan dukungan, dan mempertimbangkan langkah berikutnya sesuai kebutuhan. VEXORA menyediakan panduan dan informasi; layanan ini bukan pengganti bantuan profesional atau layanan darurat.
          </p>

          <div className="vx-intro-reveal mt-8 flex flex-col items-center gap-3 sm:mt-10" style={{ animationDelay: "580ms" }}>
            <button
              type="button"
              onClick={masuk_ke_web}
              className="vx-intro-cta inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--vx-cta-navy)] px-7 text-sm font-bold text-white shadow-lg shadow-[var(--vx-cta-navy)]/15 transition hover:-translate-y-0.5 hover:bg-[var(--vx-cta-navy-hover)]"
            >
              Masuk ke VEXORA
            </button>
            <p className="max-w-xs text-xs leading-relaxed text-[var(--vx-text-secondary)]">Privat sejak awal. Sesi Anda tersimpan sementara di peramban ini.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
