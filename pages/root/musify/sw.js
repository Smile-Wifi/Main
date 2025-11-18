// ✅ Musify Service Worker (GitHub Pages compatible)

const CACHE_NAME = 'musify-cache-v1';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// INSTALL — cache local files only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .catch(err => console.warn('SW Install failed (likely CORS):', err))
  );
  self.skipWaiting();
});

// ACTIVATE — remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH — dynamic caching for videos, cache-first for other local files
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // skip external APIs or social shares
  if (url.hostname.includes('api.github.com') ||
      url.hostname.includes('facebook.com') ||
      url.hostname.includes('twitter.com') ||
      url.hostname.includes('whatsapp.com')) {
    return;
  }

  // navigation requests — network first
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

  // video files (raw GitHub) — cache dynamically
  if (req.url.endsWith('.mp4') || req.url.endsWith('.webm') || req.url.endsWith('.mov')) {
    event.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        }).catch(()=>console.warn('Video fetch failed:', req.url))
      )
    );
    return;
  }

  // CSS, JS, images — cache first
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        }).catch(()=>console.warn('Resource fetch failed:', req.url))
      )
    );
  }
});
