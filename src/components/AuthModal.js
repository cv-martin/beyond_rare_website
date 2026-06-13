'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/utils/supabaseClient';
import {
  trackLoginStarted,
  trackLoginSucceeded,
  trackSignupStarted,
  trackSignupCompleted
} from '@/utils/monitoring';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Supporter');
  const [error, setError] = useState('');

  const isSupabaseActiveVal = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key-here';

  const handleGoogleLogin = async () => {
    setError('');
    // Clear credentials states immediately so browser password manager does not auto-save them on redirect page unload
    setEmail('');
    setName('');
    setPassword('');
    if (isSupabaseActiveVal) {
      try {
        const redirectTo = typeof window !== 'undefined' ? window.location.href : '';
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectTo
          }
        });
        if (oauthError) {
          setError(oauthError.message);
        }
      } catch (err) {
        setError(err.message || 'Google OAuth failed to initialize.');
      }
    } else {
      setError('Supabase is not configured. Google OAuth is unavailable.');
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    // Clear credentials states immediately so browser password manager does not auto-save them on redirect page unload
    setEmail('');
    setName('');
    setPassword('');
    if (isSupabaseActiveVal) {
      try {
        const redirectTo = typeof window !== 'undefined' ? window.location.href : '';
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: redirectTo
          }
        });
        if (oauthError) {
          setError(oauthError.message);
        }
      } catch (err) {
        setError(err.message || 'Facebook OAuth failed to initialize.');
      }
    } else {
      setError('Supabase is not configured. Facebook OAuth is unavailable.');
    }
  };

  // Clear modal fields and error states on close/open
  useEffect(() => {
    if (!isAuthModalOpen) {
      setEmail('');
      setName('');
      setPassword('');
      setRole('Supporter');
      setError('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseActiveVal) {
      setError('Supabase is not configured. Database connection is offline.');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (authMode === 'login') {
      trackLoginStarted('credentials');
    } else {
      trackSignupStarted('credentials');
    }

    let result;
    if (authMode === 'login') {
      result = await login(email, password);
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      result = await register(email, name, password, role);
    }

    if (result && !result.success) {
      setError(result.error);
    } else {
      if (authMode === 'login') {
        trackLoginSucceeded('credentials');
      } else {
        trackSignupCompleted('credentials');
      }
      // Clear fields upon success
      setEmail('');
      setName('');
      setPassword('');
      setRole('Supporter');
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 glass-panel rounded-2xl shadow-2xl border border-white/40 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-brand-green/10 mb-2">
            <img src="/images/logo.avif" alt="Beyond Rare Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            {authMode === 'login' ? 'Welcome Back' : 'Join Beyond Rare'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {authMode === 'login' ? 'Connect with our rare disease community' : 'Become a member and share your story'}
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  autoComplete="name"
                  data-clarity-mask="true"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aashriya Vasamsetti"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Rare Disease Connection</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-700"
                >
                  <option value="Patient">Rare Disease Patient</option>
                  <option value="Caregiver">Caregiver / Ally</option>
                  <option value="Advocate">Advocate</option>
                  <option value="Medical Professional">Medical Professional</option>
                  <option value="Supporter">General Supporter</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              name="email"
              autoComplete="email"
              data-clarity-mask="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="beyondrare25@gmail.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              name="password"
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              data-clarity-mask="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/70 focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition text-sm text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 text-sm"
          >
            {authMode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative px-3 bg-[#fafaf9] text-xs text-gray-500 uppercase font-semibold">Or connect with</span>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-55 transition shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 1 1 12 5.6c1.47 0 2.8.5 3.84 1.45l2.97-2.97A9.95 9.95 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10 0-.6-.05-1.18-.16-1.715H12.24Z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 font-sans">Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-55 transition shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Facebook</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {authMode === 'login' ? (
            <p className="text-gray-600">
              New to Beyond Rare?{' '}
              <button type="button" onClick={() => setAuthMode('signup')} className="font-semibold text-brand-purple hover:underline">
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button type="button" onClick={() => setAuthMode('login')} className="font-semibold text-brand-purple hover:underline">
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
