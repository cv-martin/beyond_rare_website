'use client';

import React, { useState } from 'react';
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Your story', path: '/your-story' },
    { name: 'Rare Diseases', path: '/rare-diseases' },
    { name: 'Our Community', path: '/blog' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg" style={{ background: 'linear-gradient(135deg, #7b6fa8 0%, #6a5f9e 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-16 h-16 flex items-center justify-center p-0.5 bg-white rounded-full shadow-inner group-hover:scale-105 transition duration-200">
              <img src="/images/logo.avif" alt="Beyond Rare logo" className="w-[85%] h-[85%] object-contain" />
            </div>
            <span className="text-3xl md:text-4xl font-black tracking-wide text-brand-green-light font-display group-hover:text-white transition duration-200">
              Beyond Rare
            </span>
          </Link>

          {/* Desktop Nav and Search */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            <nav className="flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-base font-semibold transition duration-150 relative py-2 ${
                      isActive
                        ? 'text-white border-b-2 border-white'
                        : 'text-brand-cream hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-40 lg:w-48">
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 text-xs rounded-full border border-white/20 bg-white/20 text-white placeholder-brand-cream/80 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 outline-none transition"
              />
              <svg
                className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-brand-cream/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center gap-3 relative">
                {/* Notification Bell */}
                <button className="text-brand-cream hover:text-white transition mr-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User Dropdown Trigger */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group relative z-50"
                >
                  <div className="w-9 h-9 rounded-full border-2 border-white/60 p-0.5 shrink-0 bg-white hover:scale-105 transition duration-200 shadow-md">
                    <img
                      src={user.avatar || '/images/logo.avif'}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-brand-cream group-hover:text-white transition hidden lg:inline max-w-[110px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-brand-cream group-hover:text-white transition duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl glass-panel border border-white/50 shadow-2xl p-2.5 animate-in fade-in slide-in-from-top-3 duration-250">
                      {/* User Header */}
                      <div className="px-3.5 py-3 border-b border-brand-purple/15">
                        <p className="text-sm font-black text-brand-purple-dark truncate leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] font-bold text-brand-purple-dark/60 truncate leading-none">{user.email}</p>
                      </div>
                      
                      {/* Menu Links */}
                      <div className="py-2.5 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-brand-purple-dark hover:bg-brand-purple/10 rounded-xl transition"
                        >
                          👤 View Profile
                        </Link>
                        <Link
                          href="/your-story"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-brand-purple-dark hover:bg-brand-purple/10 rounded-xl transition"
                        >
                          👥 Forums & Feed
                        </Link>
                      </div>

                      {/* Log Out */}
                      <div className="pt-2 border-t border-brand-purple/15">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-extrabold text-red-650 hover:bg-red-50 rounded-xl transition"
                        >
                          🚪 Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 text-xs font-bold text-brand-purple bg-brand-cream hover:bg-white rounded-full shadow transition"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-4">
            {user && (
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full border border-white/40 p-0.5 shrink-0 bg-white shadow-md"
              >
                <img
                  src={user.avatar || '/images/logo.avif'}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-brand-cream hover:bg-white/10 transition focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/15 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-5 duration-200" style={{ background: 'linear-gradient(135deg, #7b6fa8 0%, #6a5f9e 100%)' }}>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-semibold transition ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-brand-cream hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Search bar inside Mobile Menu */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-white/20 bg-white/20 text-white placeholder-brand-cream/80 outline-none transition"
            />
            <svg
              className="absolute left-3.5 top-3 w-4 h-4 text-brand-cream/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          {/* Auth Button in Mobile Menu */}
          {user ? (
            <div className="flex flex-col gap-2 pt-2.5 border-t border-white/15">
              <div className="flex items-center gap-3 px-3 py-1.5">
                <div className="w-10 h-10 rounded-full border-2 border-white/60 p-0.5 shrink-0 bg-white shadow-md">
                  <img
                    src={user.avatar || '/images/logo.avif'}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] font-bold text-brand-cream/70 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1 mt-1">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-brand-cream hover:bg-white/10 hover:text-white transition"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/your-story"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-brand-cream hover:bg-white/10 hover:text-white transition"
                >
                  👥 Forums & Feed
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-extrabold text-red-200 hover:bg-red-950/20 transition mt-2 border border-red-500/25"
                >
                  🚪 Log Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-brand-purple bg-brand-cream hover:bg-white rounded-lg shadow transition"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
