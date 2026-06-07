'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    if (authMode === 'login') {
      login(email, name);
    } else {
      register(email, name);
    }
    setEmail('');
    setName('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 glass-panel rounded-2xl shadow-2xl border border-white/40 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-brand-green/10 mb-2">
            <img src="/beyond_rare_website/images/logo.avif" alt="Beyond Rare Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            {authMode === 'login' ? 'Welcome Back' : 'Join Beyond Rare'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {authMode === 'login' ? 'Connect with our rare disease community' : 'Become a member and share your story'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aashriya Vasamsetti"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="beyondrare25@gmail.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            {authMode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative px-3 bg-[#fafaf9] text-xs text-gray-500 uppercase">Or connect with</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => login('google-user@gmail.com', 'Google Explorer')}
            className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-55 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 1 1 12 5.6c1.47 0 2.8.5 3.84 1.45l2.97-2.97A9.95 9.95 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10 0-.6-.05-1.18-.16-1.715H12.24Z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          <button
            onClick={() => login('fb-user@gmail.com', 'Facebook Member')}
            className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-55 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {authMode === 'login' ? (
            <p className="text-gray-600">
              New to Beyond Rare?{' '}
              <button onClick={() => setAuthMode('signup')} className="font-semibold text-brand-purple hover:underline">
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="font-semibold text-brand-purple hover:underline">
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
