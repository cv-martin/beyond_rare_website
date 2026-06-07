'use client';

import React, { useState } from 'react';

export default function Blog() {
  const [leftSlideIndex, setLeftSlideIndex] = useState(0);
  const [rightSlideIndex, setRightSlideIndex] = useState(0);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "Understanding McCune-Albright Syndrome: A Personal Perspective",
      excerpt: "Living with a rare genetic mutation like McCune-Albright Syndrome presents unique daily challenges, but it also brings a distinct perspective on resilience, empathy, and advocacy.",
      author: "Aashriya Vasamsetti",
      date: "June 2, 2026",
      readTime: "5 min read",
      category: "Personal Story",
      color: "border-brand-purple text-brand-purple"
    },
    {
      id: 2,
      title: "The Power of Patient-Led Support Networks",
      excerpt: "When medical databases and local clinics lack detailed information, patients and caregivers turn to each other. Here is why peer support programs are essential in rare disease care.",
      author: "Martin Intilt",
      date: "May 28, 2026",
      readTime: "4 min read",
      category: "Community Insights",
      color: "border-brand-green text-brand-green"
    }
  ];

  const leftSlides = [
    {
      image: "/images/1.avif",
      title: '"Neuronal Death, A Work in Progress"',
      artist: "Mary Porter",
      desc: "A stunning watercolor and ink exploration of the human nervous system, highlighting brain cells under stress."
    },
    {
      image: "/images/2.avif",
      title: '"Fragments of Connection"',
      artist: "Community Collaboration",
      desc: "An abstract canvas demonstrating how individuals across separate rare conditions share common threads of experience."
    },
    {
      image: "/images/3.avif",
      title: '"Resiliency in Bloom"',
      artist: "Mary Porter",
      desc: "An organic representation of rare mutations branching into forms of natural growth and cellular adaptation."
    }
  ];

  const rightSlides = [
    {
      image: "/images/4.avif",
      title: '"Self Portrait"',
      artist: "Gems Godfrey",
      desc: "A poignant black and white photographic study exploring isolated figures and spatial distance."
    },
    {
      image: "/images/5.avif",
      title: '"Gene Editing, Visualization"',
      artist: "Gems Godfrey",
      desc: "Visual expression of double-helix structures crossing paths, merging molecular biology with organic lines."
    },
    {
      image: "/images/6.avif",
      title: '"Microscopic Colors"',
      artist: "Alex Chen",
      desc: "A vibrant illustration of genetic patterns and cell dividing sequences under high contrast."
    }
  ];

  const nextSlide = (side) => {
    if (side === 'left') {
      setLeftSlideIndex((prev) => (prev + 1) % leftSlides.length);
    } else {
      setRightSlideIndex((prev) => (prev + 1) % rightSlides.length);
    }
  };

  const prevSlide = (side) => {
    if (side === 'left') {
      setLeftSlideIndex((prev) => (prev - 1 + leftSlides.length) % leftSlides.length);
    } else {
      setRightSlideIndex((prev) => (prev - 1 + rightSlides.length) % rightSlides.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-display">Our Community</h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Visit our blog and art showcase to discover more about our unique community, or explore our advocacy events, successes, and how you can help further our cause.
        </p>
        <div className="w-12 h-1 bg-brand-purple mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Box */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24">
          <div className="bg-white border border-brand-purple/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('blog-feed')}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-gray-700 hover:bg-brand-purple/5 hover:text-brand-purple transition duration-150"
              >
                📰 Rare Insights Blog
              </button>
              <button
                onClick={() => scrollToSection('advocacy')}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-gray-700 hover:bg-brand-purple/5 hover:text-brand-purple transition duration-150"
              >
                📣 Our Advocacy
              </button>
              <button
                onClick={() => scrollToSection('art-showcase')}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-gray-700 hover:bg-brand-purple/5 hover:text-brand-purple transition duration-150"
              >
                🎨 Art Showcase
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-16">
          {/* Section 1: Blog */}
          <section id="blog-feed" className="scroll-mt-24 space-y-6">
            <div className="border-b border-gray-250/50 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 font-display">Rare Insights Blog</h2>
              <p className="text-sm text-gray-500 mt-1">Read the many unique stories of our community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-brand-purple/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${post.color}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-display leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{post.author}</p>
                      <p className="text-[10px] text-gray-400">{post.date}</p>
                    </div>
                    <button className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition">
                      Read Post →
                    </button>
                  </div>
                </article>
              ))}

              <div className="col-span-1 md:col-span-2 bg-brand-cream border border-dashed border-gray-250 p-6 rounded-2xl text-center">
                <p className="text-sm text-gray-650 italic">
                  Have a personal story or insight you want to share? Once you sign up, you can post directly to our Groups Feed, and the most impactful entries will be featured in the Rare Insights Blog.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Advocacy */}
          <section id="advocacy" className="scroll-mt-24 space-y-6">
            <div className="border-b border-gray-250/50 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 font-display">Our Advocacy</h2>
              <p className="text-sm text-gray-500 mt-1">View our community events to build connection and spread awareness</p>
            </div>

            <div 
              className="relative p-10 rounded-2xl text-white overflow-hidden shadow-lg flex items-center justify-center min-h-[200px]"
              style={{ background: 'linear-gradient(135deg, #7b6fa8 0%, #6a5f9e 100%)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-green/10 blur-2xl pointer-events-none"></div>
              <div className="text-center space-y-3 z-10">
                <h3 className="text-xl font-bold font-display text-brand-green">Advocacy Initiatives</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  We are planning upcoming local fundraising walks, awareness campaigns, and policy drafts to bring McCune-Albright and other rare diseases to light.
                </p>
                <div className="inline-block px-3 py-1 bg-white/10 text-xs font-bold uppercase tracking-widest rounded-full text-brand-purple-light mt-2 animate-pulse">
                  Coming Soon
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Art */}
          <section id="art-showcase" className="scroll-mt-24 space-y-6">
            <div className="border-b border-gray-250/50 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 font-display">Art Showcase</h2>
              <p className="text-sm text-gray-500 mt-1">Celebrating our community's unique artistry and expression</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Slider Component */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-[320px] bg-brand-cream border-b border-gray-100 flex items-center justify-center p-4">
                  <img
                    src={leftSlides[leftSlideIndex].image}
                    alt={leftSlides[leftSlideIndex].title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  />
                  {/* Slider controls */}
                  <button
                    onClick={() => prevSlide('left')}
                    className="absolute left-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition"
                    aria-label="Previous Slide"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => nextSlide('left')}
                    className="absolute right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition"
                    aria-label="Next Slide"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900 font-display">
                      {leftSlides[leftSlideIndex].title}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full font-semibold">
                      {leftSlides[leftSlideIndex].artist}
                    </span>
                  </div>
                  <p className="text-xs text-gray-650 leading-relaxed">
                    {leftSlides[leftSlideIndex].desc}
                  </p>
                  <div className="flex justify-center gap-1.5 pt-4">
                    {leftSlides.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition ${
                          i === leftSlideIndex ? 'bg-brand-purple' : 'bg-gray-200'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Slider Component */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-[320px] bg-brand-cream border-b border-gray-100 flex items-center justify-center p-4">
                  <img
                    src={rightSlides[rightSlideIndex].image}
                    alt={rightSlides[rightSlideIndex].title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  />
                  {/* Slider controls */}
                  <button
                    onClick={() => prevSlide('right')}
                    className="absolute left-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition"
                    aria-label="Previous Slide"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => nextSlide('right')}
                    className="absolute right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition"
                    aria-label="Next Slide"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900 font-display">
                      {rightSlides[rightSlideIndex].title}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 bg-brand-green/10 text-brand-green rounded-full font-semibold">
                      {rightSlides[rightSlideIndex].artist}
                    </span>
                  </div>
                  <p className="text-xs text-gray-650 leading-relaxed">
                    {rightSlides[rightSlideIndex].desc}
                  </p>
                  <div className="flex justify-center gap-1.5 pt-4">
                    {rightSlides.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition ${
                          i === rightSlideIndex ? 'bg-brand-green' : 'bg-gray-200'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
