// ✅ Musify Service Worker (GitHub Pages compatible)

const CACHE_NAME = 'musify-cache-v3';
const OFFLINE_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './sw.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 🧩 INSTALL — Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .catch(err => console.warn('SW Install failed:', err))
  );
  self.skipWaiting();
});

// ♻️ ACTIVATE — Remove old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ⚡ FETCH — Smart caching strategy
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🚫 Skip caching for external APIs or share links
  if (
    url.hostname.includes('api.github.com') ||
    url.hostname.includes('facebook.com') ||
    url.hostname.includes('twitter.com') ||
    url.hostname.includes('whatsapp.com')
  ) {
    return;
  }

  // 🧭 For navigation requests → Network-first fallback to cache
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then(res => res || caches.match('./index.html')))
    );
    return;
  }

  // 🗂️ Cache-first for static resources (video, image, css, js)
  if (
    req.url.endsWith('.mp4') ||
    req.url.endsWith('.webm') ||
    req.url.endsWith('.mov') ||
    req.destination === 'image' ||
    req.destination === 'style' ||
    req.destination === 'script'
  ) {
    event.respondWith(
      caches.match(req).then(
        cached =>
          cached ||
          fetch(req).then(res => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
            return res;
          })
      )
    );
  }
});
