'use client';

const IS_PROD = process.env.NODE_ENV === 'production';
const ENABLE_DEV_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV === 'true';
const SHOULD_LOAD_MONITORING = IS_PROD || ENABLE_DEV_ANALYTICS;

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

let isInitialized = false;

// 1. Consent Helpers
export function getConsent() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('beyond_rare_consent');
  return stored ? JSON.parse(stored) : null;
}

export function setConsent(consent) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('beyond_rare_consent', JSON.stringify(consent));
  
  if (consent.analytics || consent.errorTracking) {
    initMonitoring();
  }
}

// 2. Monitoring Script Loader
export function initMonitoring() {
  if (typeof window === 'undefined' || isInitialized || !SHOULD_LOAD_MONITORING) return;
  
  const consent = getConsent();
  if (!consent) return; // Wait for explicit consent

  isInitialized = true;

  // Sentry (Error & Performance Tracking)
  if (consent.errorTracking && SENTRY_DSN) {
    loadSentry(SENTRY_DSN);
  }

  // Google Analytics 4 & Microsoft Clarity (Analytics)
  if (consent.analytics) {
    if (GA_ID) loadGA4(GA_ID);
    if (CLARITY_ID) loadClarity(CLARITY_ID);
  }
}

function loadGA4(measurementId) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  const initScript = document.createElement('script');
  initScript.id = 'ga-init-script';
  initScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure'
    });
  `;
  document.head.appendChild(initScript);
}

function loadClarity(projectId) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('clarity-script')) return;

  const script = document.createElement('script');
  script.id = 'clarity-script';
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");
  `;
  document.head.appendChild(script);
}

function loadSentry(dsn) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('sentry-script')) return;

  const script = document.createElement('script');
  script.id = 'sentry-script';
  script.src = "https://browser.sentry-cdn.com/8.9.0/bundle.tracing.replay.min.js";
  script.crossOrigin = "anonymous";
  script.onload = () => {
    if (window.Sentry) {
      window.Sentry.init({
        dsn: dsn,
        integrations: [
          window.Sentry.browserTracingIntegration(),
          window.Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    }
  };
  document.head.appendChild(script);
}

// 3. Event Trackers
export function trackPageView(pathname) {
  if (typeof window === 'undefined') return;
  const consent = getConsent();
  if (isInitialized && consent?.analytics && window.gtag && GA_ID) {
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  if (!IS_PROD) {
    console.log(`[Analytics Event] Name: page_view`, {
      page_path: pathname,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: typeof window !== 'undefined' ? window.location.href : ''
    });
  }
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  const consent = getConsent();
  
  if (isInitialized && consent?.analytics && window.gtag && GA_ID) {
    window.gtag('event', eventName, params);
  }

  if (isInitialized && consent?.errorTracking && window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'analytics',
      message: `Event: ${eventName}`,
      data: params,
      level: 'info',
    });
  }

  if (!IS_PROD) {
    console.log(`[Analytics Event] Name: ${eventName}`, params);
  }
}

// Reusable track event wrappers
export function trackCtaClick(ctaName, label = '') {
  trackEvent('cta_clicked', {
    cta_name: ctaName,
    cta_label: label
  });
}

export function trackNavigationClick(to, text) {
  trackEvent('navigation_clicked', {
    to_url: to,
    link_text: text
  });
}

export function trackOutboundClick(url, text) {
  trackEvent('outbound_link_clicked', {
    target_url: url,
    link_text: text
  });
}

export function trackContactFormStarted() {
  trackEvent('contact_form_started');
}

export function trackContactFormSubmitted() {
  trackEvent('contact_form_submitted');
}

export function trackLoginStarted(method) {
  trackEvent('login_started', { method });
}

export function trackLoginSucceeded(method) {
  trackEvent('login_succeeded', { method });
}

export function trackSignupStarted(method) {
  trackEvent('signup_started', { method });
}

export function trackSignupCompleted(method) {
  trackEvent('signup_completed', { method });
}

export function trackApiRequestFailed(url, status, errorMsg) {
  trackEvent('api_request_failed', {
    request_url: url,
    status_code: status,
    error_message: errorMsg
  });
  
  const consent = getConsent();
  if (isInitialized && consent?.errorTracking && window.Sentry) {
    window.Sentry.captureException(new Error(`API request failed: ${url} (${status}) - ${errorMsg}`), {
      extra: { url, status, errorMsg }
    });
  }
}
