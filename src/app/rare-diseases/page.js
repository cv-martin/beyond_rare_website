'use client';

import React, { useState } from 'react';

export default function RareDiseases() {
  const [loadingNord, setLoadingNord] = useState(true);
  const [loadingGenes, setLoadingGenes] = useState(true);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-brand-cream">
      {/* SECTION 1: Hero Banner */}
      <section
        className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/5.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-5xl mx-auto w-full text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Learn More About Rare Diseases
          </h1>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-brand-purple-dark/95 max-w-3xl mx-auto">
            Visit our Rare Disease Glossary to quickly access information on any rare disease, or view news and current events to get the most up-to-date information on ongoing research, cures, and community stories.
          </p>
          <div className="w-16 h-1.5 bg-brand-purple mx-auto rounded-full mt-6"></div>
          
          {/* Resource Quick Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={() => scrollToSection('glossary')}
              className="px-8 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-sm shadow-sm hover:shadow transition duration-200"
            >
              Rare Disease Glossary
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="px-8 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold rounded-full text-sm shadow-sm hover:shadow transition duration-200"
            >
              News & Current Events
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Resources */}
      <section
        className="relative pt-12 pb-20 px-4 sm:px-6 md:px-12 bg-brand-green-light"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/4.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          
          {/* Glossary (NORD) */}
          <section id="glossary" className="scroll-mt-24 space-y-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-brand-purple-dark font-display flex items-center gap-2">
                    <span>Glossary</span>
                    <span className="text-xs px-2.5 py-1 bg-brand-purple/20 text-brand-purple-dark rounded-full font-extrabold">
                      Resource by NORD
                    </span>
                  </h2>
                  <p className="text-sm font-semibold text-brand-purple-dark/80 mt-1">
                    Explore comprehensive reports on over 1,200 rare diseases provided by the National Organization for Rare Disorders.
                  </p>
                </div>
                <a
                  href="https://rarediseases.org/rare-diseases/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-purple hover:text-brand-purple-dark hover:underline shrink-0 transition"
                >
                  <span>Open in new tab</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Iframe Container */}
              <div className="relative w-full h-[650px] border-2 border-white/50 rounded-xl overflow-hidden bg-brand-cream/80 shadow-inner">
                {loadingNord && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 space-y-3">
                    <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-brand-purple-dark">Loading NORD Glossary...</p>
                  </div>
                )}
                <iframe
                  src="https://rarediseases.org/rare-diseases/"
                  title="NORD Rare Disease Database"
                  className="w-full h-full border-none"
                  onLoad={() => setLoadingNord(false)}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                ></iframe>
              </div>
            </div>
          </section>

          {/* News & Events (Global Genes) */}
          <section id="news" className="scroll-mt-24 space-y-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-brand-purple-dark font-display flex items-center gap-2">
                    <span>News and Current Events</span>
                    <span className="text-xs px-2.5 py-1 bg-brand-green/20 text-brand-green-dark rounded-full font-extrabold">
                      Resource by Global Genes
                    </span>
                  </h2>
                  <p className="text-sm font-semibold text-brand-purple-dark/80 mt-1">
                    Stay updated with the latest news, updates, advocacy, and breakthrough research from Global Genes' RARE Daily Blog.
                  </p>
                </div>
                <a
                  href="https://globalgenes.org/rare-daily/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-green hover:text-brand-green-dark hover:underline shrink-0 transition"
                >
                  <span>Open in new tab</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Iframe Container */}
              <div className="relative w-full h-[650px] border-2 border-white/50 rounded-xl overflow-hidden bg-brand-cream/80 shadow-inner">
                {loadingGenes && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 space-y-3">
                    <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-brand-green-dark">Loading RARE Daily Blog...</p>
                  </div>
                )}
                <iframe
                  src="https://globalgenes.org/rare-daily/"
                  title="Global Genes RARE Daily Blog"
                  className="w-full h-full border-none"
                  onLoad={() => setLoadingGenes(false)}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                ></iframe>
              </div>
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}
