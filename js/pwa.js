/**
 * Stardust Merge - PWA Controller
 * Handles Service Worker registration, updates, beforeinstallprompt, iOS install helper,
 * 2nd-run install sheet, offline status, and 200-coin install reward.
 */

import { CONFIG } from './config.js';

let deferredPrompt = null;
let newWorkerWaiting = false;

export const PWA = {
  isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  },

  isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream
    );
  },

  isIOSSafari() {
    const ua = navigator.userAgent;
    const isIOS = this.isIOS();
    const isWebKit = /WebKit/.test(ua);
    const isOtherBrowser = /CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    return isIOS && isWebKit && !isOtherBrowser;
  },

  init() {
    this.registerServiceWorker();
    this.setupInstallListeners();
    this.setupNetworkListeners();
    this.applyStandaloneStyling();
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((reg) => {
          // Check if an updated worker is already waiting
          if (reg.waiting) {
            this.showUpdateToast(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                  this.showUpdateToast(installing);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });

      // Listen for controllerchange to reload if triggered
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (newWorkerWaiting) {
          window.location.reload();
        }
      });
    }
  },

  showUpdateToast(worker) {
    let toast = document.getElementById('sw-update-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sw-update-toast';
      toast.className = 'sticker-toast visible';
      toast.innerHTML = `
        <span>New version ready!</span>
        <button id="sw-update-reload" style="padding:4px 10px; font-size:0.85rem; background:var(--coral); color:var(--cream);">Reload</button>
      `;
      document.body.appendChild(toast);

      document.getElementById('sw-update-reload').addEventListener('click', () => {
        newWorkerWaiting = true;
        if (worker) {
          worker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    } else {
      toast.classList.add('visible');
    }
  },

  setupInstallListeners() {
    // If already running standalone, hide all install triggers
    if (this.isStandalone()) {
      this.hideAllInstallUI();
      return;
    }

    // Chrome/Android/Edge beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallButtons();
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      this.hideAllInstallUI();
      this.grantInstallReward();
      if (window.Analytics) {
        window.Analytics.track('install_prompt_accepted', { method: 'pwa' });
      }
    });

    // Check iOS Safari to show manual install triggers if appropriate
    if (this.isIOS() && !this.isStandalone()) {
      this.showInstallButtons();
    }
  },

  showInstallButtons() {
    document.querySelectorAll('[data-pwa-install-btn]').forEach((btn) => {
      btn.style.display = 'inline-flex';
      btn.onclick = () => this.triggerInstallFlow();
    });
  },

  hideAllInstallUI() {
    document.querySelectorAll('[data-pwa-install-btn]').forEach((btn) => {
      btn.style.display = 'none';
    });
    const sheet = document.getElementById('pwa-install-sheet');
    if (sheet) sheet.classList.remove('visible');
    const iosSheet = document.getElementById('pwa-ios-sheet');
    if (iosSheet) iosSheet.classList.remove('visible');
  },

  triggerInstallFlow() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] Player accepted install');
        }
        deferredPrompt = null;
      });
    } else if (this.isIOS()) {
      if (this.isIOSSafari()) {
        this.showIOSSheet();
      } else {
        alert('To install Stardust Merge on iOS, please open this page in Safari, then tap Share -> Add to Home Screen.');
      }
    } else {
      alert('To install Stardust Merge, open your browser menu and choose "Install App" or "Add to Home Screen".');
    }
  },

  checkSecondRunPrompt() {
    if (this.isStandalone()) return;
    try {
      const runs = parseInt(localStorage.getItem(CONFIG.RUNS_COUNT_KEY) || '0', 10);
      const dismissed = localStorage.getItem(CONFIG.INSTALL_PROMPT_KEY);
      const now = Date.now();

      // If dismissed less than 7 days ago, skip
      if (dismissed && (now - parseInt(dismissed, 10)) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }

      // Show after 2nd completed run
      if (runs >= 2 && (deferredPrompt || this.isIOSSafari())) {
        this.showSecondRunSheet();
      }
    } catch (e) {
      // ignore storage error
    }
  },

  incrementCompletedRuns() {
    try {
      const runs = parseInt(localStorage.getItem(CONFIG.RUNS_COUNT_KEY) || '0', 10) + 1;
      localStorage.setItem(CONFIG.RUNS_COUNT_KEY, runs.toString());
      this.checkSecondRunPrompt();
    } catch (e) {}
  },

  showSecondRunSheet() {
    let modal = document.getElementById('pwa-install-sheet');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pwa-install-sheet';
      modal.className = 'modal-backdrop visible';
      modal.innerHTML = `
        <div class="modal-sheet" role="dialog" aria-modal="true">
          <div class="modal-sheet-header">
            <h3 class="modal-sheet-title">Install Stardust Merge</h3>
            <button id="pwa-dismiss-btn" class="btn-close-sheet" aria-label="Close">&times;</button>
          </div>
          <div style="font-size:1rem; line-height:1.5; margin-bottom:16px;">
            Enjoy fullscreen cosmic merging, offline play in airplane mode, faster load times, and receive <strong>+200 Free Cosmic Coins</strong>!
          </div>
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button id="pwa-sheet-later" class="btn-secondary" style="padding:10px 16px;">Maybe Later</button>
            <button id="pwa-sheet-install" class="btn-primary" style="padding:10px 20px;">Install App (+200 Coins)</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const dismiss = () => {
        localStorage.setItem(CONFIG.INSTALL_PROMPT_KEY, Date.now().toString());
        modal.classList.remove('visible');
      };

      document.getElementById('pwa-dismiss-btn').addEventListener('click', dismiss);
      document.getElementById('pwa-sheet-later').addEventListener('click', dismiss);
      document.getElementById('pwa-sheet-install').addEventListener('click', () => {
        dismiss();
        this.triggerInstallFlow();
      });
    } else {
      modal.classList.add('visible');
    }
  },

  showIOSSheet() {
    let modal = document.getElementById('pwa-ios-sheet');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pwa-ios-sheet';
      modal.className = 'modal-backdrop visible';
      modal.innerHTML = `
        <div class="modal-sheet" role="dialog" aria-modal="true">
          <div class="modal-sheet-header">
            <h3 class="modal-sheet-title">Add to iOS Home Screen</h3>
            <button id="ios-sheet-close" class="btn-close-sheet" aria-label="Close">&times;</button>
          </div>
          <div style="font-size:0.95rem; line-height:1.6; margin-bottom:16px;">
            Install Stardust Merge on your iPhone/iPad in 3 quick steps:
          </div>
          <ol style="margin-left:20px; font-size:0.95rem; line-height:1.8; margin-bottom:20px;">
            <li>Tap the <strong>Share button</strong> <svg style="display:inline; vertical-align:middle; width:20px; height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> at the bottom of Safari.</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong> <svg style="display:inline; vertical-align:middle; width:20px; height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>.</li>
            <li>Tap <strong>Add</strong> in the top-right corner!</li>
          </ol>
          <div style="text-align:right;">
            <button id="ios-sheet-done" class="btn-primary" style="padding:8px 16px;">Got It!</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('ios-sheet-close').addEventListener('click', () => modal.classList.remove('visible'));
      document.getElementById('ios-sheet-done').addEventListener('click', () => modal.classList.remove('visible'));
    } else {
      modal.classList.add('visible');
    }
  },

  grantInstallReward() {
    try {
      localStorage.setItem('stardust_pwa_install_granted_v1', 'true');
      const saveRaw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saveRaw) {
        const save = JSON.parse(saveRaw);
        if (!save.installedRewardClaimed) {
          save.coins = (save.coins || 0) + 200;
          save.installedRewardClaimed = true;
          localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(save));
          alert('Congratulations! You received +200 Cosmic Coins for installing Stardust Merge!');
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('stardust:coins-updated', { detail: { coins: save.coins } }));
          }
        }
      }
    } catch (e) {
      console.warn('[PWA] Could not grant coin reward:', e);
    }
  },

  setupNetworkListeners() {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      let badge = document.getElementById('offline-badge');
      if (!isOnline) {
        if (!badge) {
          badge = document.createElement('div');
          badge.id = 'offline-badge';
          badge.className = 'offline-status-badge visible';
          badge.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/>
              <path d="M5 12.55a10.94 10.94 0 015.17-2.39"/>
              <path d="M10.71 5.05A16 16 0 0122.58 9"/>
              <path d="M1.42 9a15.91 15.91 0 014.7-2.88"/>
              <path d="M8.53 16.11a6 6 0 016.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
            <span>Offline Mode Active</span>
          `;
          document.body.appendChild(badge);
        } else {
          badge.classList.add('visible');
        }
      } else {
        if (badge) badge.classList.remove('visible');
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  applyStandaloneStyling() {
    if (this.isStandalone()) {
      document.documentElement.classList.add('pwa-standalone');
    }
  }
};

// Initialize when ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWA.init());
  } else {
    PWA.init();
  }
}

if (typeof window !== 'undefined') {
  window.PWA = PWA;
}
