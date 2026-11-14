/**
 * Stardust Merge - Privacy-Compliant Analytics Wrapper
 * Triggers events only when consent has been granted AND GA4_ID is configured.
 */

import { CONFIG } from './config.js';
import { ConsentManager } from './consent.js';

export const Analytics = {
  initialized: false,

  init() {
    if (this.initialized) return;
    if (!CONFIG.GA4_ID || CONFIG.GA4_ID.startsWith('G-XXXXX')) {
      // Placeholder ID: analytics stays in mock/noop mode
      this.initialized = true;
      return;
    }

    const consent = ConsentManager.getConsent();
    if (!consent || consent.analytics_storage !== 'granted') {
      return;
    }

    // Load gtag.js dynamically once consented
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA4_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', CONFIG.GA4_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    this.initialized = true;
  },

  track(eventName, params = {}) {
    const consent = ConsentManager.getConsent();
    const isGranted = consent && consent.analytics_storage === 'granted';

    if (!isGranted || !CONFIG.GA4_ID || CONFIG.GA4_ID.startsWith('G-XXXXX')) {
      // In development / unconsented mode, safely log to console
      if (typeof console !== 'undefined' && console.debug) {
        console.debug(`[Analytics:Mock] ${eventName}:`, params);
      }
      return;
    }

    if (!this.initialized) {
      this.init();
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }
};

if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}
