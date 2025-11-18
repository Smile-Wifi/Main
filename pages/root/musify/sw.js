// ✅ Musify Service Worker — caches GitHub raw assets
const CACHE_NAME = 'musify-cache-v4';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './app.js',
  './sw.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
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

// ♻️ ACTIVATE — Remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ⚡ FETCH — Network first for navigation, cache first for static assets
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip caching external APIs
  if (url.hostname.includes('api.github.com') || url.hostname.includes('facebook.com') ||
      url.hostname.includes('twitter.com') || url.hostname.includes('whatsapp.com')) return;

  // Navigation requests → Network first
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

  // Static assets → Cache first
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image' ||
      req.url.endsWith('.mp4') || req.url.endsWith('.webm') || req.url.endsWith('.mov')) {
    event.respondWith(
      caches.match(req).then(
        cached => cached || fetch(req).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
      )
    );
  }
});
