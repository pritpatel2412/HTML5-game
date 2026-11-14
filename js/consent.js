/**
 * Stardust Merge - Real Cookie & Privacy Consent Manager
 * Controls personalized vs non-personalized Google Ads and GA4 analytics.
 */

const STORAGE_KEY = 'stardust_consent_v1';

export const ConsentManager = {
  // States: 'granted', 'denied', or null
  getConsent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  setConsent(prefs) {
    try {
      const data = {
        ad_storage: prefs.ads ? 'granted' : 'denied',
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        personalized_ads: !!prefs.personalized,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.applyConsent(data);
    } catch (e) {
      console.warn('[Consent] Could not save consent:', e);
    }
  },

  applyConsent(data) {
    // 1. Google AdSense Personalized vs Non-Personalized
    window.adsbygoogle = window.adsbygoogle || [];
    if (data && data.personalized_ads) {
      window.adsbygoogle.requestNonPersonalizedAds = 0;
    } else {
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    // 2. Google Analytics 4 Consent Mode
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: data && data.ad_storage === 'granted' ? 'granted' : 'denied',
        analytics_storage: data && data.analytics_storage === 'granted' ? 'granted' : 'denied'
      });
    }

    // Hide banner and modal if open
    this.hideBanner();
    this.hideManageModal();
  },

  init() {
    const existing = this.getConsent();
    if (!existing) {
      this.showBanner();
    } else {
      this.applyConsent(existing);
    }

    // Bind footer trigger buttons if present
    document.querySelectorAll('.footer-btn-cookie, [data-trigger-cookie-settings]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showManageModal();
      });
    });
  },

  showBanner() {
    let el = document.getElementById('stardust-consent-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'stardust-consent-banner';
      el.className = 'consent-banner-wrapper visible';
      el.innerHTML = `
        <div class="consent-inner">
          <div class="consent-text">
            <strong>Privacy &amp; Cookie Preferences:</strong> We use cookies and local storage to save your game progress and serve gameplay-supporting ads. You can choose whether to allow personalized ads and analytics.
          </div>
          <div class="consent-buttons">
            <button id="consent-btn-accept" class="btn-primary" style="padding:8px 14px; font-size:0.9rem;">Accept All</button>
            <button id="consent-btn-reject" class="btn-secondary" style="padding:8px 14px; font-size:0.9rem;">Reject Non-Essential</button>
            <button id="consent-btn-manage" class="btn-secondary" style="padding:8px 14px; font-size:0.9rem;">Manage</button>
          </div>
        </div>
      `;
      document.body.appendChild(el);

      document.getElementById('consent-btn-accept').addEventListener('click', () => {
        this.setConsent({ ads: true, personalized: true, analytics: true });
      });
      document.getElementById('consent-btn-reject').addEventListener('click', () => {
        this.setConsent({ ads: true, personalized: false, analytics: false });
      });
      document.getElementById('consent-btn-manage').addEventListener('click', () => {
        this.showManageModal();
      });
    } else {
      el.classList.add('visible');
    }
  },

  hideBanner() {
    const el = document.getElementById('stardust-consent-banner');
    if (el) el.classList.remove('visible');
  },

  showManageModal() {
    let modal = document.getElementById('stardust-consent-modal');
    const current = this.getConsent() || { personalized_ads: false, analytics_storage: 'denied' };

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'stardust-consent-modal';
      modal.className = 'modal-backdrop visible';
      modal.innerHTML = `
        <div class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="consent-sheet-title">
          <div class="modal-sheet-header">
            <h3 id="consent-sheet-title" class="modal-sheet-title">Cookie &amp; Ad Preferences</h3>
            <button id="consent-modal-close" class="btn-close-sheet" aria-label="Close">&times;</button>
          </div>
          <div style="font-size:0.95rem; line-height:1.5; margin-bottom:16px;">
            Customize which cookies and data collection technologies are enabled during your visit:
          </div>
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
            <label style="display:flex; justify-content:space-between; align-items:center; background:var(--night-3); padding:12px; border:2px solid var(--ink); border-radius:var(--radius-sm);">
              <div>
                <strong>Essential Game Storage</strong>
                <div style="font-size:0.8rem; opacity:0.8;">High scores, settings, unlocked perks (Required)</div>
              </div>
              <input type="checkbox" checked disabled style="width:20px; height:20px;" />
            </label>
            <label style="display:flex; justify-content:space-between; align-items:center; background:var(--night-3); padding:12px; border:2px solid var(--ink); border-radius:var(--radius-sm); cursor:pointer;">
              <div>
                <strong>Personalized Advertising</strong>
                <div style="font-size:0.8rem; opacity:0.8;">Allows Google to tailor ads based on interests</div>
              </div>
              <input type="checkbox" id="consent-toggle-personalized" ${current.personalized_ads ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;" />
            </label>
            <label style="display:flex; justify-content:space-between; align-items:center; background:var(--night-3); padding:12px; border:2px solid var(--ink); border-radius:var(--radius-sm); cursor:pointer;">
              <div>
                <strong>Anonymous Analytics</strong>
                <div style="font-size:0.8rem; opacity:0.8;">Helps us balance level difficulty &amp; physics</div>
              </div>
              <input type="checkbox" id="consent-toggle-analytics" ${current.analytics_storage === 'granted' ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;" />
            </label>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button id="consent-save-prefs" class="btn-primary" style="padding:10px 20px;">Save Preferences</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('consent-modal-close').addEventListener('click', () => this.hideManageModal());
      document.getElementById('consent-save-prefs').addEventListener('click', () => {
        const personalized = document.getElementById('consent-toggle-personalized').checked;
        const analytics = document.getElementById('consent-toggle-analytics').checked;
        this.setConsent({
          ads: true,
          personalized: personalized,
          analytics: analytics
        });
      });
    } else {
      const pToggle = document.getElementById('consent-toggle-personalized');
      const aToggle = document.getElementById('consent-toggle-analytics');
      if (pToggle) pToggle.checked = !!current.personalized_ads;
      if (aToggle) aToggle.checked = current.analytics_storage === 'granted';
      modal.classList.add('visible');
    }
  },

  hideManageModal() {
    const modal = document.getElementById('stardust-consent-modal');
    if (modal) modal.classList.remove('visible');
  }
};

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ConsentManager.init());
  } else {
    ConsentManager.init();
  }
}

if (typeof window !== 'undefined') {
  window.ConsentManager = ConsentManager;
}
