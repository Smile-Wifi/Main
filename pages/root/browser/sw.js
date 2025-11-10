const CACHE_NAME = 'mini-browser-v2';
const OFFLINE_URL = '/offline.html';
const ASSETS = ['/', '/index.html', '/manifest.json', OFFLINE_URL];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Ignore chrome-extension:// or about: requests
  if (req.url.startsWith('chrome-extension://') || req.url.startsWith('about:')) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkRes = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, networkRes.clone());
        return networkRes;
      } catch {
        const cached = await caches.match(req);
        return cached || await caches.match(OFFLINE_URL);
      }
    })());
    return;
  }

  // For others: cache-first
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
