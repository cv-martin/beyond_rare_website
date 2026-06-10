'use client';

import React, { useState } from 'react';

export default function Blog() {
  const [leftSlideIndex, setLeftSlideIndex] = useState(0);
  const [rightSlideIndex, setRightSlideIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

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
      content: "McCune-Albright Syndrome (MAS) is an exceptionally rare genetic disorder that affects the bones, skin, and endocrine system. For me, living with MAS has meant navigating a maze of medical consultations, bone density scans, and the constant threat of fractures due to fibrous dysplasia. Growing up with a rare condition often means explaining your diagnosis to your peers, your teachers, and sometimes even your doctors. But beyond the physical symptoms, McCune-Albright has taught me the value of deep resilience, patient-to-patient empathy, and the critical importance of self-advocacy. By sharing my journey, I hope to light a path for others who feel isolated in their diagnosis. We are not defined by our rare genetics; we are defined by the courage and voice with which we live our lives every day.",
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
      content: "In the rare disease space, information is often the most precious commodity. When families receive a diagnosis, they frequently find a lack of clear guidance from traditional medical channels. This is where patient-led networks step in. By organizing forums, sharing personal tip sheets on managing symptoms, and compiling directories of experienced specialists, patient communities build their own systems of care. These networks do more than provide support; they drive research. By aggregating patient registries and funding seed grants, patient-led organizations are transforming the timeline of drug development. Never underestimate the power of a connected, informed community to move mountains in medicine.",
      author: "Martin Intilt",
      date: "May 28, 2026",
      readTime: "4 min read",
      category: "Community Insights",
      color: "border-brand-green text-brand-green"
    }
  ];

  const leftSlides = [
    {
      image: "/images/Neuronal Death, A Work in Progress - Mary Porter.avif",
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
      image: "/images/6.avif",
      title: '"Resiliency in Bloom"',
      artist: "Mary Porter",
      desc: "An organic representation of rare mutations branching into forms of natural growth and cellular adaptation."
    }
  ];

  const rightSlides = [
    {
      image: "/images/self.avif",
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
      image: "/images/2.avif",
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
    <div className="flex flex-col w-full overflow-hidden bg-brand-cream page-switch-enter">
      {/* SECTION 1: Hero Banner */}
      <section className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
          <div className="absolute top-12 -right-12 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto w-full text-center space-y-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-snug text-brand-purple-dark">
            Our Community
          </h1>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-brand-purple-dark/95 max-w-2xl mx-auto">
            Visit our blog and art showcase to discover more about our unique community, or explore our advocacy events.
          </p>
          <div className="w-16 h-1.5 bg-brand-purple mx-auto rounded-full mt-6"></div>
        </div>
      </section>

      {/* SECTION 2: Main Content Feed */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 md:px-12 bg-brand-green-light flex-grow overflow-hidden">
        
        {/* Dynamic Abstract Background Blobs to fill empty space */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Left Blob */}
          <div className="absolute top-[10%] -left-32 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-pulse-slow"></div>
          
          {/* Middle Right Blob */}
          <div className="absolute top-[40%] -right-32 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] mix-blend-multiply opacity-50"></div>
          
          {/* Bottom Left Blob */}
          <div className="absolute bottom-[10%] -left-48 w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-[130px] mix-blend-multiply opacity-60"></div>
          
          {/* Subtle Grid Pattern overlay */}
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Navigation Sidebar Box */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 z-20 hidden lg:block">
            <div className="glass-panel border-2 border-white/60 rounded-3xl p-6 shadow-xl shadow-brand-purple/5 space-y-6 backdrop-blur-xl bg-white/40">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-purple-dark/40">Quick Menu</h3>
                <h2 className="text-lg font-black text-brand-purple-dark font-display">Navigation</h2>
              </div>
              <nav className="flex flex-col gap-2 relative">
                {/* Decorative vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-brand-purple/10 rounded-full z-0"></div>
                
                <button
                  onClick={() => scrollToSection('blog-feed')}
                  className="relative z-10 flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-extrabold rounded-xl text-brand-purple-dark/70 hover:bg-white hover:text-brand-purple hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-lg">📝</span> Rare Insights
                </button>
                <button
                  onClick={() => scrollToSection('advocacy')}
                  className="relative z-10 flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-extrabold rounded-xl text-brand-purple-dark/70 hover:bg-white hover:text-brand-purple hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-lg">📢</span> Our Advocacy
                </button>
                <button
                  onClick={() => scrollToSection('art-showcase')}
                  className="relative z-10 flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-extrabold rounded-xl text-brand-purple-dark/70 hover:bg-white hover:text-brand-purple hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-lg">🎨</span> Art Showcase
                </button>
              </nav>
            </div>
            
            {/* Additional Decorative Sidebar Element */}
            <div className="mt-6 glass-panel border border-white/40 rounded-3xl p-6 backdrop-blur-xl bg-gradient-to-br from-brand-purple/5 to-transparent shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-purple-dark/60 mb-2">Did You Know?</h4>
              <p className="text-xs font-semibold text-brand-purple-dark/70 leading-relaxed">
                By participating in our community events, you help fund new research grants for rare disease therapies.
              </p>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9 space-y-16 lg:pl-4">
            
            {/* Section 1: Blog */}
            <section id="blog-feed" className="scroll-mt-32 space-y-6">
              <div className="glass-panel border-2 border-white/60 p-8 rounded-3xl mb-8 shadow-sm bg-white/40 backdrop-blur-xl">
                <h2 className="text-3xl font-black text-brand-purple-dark font-display flex items-center gap-3">
                  <span className="text-4xl">📝</span> Rare Insights Blog
                </h2>
                <p className="text-base font-bold text-brand-purple-dark/70 mt-2">Read the many unique stories of our community</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="glass-panel border-2 border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${post.color}`}>
                          {post.category}
                        </span>
                        <span className="text-xs font-bold text-brand-purple-dark/50">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-black text-brand-purple-dark font-display leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm font-medium text-brand-purple-dark/80 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-brand-purple/10">
                      <div>
                        <p className="text-xs font-black text-brand-purple-dark">{post.author}</p>
                        <p className="text-[10px] font-bold text-brand-purple-dark/50">{post.date}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-xs font-black px-4 py-1.5 rounded-full bg-white text-brand-purple hover:bg-brand-purple hover:text-white transition shadow-sm hover:shadow cursor-pointer"
                      >
                        Read Post →
                      </button>
                    </div>
                  </article>
                ))}

                <div className="col-span-1 md:col-span-2 glass-panel border-2 border-dashed border-brand-purple/30 p-8 rounded-2xl text-center">
                  <p className="text-sm font-bold text-brand-purple-dark/80 italic">
                    Have a personal story or insight you want to share? Once you sign up, you can post directly to our Groups Feed, and the most impactful entries will be featured in the Rare Insights Blog.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Advocacy */}
            <section id="advocacy" className="scroll-mt-32 space-y-6">
              <div className="glass-panel border-2 border-white/60 p-8 rounded-3xl mb-8 shadow-sm bg-white/40 backdrop-blur-xl">
                <h2 className="text-3xl font-black text-brand-purple-dark font-display flex items-center gap-3">
                  <span className="text-4xl">📢</span> Our Advocacy
                </h2>
                <p className="text-base font-bold text-brand-purple-dark/70 mt-2">View our community events to build connection and spread awareness</p>
              </div>

              {/* Futuristic immersive advocacy banner */}
              <div
                className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col justify-between"
                style={{
                  backgroundImage: 'url(/images/blog_advocacy_bg.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Dark cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0818]/60 via-[#1a0d35]/65 to-[#06120a]/70 pointer-events-none rounded-3xl" />

                {/* Glow accents */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-brand-purple/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-brand-green/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 p-8 md:p-12 space-y-8">
                  {/* Top eyebrow */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
                      <span className="text-xs font-extrabold uppercase tracking-widest text-white/70">Beyond Rare Advocacy</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest rounded-full text-brand-green-light animate-pulse">
                      Coming Soon
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="max-w-2xl space-y-3">
                    <h3 className="text-3xl md:text-4xl font-black font-display text-white leading-tight">
                      Advocacy Initiatives
                    </h3>
                    <p className="text-white/75 text-base font-medium leading-relaxed">
                      We are planning upcoming local fundraising walks, awareness campaigns, and policy drafts to bring McCune-Albright and other rare diseases to light.
                    </p>
                  </div>

                  {/* Initiative cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: '🚶', title: 'Fundraising Walks', desc: 'Local awareness walks across communities' },
                      { icon: '📣', title: 'Awareness Campaigns', desc: 'Digital and local media outreach programs' },
                      { icon: '📋', title: 'Policy Drafting', desc: 'Working toward better rare disease legislation' }
                    ].map(({ icon, title, desc }) => (
                      <div
                        key={title}
                        className="p-5 rounded-2xl flex flex-col gap-2"
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        <span className="text-2xl">{icon}</span>
                        <p className="font-extrabold text-white text-sm">{title}</p>
                        <p className="text-white/50 text-xs font-semibold">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Art */}
            <section id="art-showcase" className="scroll-mt-32 space-y-6">
              <div className="glass-panel border-2 border-white/60 p-8 rounded-3xl mb-8 shadow-sm bg-white/40 backdrop-blur-xl">
                <h2 className="text-3xl font-black text-brand-purple-dark font-display flex items-center gap-3">
                  <span className="text-4xl">🎨</span> Art Showcase
                </h2>
                <p className="text-base font-bold text-brand-purple-dark/70 mt-2">Celebrating our community's unique artistry and expression</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Slider Component */}
                <div className="glass-panel border-2 border-white/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-300">
                  <div className="relative h-[320px] bg-white/50 flex items-center justify-center p-4 group">
                    <img
                      src={leftSlides[leftSlideIndex].image}
                      alt={leftSlides[leftSlideIndex].title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Slider controls */}
                    <button
                      onClick={() => prevSlide('left')}
                      className="absolute left-3 p-2 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-lg transition transform hover:-translate-x-1 cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => nextSlide('left')}
                      className="absolute right-3 p-2 rounded-full bg-white/90 hover:bg-white text-brand-purple shadow-lg transition transform hover:translate-x-1 cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 space-y-2 bg-white/30 backdrop-blur-sm border-t border-white/50">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-lg text-brand-purple-dark font-display leading-tight">
                        {leftSlides[leftSlideIndex].title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-brand-purple text-white rounded-full font-black shrink-0 shadow-sm">
                        {leftSlides[leftSlideIndex].artist}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-purple-dark/80 leading-relaxed mt-2">
                      {leftSlides[leftSlideIndex].desc}
                    </p>
                    <div className="flex justify-center gap-2 pt-4">
                      {leftSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setLeftSlideIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                            i === leftSlideIndex ? 'bg-brand-purple scale-125' : 'bg-brand-purple/30 hover:bg-brand-purple/50'
                          }`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Slider Component */}
                <div className="glass-panel border-2 border-white/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-300">
                  <div className="relative h-[320px] bg-white/50 flex items-center justify-center p-4 group">
                    <img
                      src={rightSlides[rightSlideIndex].image}
                      alt={rightSlides[rightSlideIndex].title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Slider controls */}
                    <button
                      onClick={() => prevSlide('right')}
                      className="absolute left-3 p-2 rounded-full bg-white/90 hover:bg-white text-brand-green shadow-lg transition transform hover:-translate-x-1 cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => nextSlide('right')}
                      className="absolute right-3 p-2 rounded-full bg-white/90 hover:bg-white text-brand-green shadow-lg transition transform hover:translate-x-1 cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6 space-y-2 bg-white/30 backdrop-blur-sm border-t border-white/50">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-lg text-brand-purple-dark font-display leading-tight">
                        {rightSlides[rightSlideIndex].title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-brand-green text-white rounded-full font-black shrink-0 shadow-sm">
                        {rightSlides[rightSlideIndex].artist}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-purple-dark/80 leading-relaxed mt-2">
                      {rightSlides[rightSlideIndex].desc}
                    </p>
                    <div className="flex justify-center gap-2 pt-4">
                      {rightSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setRightSlideIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                            i === rightSlideIndex ? 'bg-brand-green scale-125' : 'bg-brand-green/30 hover:bg-brand-green/50'
                          }`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </section>

      {/* Blog Post Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-purple-dark/40 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-panel border-2 border-white/80 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto flex flex-col justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-brand-purple-dark shadow-md transition transform hover:scale-105 cursor-pointer font-bold text-sm w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${selectedPost.color}`}>
                  {selectedPost.category}
                </span>
                <span className="text-xs font-bold text-brand-purple-dark/50">{selectedPost.readTime}</span>
              </div>
              <h2 className="text-2xl font-black text-brand-purple-dark font-display leading-snug">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-3 py-2 border-y border-brand-purple/10">
                <div>
                  <p className="text-xs font-black text-brand-purple-dark">Written by {selectedPost.author}</p>
                  <p className="text-[10px] font-bold text-brand-purple-dark/50">Published on {selectedPost.date}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line pt-2">
                {selectedPost.content}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-brand-purple/10 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-full text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
