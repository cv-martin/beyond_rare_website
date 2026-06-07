'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Sample searchable index of static site content
const searchIndex = [
  {
    title: "Our Mission & Pillars",
    snippet: "empowering people through connection, advocacy, and meaning. Personalized patient forums, educational rare disease directory, peer support programs, distinct advocacy initiatives.",
    url: "/"
  },
  {
    title: "Founder's Story - Aashriya Vasamsetti",
    snippet: "Since the young age of three, I’ve been suffering from the rare, genetic mutation of McCune-Albright Syndrome. Alleviating hurt for those similar to me. Beyond Rare is a tool to make sure you feel supported, represented, and seen.",
    url: "/"
  },
  {
    title: "Forums: Caregivers and Allies Group",
    snippet: "Watching and helping someone with a rare disease can be worrisome and heartbreaking. Express concerns and find support in a safe community feed.",
    url: "/your-story"
  },
  {
    title: "Forums: Rare Disease Stories Group",
    snippet: "A safe space to discuss personal experiences, living with rare diseases, and success stories while building inclusivity.",
    url: "/your-story"
  },
  {
    title: "Rare Disease Glossary & NORD Database",
    snippet: "Visit our Rare Disease Glossary provided by NORD to quickly access information on over 1,200 rare diseases.",
    url: "/rare-diseases"
  },
  {
    title: "Global Genes RARE Daily News",
    snippet: "News and current events on ongoing research, cures, and community stories provided by Global Genes RARE Daily Blog.",
    url: "/rare-diseases"
  },
  {
    title: "Rare Insights Blog: McCune-Albright Syndrome Profile",
    snippet: "Read 'Understanding McCune-Albright Syndrome: A Personal Perspective' written by founder Aashriya Vasamsetti.",
    url: "/blog"
  },
  {
    title: "Art Showcase & Community Gallery",
    snippet: "Celebrate community artistry including 'Neuronal Death, A Work in Progress' by Mary Porter and 'Self Portrait' by Gems Godfrey.",
    url: "/blog"
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setInputVal(query);
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      // Search matching titles or snippets
      const matches = searchIndex.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.snippet.toLowerCase().includes(lowerQuery)
      );
      setResults(matches);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-brand-cream min-h-[calc(100vh-64px)]">
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
        <div className="max-w-4xl mx-auto w-full text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Search Our Site
          </h1>
          {query ? (
            <p className="text-lg md:text-xl font-bold leading-relaxed text-brand-purple-dark/95 max-w-2xl mx-auto">
              Showing matches for &ldquo;<span className="text-brand-purple font-black">{query}</span>&rdquo;
            </p>
          ) : (
            <p className="text-lg md:text-xl font-bold leading-relaxed text-brand-purple-dark/95 max-w-2xl mx-auto">
              Looking for a specific topic? Enter a keyword below to search across Beyond Rare.
            </p>
          )}
          <div className="w-16 h-1.5 bg-brand-purple mx-auto rounded-full mt-6"></div>
        </div>
      </section>

      {/* SECTION 2: Search Input & Results */}
      <section
        className="relative pt-8 pb-20 px-4 sm:px-6 md:px-12 bg-brand-green-light flex-grow"
        style={{
          backgroundImage: 'url(/beyond_rare_website/images/4.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          
          {/* Search Bar Input */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  id="search-page-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-white/50 bg-white/70 focus:bg-white focus:outline-none focus:border-brand-purple shadow-inner transition text-gray-800 font-medium placeholder-gray-500"
                />
                <svg className="absolute left-4 top-4 w-6 h-6 text-brand-purple-dark/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-xl shadow-sm hover:shadow transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {query && results.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-wider text-brand-purple-dark/70 text-center sm:text-left">
                  Found {results.length} matching page{results.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <div key={idx} className="glass-panel rounded-2xl p-6 shadow-sm space-y-3 transition transform hover:-translate-y-1 hover:shadow-md border border-white/50">
                      <h3 className="font-extrabold font-display text-lg text-brand-purple-dark hover:underline">
                        <Link href={result.url}>{result.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">{result.snippet}</p>
                      <div className="pt-2 flex items-center gap-2">
                        <Link href={result.url} className="text-xs font-extrabold px-4 py-2 bg-brand-green/10 text-brand-green-dark rounded-full hover:bg-brand-green hover:text-white transition">
                          Visit Page →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : query ? (
              <div className="glass-panel rounded-3xl p-12 text-center space-y-4 shadow-sm border border-white/50">
                <p className="text-5xl drop-shadow-sm">🔍</p>
                <h3 className="font-extrabold text-xl text-brand-purple-dark">No results found for &ldquo;{query}&rdquo;</h3>
                <p className="text-sm text-brand-purple-dark/80 font-semibold max-w-md mx-auto leading-relaxed">
                  Try a new search with different keywords, or check that your spelling is correct. You can also explore our glossary and groups pages.
                </p>
              </div>
            ) : (
              <div className="bg-white/40 border-2 border-dashed border-brand-purple/20 rounded-3xl p-12 text-center shadow-sm">
                 <p className="text-sm font-bold text-brand-purple-dark/60">Please type a query in the search bar above to see results.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-brand-purple-dark">Loading search results...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
