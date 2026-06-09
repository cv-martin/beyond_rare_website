'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

/* Scroll-reveal wrapper — adds .visible when element enters viewport */
function StoryReveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function Home() {
  const { setIsAuthModalOpen, setAuthMode, user } = useApp();

  const handleJoinClick = () => {
    if (!user) {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const scrollToMission = () => {
    const el = document.getElementById('mission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-brand-cream">
      {/* SECTION 1: Hero Banner */}
      <section
        className="relative w-full bg-brand-cream px-6 md:px-12 lg:px-24 xl:px-32 pt-20 pb-20"
        style={{
          backgroundImage: 'url(/images/5.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-5xl mx-auto w-full space-y-3 md:space-y-4">
          {/* Left Aligned Heading Row (NIH statement) */}
          <div className="max-w-xl md:max-w-2xl text-left">
            <h1 className="text-xl md:text-2xl lg:text-[32px] xl:text-[38px] font-extrabold font-display leading-snug text-brand-purple-dark drop-shadow-[0_1px_2px_rgba(106,95,158,0.15)]">
              According to the NIH, about 25 to 30 million people in the us alone live with rare diseases.
            </h1>
          </div>

          {/* Right Aligned Heading Row (1 in 10 statement) */}
          <div className="max-w-xl md:max-w-2xl text-right ml-auto">
            <h2 className="text-xl md:text-2xl lg:text-[32px] xl:text-[38px] font-extrabold font-display leading-snug text-brand-purple-dark drop-shadow-[0_1px_2px_rgba(106,95,158,0.15)]">
              That&apos;s nearly 1 in 10 individuals – yet each one of these unique voices feels isolated and unheard.
            </h2>
          </div>

          {/* Left Aligned Description Text */}
          <div className="max-w-lg md:max-w-xl text-left pl-4 md:pl-12 lg:pl-16">
            <p className="text-sm md:text-base lg:text-lg font-bold leading-relaxed text-brand-purple-dark/95">
              Beyond Rare empowers people through connection, advocacy, and support, or as we like to say...
            </p>
          </div>

          {/* Cursive Phrase */}
          <div className="max-w-lg md:max-w-xl text-right ml-auto pr-6 md:pr-16 lg:pr-24">
            <p className="text-xl md:text-2xl lg:text-[32px] xl:text-[38px] font-handwritten text-brand-purple-dark select-none italic">
              connecting rare strands--one voice at a time
            </p>
          </div>

          {/* Learn More Button */}
          <div className="flex justify-center pt-1">
            <button
              onClick={scrollToMission}
              data-cta="learn_more"
              className="px-14 py-3.5 text-base font-extrabold text-brand-green-dark bg-brand-green-light hover:bg-brand-green-light/90 border border-brand-green/15 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Our Mission */}
      <section
        id="mission"
        className="relative pt-10 pb-6 px-6 md:px-12 scroll-mt-20 overflow-hidden bg-brand-green-light"
        style={{
          backgroundImage: 'url(/images/4.avif)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-purple-dark drop-shadow-[0_1px_2px_rgba(106,95,158,0.12)]">Our Mission</h2>
            <p className="text-sm font-semibold tracking-widest uppercase text-brand-purple-dark/70">
              empowering people through connection, advocacy, and meaning
            </p>
          </div>

          {/* 2x2 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl mx-auto pt-2">
            {/* Forum Pillar */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-brand-green shrink-0">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark font-display">
                Personalized patient forums
              </h3>
              <p className="text-xs text-brand-green-dark/90 leading-relaxed max-w-sm">
                With our unique, personalized forums, patients can finally voice their distinct experiences.
              </p>
            </div>

            {/* Glossary/Directory Pillar */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-brand-green shrink-0">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark font-display">
                Educational rare disease directory and news center
              </h3>
              <p className="text-xs text-brand-green-dark/90 leading-relaxed max-w-sm">
                With over 7,000 known rare diseases in the US alone, finding the latest information can be difficult sometimes. Our website&apos;s easy access to the most up to date resources ensures your search for information is quick and simple.
              </p>
            </div>

            {/* Peer Support Pillar */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-brand-green shrink-0">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark font-display">
                Peer support programs
              </h3>
              <p className="text-xs text-brand-green-dark/90 leading-relaxed max-w-sm">
                Having a rare disease can feel stressful and isolating at times. Our peer support programs are specifically designed to alleviate patient stress and create a stronger community.
              </p>
            </div>

            {/* Advocacy Pillar */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-brand-green shrink-0">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-green-dark font-display">
                Distinct advocacy, fundraising, and policy initiatives
              </h3>
              <p className="text-xs text-brand-green-dark/90 leading-relaxed max-w-sm">
                Designed by one rare disease patient for another, our special advocacies are tailored to bring our community&apos;s real experiences to light and design a better world for all.
              </p>
            </div>
          </div>

          {/* Connect Now Button */}
          <div className="text-center pt-3">
            <Link
              href="/your-story"
              data-cta="connect_now"
              className="inline-block px-12 py-3 text-sm font-bold text-white bg-brand-green hover:bg-brand-green-dark rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Connect Now
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Our Story — Futuristic Immersive Redesign */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/home_story_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-dark/85 via-[#2a1f4a]/80 to-brand-green-dark/70 pointer-events-none" />

        {/* Animated floating glow orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-purple/20 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-brand-green/15 blur-3xl pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          {/* Left Column — Identity & Title */}
          <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center select-none border-b md:border-b-0 md:border-r border-white/10">
            <StoryReveal className="story-reveal">
              {/* Shimmer title */}
              <h2 className="story-heading-shimmer text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-widest uppercase leading-tight mb-8">
                Our<br />Story
              </h2>
            </StoryReveal>

            <StoryReveal className="story-reveal story-reveal-delay-1">
              {/* Glowing avatar ring */}
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden bg-white shrink-0 story-logo-ring"
                style={{ boxShadow: '0 0 30px rgba(139,127,184,0.5), 0 0 70px rgba(139,127,184,0.2)' }}
              >
                <img
                  src="/images/logo.avif"
                  alt="Aashriya Vasamsetti — Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </StoryReveal>

            <StoryReveal className="story-reveal story-reveal-delay-2">
              <div className="mt-6 space-y-1">
                <p className="text-white/90 font-extrabold text-sm tracking-wide">Aashriya Vasamsetti</p>
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest">Founder, Beyond Rare</p>
              </div>
              {/* Decorative DNA line */}
              <div className="mt-6 flex items-center gap-1 justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-white/30"
                    style={{
                      width: i % 2 === 0 ? '6px' : '3px',
                      height: i % 2 === 0 ? '20px' : '10px',
                      opacity: 0.4 + (i * 0.07)
                    }}
                  />
                ))}
              </div>
            </StoryReveal>
          </div>

          {/* Right Column — Quote */}
          <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
            <div className="w-full max-w-xl space-y-6">
              <StoryReveal className="story-reveal story-reveal-delay-1">
                {/* Glassmorphic frosted quote panel */}
                <div
                  className="relative p-7 md:p-8 rounded-3xl"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Large decorative quote */}
                  <span
                    className="absolute -top-4 left-6 text-8xl leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(139,127,184,0.3)', fontFamily: 'Georgia, serif' }}
                  >&ldquo;</span>

                  <p className="relative z-10 text-sm md:text-base text-white/90 leading-relaxed font-medium pt-4">
                    Since the young age of three, I&apos;ve been suffering from the rare, genetic mutation of McCune-Albright Syndrome. Throughout various surgeries and injuries, I constantly felt isolated and unseen, wishing I could find people who could share the same pain. Though I felt alone, I wanted to ensure no one else would ever have to feel that way, making it my life&apos;s goal to help alleviate the hurt for those similar to me as much as possible. Beyond Rare is a tool to make sure you or your loved ones with a rare disease feel more supported, represented, and seen, not just a website.
                  </p>

                  <span
                    className="absolute -bottom-8 right-6 text-8xl leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(74,107,80,0.3)', fontFamily: 'Georgia, serif' }}
                  >&rdquo;</span>
                </div>
              </StoryReveal>

              {/* Divider */}
              <StoryReveal className="story-reveal story-reveal-delay-2">
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </StoryReveal>

              <StoryReveal className="story-reveal story-reveal-delay-3">
                <div className="space-y-2 pl-4 border-l-2 border-brand-purple/60">
                  <p className="text-white/80 text-sm md:text-base font-bold leading-relaxed italic">
                    Every rare strand, each uncommon gene, and every unique story has meaning.
                    Bonded by special lives, let&apos;s raise our voices together.
                  </p>
                  {/* Glowing badge */}
                  <span className="inline-block mt-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full text-brand-green-light border border-brand-green/40 bg-brand-green/10">
                    ✦ Beyond Rare
                  </span>
                </div>
              </StoryReveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Connect Now Section */}
      <section className="relative py-16 px-6 md:px-12 bg-brand-green-light overflow-hidden flex items-center justify-center text-center">
        {/* Giant CONNECT NOW watermark */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.12]">
          <span className="text-[14vw] font-black tracking-widest text-brand-green-dark leading-none" style={{ textShadow: '0 2px 8px rgba(50, 74, 55, 0.08)' }}>
            CONNECT NOW
          </span>
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <p className="text-sm md:text-base text-brand-green-dark font-semibold leading-relaxed">
            Further our patient support by becoming a free member today. Whether you&apos;re a rare disease individual seeking connection, a family member or friend looking out for your loved ones, or just a curious individual trying to help our cause - all of our members are greatly appreciated.
          </p>

          <div>
            {user ? (
              <Link
                href="/your-story"
                data-cta="go_to_groups"
                className="inline-block px-12 py-3 text-sm font-extrabold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Go to Groups Feed
              </Link>
            ) : (
              <button
                onClick={handleJoinClick}
                data-cta="join_now"
                className="px-12 py-3 text-sm font-extrabold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Join Now
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
