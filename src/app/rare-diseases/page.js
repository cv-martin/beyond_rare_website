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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-display">Learn More About Rare Diseases</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Visit our Rare Disease Glossary to quickly access information on any rare disease, or view news and current events to get the most up-to-date information on ongoing research, cures, and community stories.
        </p>
        <div className="w-12 h-1 bg-brand-green mx-auto rounded-full mt-4"></div>
      </div>

      {/* Resource Quick Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <button
          onClick={() => scrollToSection('glossary')}
          className="px-8 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300"
        >
          Rare Disease Glossary
        </button>
        <button
          onClick={() => scrollToSection('news')}
          className="px-8 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300"
        >
          News & Current Events
        </button>
      </div>

      {/* Section 1: Glossary (NORD) */}
      <section id="glossary" className="scroll-mt-24 mb-20 space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
                <span>Glossary</span>
                <span className="text-xs px-2.5 py-1 bg-brand-purple/10 text-brand-purple rounded-full font-semibold">
                  Resource by NORD
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Explore comprehensive reports on over 1,200 rare diseases provided by the National Organization for Rare Disorders.
              </p>
            </div>
            <a
              href="https://rarediseases.org/rare-diseases/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-purple hover:underline shrink-0"
            >
              <span>Open in new tab</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Iframe Container */}
          <div className="relative w-full h-[650px] border border-gray-150 rounded-xl overflow-hidden bg-brand-cream shadow-inner">
            {loadingNord && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-3">
                <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">Loading NORD Glossary...</p>
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

      {/* Section 2: News & Events (Global Genes) */}
      <section id="news" className="scroll-mt-24 space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
                <span>News and Current Events</span>
                <span className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green rounded-full font-semibold">
                  Resource by Global Genes
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Stay updated with the latest news, updates, advocacy, and breakthrough research from Global Genes' RARE Daily Blog.
              </p>
            </div>
            <a
              href="https://globalgenes.org/rare-daily/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline shrink-0"
            >
              <span>Open in new tab</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Iframe Container */}
          <div className="relative w-full h-[650px] border border-gray-150 rounded-xl overflow-hidden bg-brand-cream shadow-inner">
            {loadingGenes && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-3">
                <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">Loading RARE Daily Blog...</p>
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
  );
}
