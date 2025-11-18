// musify/sw.js
const CACHE_NAME = 'musify-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  // add local assets you actually have in this folder (icons, poster etc)
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Helpers
function isSameOrigin(url) {
  try {
    const u = new URL(url);
    return u.origin === self.location.origin;
  } catch (e) {
    return false;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(err => console.warn('SW install error', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1) Do not interfere with external APIs or external video hosts (raw.githubusercontent.com)
  const blockedHosts = ['api.github.com', 'raw.githubusercontent.com', 'facebook.com', 'twitter.com', 'api.whatsapp.com'];
  if (blockedHosts.some(h => url.hostname.includes(h))) {
    return; // let the browser handle it directly
  }

  // 2) Navigation requests -> network-first with fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // cache a clone (only same-origin navigation responses)
          if (isSameOrigin(req.url)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 3) For same-origin static files (CSS/JS/images/icons etc) use cache-first
  if (isSameOrigin(req.url) && (req.destination === 'style' || req.destination === 'script' || req.destination === 'image' || req.destination === 'font')) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        // store only same origin assets
        caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // 4) For video files served from same origin: prefer network (stream) but cache head responses (and file if small)
  if (isSameOrigin(req.url) && (req.url.endsWith('.mp4') || req.url.endsWith('.webm') || req.url.endsWith('.mov'))) {
    // network-first, but fall back to cache if offline
    event.respondWith(
      fetch(req).then(res => {
        // Only cache if response is valid and content-length is reasonable
        try {
          const contentLength = res.headers.get('content-length');
          const maxCacheBytes = 10 * 1024 * 1024; // 10MB — avoid storing huge files
          if (contentLength && Number(contentLength) < maxCacheBytes) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
          }
        } catch (e) { /* ignore */ }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 5) Default behavior: try cache first then network
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      // cache same-origin responses
      if (isSameOrigin(req.url)) {
        caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      }
      return res;
    }))
  );
});
