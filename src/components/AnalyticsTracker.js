'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initMonitoring, trackPageView, trackOutboundClick, trackCtaClick, trackNavigationClick } from '@/utils/monitoring';

function TrackerComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize on mount
  useEffect(() => {
    initMonitoring();
  }, []);

  // Track page view on route transitions
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname, searchParams]);

  // Global event interceptors for outbound links, CTAs, and internal navigation clicks
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // 1. Capture Link clicks
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href, window.location.href);
          const isInternal = url.hostname === window.location.hostname;

          if (!isInternal) {
            // Outbound link clicked
            const text = link.innerText.trim() || link.getAttribute('aria-label') || '';
            trackOutboundClick(link.href, text);
          } else {
            // Internal link - check if navigation
            const isNav = link.closest('nav') || link.closest('header') || link.getAttribute('data-nav') || link.closest('[data-nav-container]');
            if (isNav) {
              const text = link.innerText.trim() || link.getAttribute('aria-label') || '';
              trackNavigationClick(url.pathname, text);
            }
          }
        } catch (err) {
          console.error('Error tracking click:', err);
        }
      }

      // 2. Capture CTA button clicks
      const ctaElement = e.target.closest('[data-cta]');
      if (ctaElement) {
        const ctaName = ctaElement.getAttribute('data-cta');
        const ctaLabel = ctaElement.innerText.trim() || ctaElement.getAttribute('aria-label') || '';
        trackCtaClick(ctaName, ctaLabel);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerComponent />
    </Suspense>
  );
}
