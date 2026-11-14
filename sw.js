/**
 * Stardust Merge - Service Worker
 * Cache Name: stardust-v1.0.0
 * Scope: ./
 */

const CACHE_NAME = 'stardust-v1.0.0';

// App shell assets to precache immediately on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './how-to-play.html',
  './about.html',
  './privacy.html',
  './terms.html',
  './contact.html',
  './404.html',
  './offline.html',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './assets/vendor/matter.min.js',
  './assets/fonts/fonts.css',
  './assets/fonts/font-0-i7dPIFZ9Zz-WBtRtedDbYE98RWq7.woff2',
  './assets/fonts/font-1-i7dPIFZ9Zz-WBtRtedDbYEF8RQ.woff2',
  './assets/fonts/font-2-XRXV3I6Li01BKofIOOaBXso.woff2',
  './assets/fonts/font-3-XRXV3I6Li01BKofIMeaBXso.woff2',
  './assets/fonts/font-4-XRXV3I6Li01BKofIOuaBXso.woff2',
  './assets/fonts/font-5-XRXV3I6Li01BKofIO-aBXso.woff2',
  './assets/fonts/font-6-XRXV3I6Li01BKofINeaB.woff2',
  './assets/fonts/font-7-XRXV3I6Li01BKofIOOaBXso.woff2',
  './assets/fonts/font-8-XRXV3I6Li01BKofIMeaBXso.woff2',
  './assets/fonts/font-9-XRXV3I6Li01BKofIOuaBXso.woff2',
  './assets/fonts/font-10-XRXV3I6Li01BKofIO-aBXso.woff2',
  './assets/fonts/font-11-XRXV3I6Li01BKofINeaB.woff2',
  './assets/fonts/font-12-XRXV3I6Li01BKofIOOaBXso.woff2',
  './assets/fonts/font-13-XRXV3I6Li01BKofIMeaBXso.woff2',
  './assets/fonts/font-14-XRXV3I6Li01BKofIOuaBXso.woff2',
  './assets/fonts/font-15-XRXV3I6Li01BKofIO-aBXso.woff2',
  './assets/fonts/font-16-XRXV3I6Li01BKofINeaB.woff2',
  './css/site.css',
  './js/config.js',
  './js/consent.js',
  './js/pwa.js',
  './js/analytics.js',
  './guides/index.html',
  './guides/beginner-cosmic-merge-guide.html',
  './guides/how-to-reach-black-hole-coco.html',
  './guides/combos-scoring-and-multipliers.html',
  './guides/perk-tier-list-and-synergies.html',
  './guides/daily-challenge-strategy.html'
];

// Domains that should NEVER be intercepted or cached
const BYPASS_DOMAINS = [
  'pagead2.googlesyndication.com',
  'googlesyndication.com',
  'googleads.g.doubleclick.net',
  'adservice.google.com',
  'ep1.adtrafficquality.google',
  'google-analytics.com',
  'analytics.google.com',
  'googletagmanager.com',
  'neon.tech',
  'ipapi.co',
  'api.web3forms.com',
  'formspree.io'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use map with individual error handling to prevent a single missing asset from failing installation
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Precache failed for ${asset}:`, err);
          })
        )
      );
    })
  );
});

// Activate: clean up obsolete caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strictly ignore non-GET requests and bypassed third-party ad/analytics domains
  if (event.request.method !== 'GET') return;
  if (BYPASS_DOMAINS.some((domain) => url.hostname.includes(domain))) {
    return; // Pass through to normal network fetch
  }

  // 1. Navigation requests (HTML pages): Network-first with fallback to cache, then offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to offline page
            return caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // 2. Static assets (CSS, JS, fonts, images): Cache-first with network fallback
  if (
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.webmanifest'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Default: Network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Allow clients to trigger skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
