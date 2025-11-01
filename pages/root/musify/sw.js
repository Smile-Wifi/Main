const CACHE_NAME = 'musify-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request).then(fRes => {
        const resClone = fRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return fRes;
      }))
    );
  } else {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
  }
});
