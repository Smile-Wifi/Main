// ✅ Musify Service Worker (Optimized for GitHub Pages + Raw GitHub Video URLs)

const CACHE_NAME = 'musify-cache-v4';

// Only cache local files — NOT external GitHub RAW video URLs
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: Cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .catch(err => console.warn('SW install error:', err))
  );
  self.skipWaiting();
});

// Activate: Clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch Handler
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🚫 DO NOT CACHE external raw GitHub video URLs (CORS blocks them)
  if (url.hostname === 'raw.githubusercontent.com') {
    return; // allow streaming directly
  }

  // Navigation fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first strategy for local static files
  event.respondWith(
    caches.match(req).then(cached => {
      return (
        cached ||
        fetch(req).then(res => {
          if (req.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
          }
          return res;
        })
      );
    })
  );
});
