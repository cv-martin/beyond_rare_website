'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setIsAuthModalOpen, setAuthMode, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Your Story', path: '/your-story', icon: '💬' },
    { name: 'Rare Diseases', path: '/rare-diseases', icon: '🔬' },
    { name: 'Our Community', path: '/blog', icon: '💜' },
  ];

  return (
    <>
      <style>{`
        .header-root {
          background: linear-gradient(135deg,
            #1a0f2e 0%,
            #2d1b5e 25%,
            #3d2875 50%,
            #2a1f5a 75%,
            #1a0f2e 100%
          );
          transition: box-shadow 0.35s ease, backdrop-filter 0.35s ease;
        }
        .header-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 15% 50%, rgba(139, 127, 184, 0.22) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 85% 40%, rgba(74, 107, 80, 0.18) 0%, transparent 65%),
            radial-gradient(ellipse 50% 100% at 50% 0%, rgba(180, 160, 220, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .header-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(139, 127, 184, 0.5) 20%,
            rgba(255,255,255,0.25) 50%,
            rgba(74, 107, 80, 0.4) 80%,
            transparent 100%
          );
        }
        /* Scroll state: blur glass + deep shadow */
        .header-scrolled {
          backdrop-filter: blur(22px) saturate(2);
          -webkit-backdrop-filter: blur(22px) saturate(2);
          background: linear-gradient(135deg,
            rgba(20, 10, 38, 0.96) 0%,
            rgba(40, 22, 80, 0.95) 40%,
            rgba(36, 26, 72, 0.96) 100%
          ) !important;
          box-shadow:
            0 2px 0 rgba(139, 127, 184, 0.3),
            0 8px 40px rgba(10, 6, 28, 0.65),
            0 0 0 1px rgba(255,255,255,0.05);
        }

        /* Logo glow ring */
        .logo-ring {
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(232, 227, 245, 0.85));
          box-shadow:
            0 0 0 2px rgba(139, 127, 184, 0.5),
            0 0 16px rgba(139, 127, 184, 0.4),
            0 0 32px rgba(139, 127, 184, 0.15),
            inset 0 1px 2px rgba(255,255,255,0.8);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .logo-ring:hover {
          box-shadow:
            0 0 0 2px rgba(139, 127, 184, 0.8),
            0 0 24px rgba(139, 127, 184, 0.6),
            0 0 48px rgba(139, 127, 184, 0.25),
            inset 0 1px 2px rgba(255,255,255,0.9);
        }

        /* Brand name shimmer */
        .brand-name {
          background: linear-gradient(135deg,
            #d4c9f0 0%,
            #ffffff 30%,
            #b8e8c0 60%,
            #ffffff 80%,
            #d4c9f0 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: brand-shimmer 4s linear infinite;
        }
        @keyframes brand-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Nav active pill */
        .nav-link-active {
          background: rgba(255, 255, 255, 0.12);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.2),
            inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 25%;
          right: 25%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #b8e8c0, transparent);
          border-radius: 2px;
        }

        /* Search frosted glass */
        .search-glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
        }
        .search-glass:focus {
          background: rgba(255,255,255,0.96);
          border-color: rgba(139, 127, 184, 0.6);
          box-shadow: 0 0 0 3px rgba(139, 127, 184, 0.2), 0 2px 8px rgba(0,0,0,0.1);
          color: #1a0f2e;
        }
        .search-glass::placeholder { color: rgba(255,255,255,0.38); }
        .search-glass:focus::placeholder { color: #9ca3af; }

        /* Join Community CTA */
        .cta-join {
          background: linear-gradient(135deg, #4a6b50 0%, #3a8d50 50%, #4a6b50 100%);
          background-size: 200% auto;
          box-shadow:
            0 2px 12px rgba(74, 107, 80, 0.45),
            0 0 0 1px rgba(255,255,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.25s ease;
        }
        .cta-join:hover {
          background-position: right center;
          box-shadow:
            0 4px 20px rgba(74, 107, 80, 0.6),
            0 0 0 1px rgba(255,255,255,0.2),
            inset 0 1px 0 rgba(255,255,255,0.25);
          transform: translateY(-1px);
        }

        /* User avatar glow */
        .user-avatar-ring {
          box-shadow: 0 0 0 2px rgba(255,255,255,0.3), 0 0 12px rgba(139,127,184,0.4);
          transition: all 0.2s ease;
        }
        .user-avatar-ring:hover {
          box-shadow: 0 0 0 2px rgba(255,255,255,0.7), 0 0 20px rgba(139,127,184,0.7);
        }

        /* Mobile menu */
        .mobile-menu-bg {
          background: linear-gradient(170deg, #1e1040 0%, #2d1b5e 60%, #1a2a1e 100%);
          border-top: 1px solid rgba(139, 127, 184, 0.25);
        }
      `}</style>

      <header className={`header-root sticky top-0 z-40 w-full ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">

            {/* ── Logo & Brand ── */}
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <div className="logo-ring relative w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/logo.avif"
                  alt="Beyond Rare logo"
                  className="w-[85%] h-[85%] object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col leading-none gap-1">
                <span className="brand-name text-3xl md:text-4xl font-black tracking-wide font-display">
                  Beyond Rare
                </span>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-white/45 hidden sm:block">
                  Rare Disease Community
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav + Controls ── */}
            <div className="hidden md:flex items-center gap-5 lg:gap-6">

              {/* Navigation */}
              <nav className="flex items-center gap-0.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative px-4 py-2.5 text-[15px] font-bold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'nav-link-active text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="h-8 w-px bg-white/15" />

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-40 lg:w-52">
                <input
                  id="search-input-desktop"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="search-glass w-full pl-9 pr-4 py-2 text-sm rounded-full text-white outline-none"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>

              {/* Auth Controls */}
              {user ? (
                <div className="flex items-center gap-2.5 relative">
                  {/* Notification Bell */}
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
                    aria-label="Notifications"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>

                  {/* User Dropdown Trigger */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none group relative z-50"
                  >
                    <div className="user-avatar-ring w-8 h-8 rounded-full p-px shrink-0 bg-white/10">
                      <img
                        src={user.avatar || '/images/logo.avif'}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-white/75 group-hover:text-white transition hidden lg:inline max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-white/50 group-hover:text-white transition duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsUserMenuOpen(false)} />
                      <div
                        className="absolute right-0 top-12 z-50 w-60 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.97)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(139, 127, 184, 0.2)',
                          boxShadow: '0 20px 60px rgba(15, 10, 40, 0.35), 0 0 0 1px rgba(139,127,184,0.1)',
                        }}
                      >
                        {/* User Header */}
                        <div className="px-4 py-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #f0ebfa 0%, #e8f5ea 100%)' }}>
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md shrink-0 overflow-hidden">
                            <img src={user.avatar || '/images/logo.avif'} alt={user.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#1a0f2e] truncate leading-snug">{user.name}</p>
                            <p className="text-[10px] font-semibold text-[#6a5f9e]/70 truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="p-2 space-y-0.5">
                          <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#2d1b5e] hover:bg-[#f0ebfa] rounded-xl transition group">
                            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#e8e3f5] text-sm group-hover:bg-[#d4c9f0] transition">👤</span>
                            View Profile
                          </Link>
                          <Link href="/your-story" onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#2d1b5e] hover:bg-[#f0ebfa] rounded-xl transition group">
                            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#e8e3f5] text-sm group-hover:bg-[#d4c9f0] transition">💬</span>
                            Forums & Feed
                          </Link>
                        </div>

                        {/* Log Out */}
                        <div className="px-2 pb-2 border-t border-gray-100 pt-1.5">
                          <button
                            onClick={() => { logout(); setIsUserMenuOpen(false); }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition group"
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 text-sm group-hover:bg-red-100 transition">🚪</span>
                            Log Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="cta-join px-7 py-2.5 text-sm font-extrabold text-white rounded-full"
                >
                  Join Community
                </button>
              )}
            </div>

            {/* ── Mobile Toggle ── */}
            <div className="flex md:hidden items-center gap-3">
              {user && (
                <Link href="/profile" className="user-avatar-ring w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/10">
                  <img src={user.avatar || '/images/logo.avif'} alt={user.name} className="w-full h-full object-cover" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-bg md:hidden px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white/12 text-white border border-white/15'
                        : 'text-white/65 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="search-input-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Beyond Rare..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/15 bg-white/10 text-white placeholder-white/35 outline-none transition"
              />
              <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Mobile Auth */}
            {user ? (
              <div className="flex flex-col gap-1 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                  <div className="w-10 h-10 rounded-full border border-white/30 overflow-hidden shrink-0 bg-white/10">
                    <img src={user.avatar || '/images/logo.avif'} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{user.name}</p>
                    <p className="text-[10px] font-semibold text-white/50 truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white transition flex items-center gap-3">
                  <span>👤</span> My Profile
                </Link>
                <Link href="/your-story" onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white transition flex items-center gap-3">
                  <span>💬</span> Forums & Feed
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="mt-1 px-3 py-2.5 rounded-xl text-sm font-extrabold text-red-300 hover:bg-red-950/30 transition flex items-center gap-3 border border-red-500/20"
                >
                  <span>🚪</span> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 px-4 text-center text-sm font-bold text-white/80 border border-white/15 hover:bg-white/10 rounded-xl transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="cta-join flex-1 py-2.5 px-4 text-center text-sm font-extrabold text-white rounded-xl"
                >
                  Join Community
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
