// Simple service worker: cache-first, but be cautious with large media.
// It will cache app shell and will cache any fetched resources (including MP4) when requested.
const CACHE_NAME = 'smileflix-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  // Optionally add CSS/other static files if external
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// On fetch: try cache first, otherwise fetch from network and put in cache.
// WARNING: this will cache any MP4 fetched by page (only after user triggers it).
self.addEventListener('fetch', event => {
  const req = event.request;

  // For range requests (video seeking), fall back to network (bypass cache)
  // to improve compatibility: let network handle range requests
  if (req.headers.get('range')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        // Only cache successful GET requests and avoid opaque cross-origin responses
        // but we do allow cross-origin raw.githubusercontent.com responses (opaque).
        if (!response || response.status !== 200) {
          // still return the network response (so video plays)
          return response;
        }
        // Clone and cache the fetched response
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(req, cloned).catch(err => {
            // caching may fail for large files /quota; ignore gracefully
            console.warn('Cache put failed', err);
          });
        });
        return response;
      }).catch(err => {
        // network failed
        return caches.match('./') // fallback to shell
          .then(shell => shell || new Response('Offline', { status: 503, statusText: 'Offline' }));
      });
    })
  );
});
