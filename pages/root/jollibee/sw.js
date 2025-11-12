const CACHE_NAME = 'smilewifi-cache-v1';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'media/background/space.mp4',
  'media/icons/smilewifi.png',
  'media/icons/nest.png',
  'player/VPsara.mp4',
  'media/icons/login.png',
  'media/icons/live.png',
  'media/icons/advertising.png',
  'media/icons/news.png',
  'media/icons/weather.png',
  'media/icons/partnership.png',
  'media/icons/Home.png',
  'media/GIF/earth.gif',
  'media/GIF/Mars.gif',
  'media/icons/campusDC.png',
  'media/icons/smileflix.png',
  'media/icons/wecantilan.png',
  'media/icons/gradio.png',
  'media/icons/videoke.png',
  'media/icons/musify.png',
  'media/icons/freedom.png',
  'media/icons/wikipedia.png',
  'media/icons/shop2.png',
  'media/icons/reeltalk.png',
  'media/icons/sports.png',
  'media/icons/jollibee.png',
  'media/icons/skits.png',
  'media/icons/politics.png',
  'media/icons/ebooks.png',
  'media/icons/ai.png',
  'media/icons/dashboard.png',
];

// Install and cache all files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Serve from cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
