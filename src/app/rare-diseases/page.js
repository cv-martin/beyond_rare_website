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
      {/* SECTION 3: Rare by the Numbers — Futuristic Biopunk Stats */}
      <section
        className="relative overflow-hidden py-20 px-6 md:px-12"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/rare_diseases_stats_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay with teal/navy tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050d15]/80 via-[#0a1a20]/75 to-[#0d1520]/80 pointer-events-none" />

        {/* Neon glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-purple/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/5 backdrop-blur-md">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300/80">Did You Know?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-display text-white leading-tight">
              Rare by the <span style={{ color: '#5eead4' }}>Numbers</span>
            </h2>
            <p className="text-white/60 font-semibold text-sm max-w-xl mx-auto">
              The scale of rare disease reaches further than most people realize. Here is the reality.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stat: '7,000+',
                label: 'Known Rare Diseases',
                sub: 'Recognized worldwide',
                icon: '🧬',
                color: 'from-purple-500/20 to-purple-700/5',
                border: 'border-purple-400/20'
              },
              {
                stat: '300M',
                label: 'People Affected',
                sub: 'Globally each year',
                icon: '🌍',
                color: 'from-teal-500/20 to-teal-700/5',
                border: 'border-teal-400/20'
              },
              {
                stat: '1 in 10',
                label: 'US Individuals',
                sub: 'Living with a rare disease',
                icon: '🔬',
                color: 'from-emerald-500/20 to-emerald-700/5',
                border: 'border-emerald-400/20'
              },
              {
                stat: '95%',
                label: 'Without Treatment',
                sub: 'Of rare diseases have no approved cure',
                icon: '💊',
                color: 'from-violet-500/20 to-violet-700/5',
                border: 'border-violet-400/20'
              }
            ].map(({ stat, label, sub, icon, color, border }) => (
              <div
                key={label}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${color} border ${border} flex flex-col gap-3`}
                style={{ backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-4xl font-black text-white leading-none">{stat}</p>
                <div>
                  <p className="text-sm font-extrabold text-white/90">{label}</p>
                  <p className="text-[11px] text-white/45 font-semibold mt-0.5">{sub}</p>
                </div>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center space-y-4">
            <p className="text-white/60 text-sm font-semibold">
              Knowledge is the first step. Community is the next.
            </p>
            <a
              href="/beyond_rare_website/your-story"
              className="inline-block px-10 py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              Join Our Community →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
