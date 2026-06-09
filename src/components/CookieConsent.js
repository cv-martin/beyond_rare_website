'use client';

import React, { useState, useEffect } from 'react';
import { getConsent, setConsent } from '@/utils/monitoring';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [errorConsent, setErrorConsent] = useState(true);

  useEffect(() => {
    // Check if consent has already been given/set
    const consent = getConsent();
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentObj = { analytics: true, errorTracking: true };
    setConsent(consentObj);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consentObj = { analytics: false, errorTracking: false };
    setConsent(consentObj);
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    const consentObj = { analytics: analyticsConsent, errorTracking: errorConsent };
    setConsent(consentObj);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel p-6 rounded-3xl border border-white/50 shadow-2xl bg-white/95 backdrop-blur-md space-y-4">
        {!showCustomize ? (
          <>
            <div className="space-y-2">
              <h4 className="text-base font-black text-brand-purple-dark font-display flex items-center gap-2">
                <span>🍪</span> Privacy Settings
              </h4>
              <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                We use cookies and monitoring tools like Google Analytics 4, Microsoft Clarity, and Sentry to improve your experience, measure performance, and keep our community safe.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-xs shadow-sm transition cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="py-2 px-4 bg-brand-cream/60 hover:bg-brand-cream text-brand-purple-dark font-bold rounded-full text-xs transition cursor-pointer"
              >
                Customize
              </button>
              <button
                onClick={handleRejectAll}
                className="py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-bold rounded-full text-xs transition cursor-pointer"
              >
                Reject
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h4 className="text-base font-black text-brand-purple-dark font-display border-b border-brand-purple/10 pb-2">
              Customize Preferences
            </h4>
            
            <div className="space-y-3">
              {/* Essential & Errors */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-brand-cream/30 border border-brand-purple/5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Error Tracking (Sentry)</p>
                  <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                    Helps us catch JavaScript errors, failed API requests, and debug runtime crashes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={errorConsent}
                  onChange={(e) => setErrorConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-gray-300 mt-1 cursor-pointer"
                />
              </div>

              {/* Analytics & Behavior */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-brand-cream/30 border border-brand-purple/5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Analytics & Session Replay</p>
                  <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                    Tracks page views, clicks, heatmaps, and rage/dead clicks (GA4, Clarity).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-gray-300 mt-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-full text-xs transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold rounded-full text-xs transition shadow-sm cursor-pointer"
              >
                Save Choice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
