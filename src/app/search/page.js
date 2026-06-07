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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-bold font-display text-gray-900">Search Results</h1>
        {query ? (
          <p className="text-gray-500 text-sm">
            Showing matches for &ldquo;<span className="text-brand-purple font-semibold">{query}</span>&rdquo;
          </p>
        ) : (
          <p className="text-gray-500 text-sm">Enter a keyword below to search the website.</p>
        )}
      </div>

      {/* Search Bar Input */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="search-page-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-xl text-sm shadow-sm transition"
        >
          Search
        </button>
      </form>

      {/* Results Display */}
      <div className="space-y-6">
        {query && results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Found {results.length} matching page{results.length > 1 ? 's' : ''}
            </p>
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-2 hover:border-brand-purple/30 transition">
                  <h3 className="font-bold font-display text-base text-brand-purple hover:underline">
                    <Link href={result.url}>{result.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{result.snippet}</p>
                  <div className="pt-2">
                    <Link href={result.url} className="text-xs font-bold text-brand-green hover:underline">
                      Visit Page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <p className="text-3xl">🔍</p>
            <h3 className="font-bold text-lg text-gray-700">No results found for &ldquo;{query}&rdquo;</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Try a new search with different keywords, or check that your spelling is correct. You can also explore our glossary and groups pages.
            </p>
          </div>
        ) : (
          <div className="bg-white/50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-500">
            Please type a query in the search bar above to see results.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500">Loading search results...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
