// sw.js  (place in the site root, same level as index.html)
const CACHE_NAME = 'smile-wifi-v1';

// Pre-cache the shell (HTML + critical assets)
const PRECACHE = [
  '/',
  '/index.html',
  '/sw.js',
  '/media/background/bg.mp4',
  '/media/icons/banner.png',
  '/media/icons/nest.png',
  '/media/icons/crible.png',
  '/media/video-player/ad3.mp4',
  '/audio/intro.mp3',
  // Add more critical files here if you want
];

// Install → cache the shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

// Fetch → cache-first, then network + cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Return cached version if we have it
      if (cached) return cached;

      // Otherwise fetch from network
      return fetch(e.request).then(netRes => {
        // Cache successful GET responses (status 200)
        if (netRes && netRes.status === 200 && netRes.type === 'basic') {
          const clone = netRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return netRes;
      }).catch(() => {
        // Offline fallback (optional)
        if (e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Activate → delete old caches
self.addEventListener('activate', e => {
  const expected = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !expected.includes(k)).map(k => caches.delete(k))
    ))
  );

});
