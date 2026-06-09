'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  trackLoginStarted,
  trackLoginSucceeded,
  trackSignupStarted,
  trackSignupCompleted
} from '@/utils/monitoring';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register, updateProfile } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Supporter');
  const [error, setError] = useState('');

  // Mock Google Login Form States
  const [showGoogleMock, setShowGoogleMock] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleError, setGoogleError] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasRealClientId = clientId && clientId !== 'your-google-client-id.apps.googleusercontent.com';

  // Helper to decode Google JWT credentials on client side
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return {};
    }
  };

  const handleCredentialResponse = (response) => {
    try {
      setError('');
      const responsePayload = decodeJwt(response.credential);
      const oauthEmail = responsePayload.email;
      const oauthName = responsePayload.name;
      const oauthAvatar = responsePayload.picture;

      if (!oauthEmail) {
        setError('Could not retrieve email from Google Account.');
        return;
      }

      trackLoginStarted('google_onetap');
      const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
      const exists = storedUsers.some(u => u.email.toLowerCase() === oauthEmail.toLowerCase());
      if (!exists) {
        trackSignupStarted('google_onetap');
      }

      // Try logging in (bypass standard password authentication for verified OAuth flows)
      let result = login(oauthEmail, 'google-oauth-password-bypass');
      if (result && !result.success) {
        // Automatically register new Google users
        result = register(oauthEmail, oauthName || oauthEmail.split('@')[0], 'google-oauth-password-bypass', 'Supporter');
      }

      if (result && !result.success) {
        setError(result.error);
      } else {
        if (!exists) {
          trackSignupCompleted('google_onetap');
        }
        trackLoginSucceeded('google_onetap');
        // Sync custom details like profile avatar from Google account
        if (oauthAvatar) {
          updateProfile({ name: oauthName || oauthEmail.split('@')[0], avatar: oauthAvatar });
        }
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      setError('Google Sign-In failed to decode login credentials.');
    }
  };

  // Initialize and Render Real Google Login Button if Client ID exists
  useEffect(() => {
    /* global google */
    if (typeof window !== 'undefined' && hasRealClientId && isAuthModalOpen) {
      const initGsi = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
          });
          
          const targetBtn = document.getElementById("google-signin-btn");
          if (targetBtn) {
            window.google.accounts.id.renderButton(
              targetBtn,
              { theme: "outline", size: "large", width: 180, shape: "rectangular" }
            );
          }
        }
      };

      if (window.google) {
        initGsi();
      } else {
        const interval = setInterval(() => {
          if (window.google) {
            initGsi();
            clearInterval(interval);
          }
        }, 150);
        return () => clearInterval(interval);
      }
    }
  }, [isAuthModalOpen, hasRealClientId]);

  // Clear modal fields and error states on close/open
  useEffect(() => {
    if (!isAuthModalOpen) {
      setEmail('');
      setName('');
      setPassword('');
      setRole('Supporter');
      setError('');
      setShowGoogleMock(false);
      setGoogleEmail('');
      setGoogleName('');
      setGoogleError('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

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
      result = login(email, password);
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      result = register(email, name, password, role);
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

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    setGoogleError('');

    if (!googleEmail.trim()) {
      setGoogleError('Email is required.');
      return;
    }

    const trimmedEmail = googleEmail.trim();
    const displayName = googleName.trim() || trimmedEmail.split('@')[0];

    trackLoginStarted('google_mock');
    const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
    const exists = storedUsers.some(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (!exists) {
      trackSignupStarted('google_mock');
    }

    // Attempt login with a standard mock bypass password for OAuth mock accounts
    let result = login(trimmedEmail, 'google-oauth-password-bypass');
    if (result && !result.success) {
      // If user registry doesn't contain this email yet, auto-register them
      result = register(trimmedEmail, displayName, 'google-oauth-password-bypass', 'Supporter');
    }

    if (result && !result.success) {
      setGoogleError(result.error);
    } else {
      if (!exists) {
        trackSignupCompleted('google_mock');
      }
      trackLoginSucceeded('google_mock');
      // Clean states and close modals
      setShowGoogleMock(false);
      setGoogleEmail('');
      setGoogleName('');
      setGoogleError('');
    }
  };

  const handleOAuthFacebookLogin = (oauthEmail, oauthName) => {
    setError('');
    trackLoginStarted('facebook');
    const storedUsers = JSON.parse(localStorage.getItem('br_registered_users') || '[]');
    const exists = storedUsers.some(u => u.email.toLowerCase() === oauthEmail.toLowerCase());
    if (!exists) {
      trackSignupStarted('facebook');
    }

    // Try to login with oauth mock password bypass
    let result = login(oauthEmail, 'oauth-bypass-pass');
    if (result && !result.success) {
      // If user doesn't exist yet in local storage registry, register them
      result = register(oauthEmail, oauthName, 'oauth-bypass-pass', 'Supporter');
    }

    if (result && !result.success) {
      setError(result.error);
    } else {
      if (!exists) {
        trackSignupCompleted('facebook');
      }
      trackLoginSucceeded('facebook');
    }
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
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {hasRealClientId ? (
            <div id="google-signin-btn" className="flex justify-center items-center h-[40px] w-full bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition overflow-hidden" />
          ) : (
            <button
              onClick={() => setShowGoogleMock(true)}
              className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 1 1 12 5.6c1.47 0 2.8.5 3.84 1.45l2.97-2.97A9.95 9.95 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10 0-.6-.05-1.18-.16-1.715H12.24Z"/>
              </svg>
              <span className="text-sm font-semibold text-gray-700 font-sans">Google</span>
            </button>
          )}

          <button
            onClick={() => handleOAuthFacebookLogin('fb-user@gmail.com', 'Facebook Member')}
            className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-55 transition shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700">Facebook</span>
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

      {/* Google Mock Login Dialogue Screen Overlay */}
      {showGoogleMock && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-150 p-7 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {/* Google G Logo */}
            <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>

            <h2 className="text-xl font-bold text-gray-900 font-sans">Sign in</h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">to continue to Beyond Rare</p>

            {googleError && (
              <div className="w-full mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold rounded-lg flex items-center gap-1.5 animate-in shake duration-200">
                <span>⚠️ {googleError}</span>
              </div>
            )}

            <form onSubmit={handleGoogleSubmit} className="w-full space-y-3.5">
              <div>
                <input
                  type="email"
                  required
                  data-clarity-mask="true"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="Email or phone (e.g. name@gmail.com)"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs text-gray-800 transition font-medium bg-white"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  data-clarity-mask="true"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Full name (e.g. Jane Doe)"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs text-gray-800 transition font-medium bg-white"
                />
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleMock(false);
                    setGoogleEmail('');
                    setGoogleName('');
                    setGoogleError('');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-750 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
