const CACHE_NAME = 'musify-cache-v1';
const OFFLINE_URL = 'index.html';

self.addEventListener('install', (event) => {
  // Skip waiting and activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // Only cache your raw GitHub videos & videos.json
  if (
    requestURL.hostname === 'raw.githubusercontent.com' &&
    requestURL.pathname.includes('/Smile-Wifi/musify-auto/')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch (err) {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          return new Response('Offline', { status: 503 });
        }
      })
    );
  } else {
    // Default fetch: network first, then cache fallback
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(event.request))
    );
  }
});
