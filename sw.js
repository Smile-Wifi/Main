const CACHE_NAME = 'smilewifi-v1';

const ASSETS_TO_CACHE = [
  '/', // index.html root
  '/index.html',
  '/manifest.json',

  // Background
  '/media/background/bg.webm',
  '/media/background/bg.mp4',

  // Icons
  '/media/icons/nest.png',
  '/media/icons/banner.png',
  '/media/icons/crible.png',
  '/media/icons/Home.png',
  '/media/icons/login.png',
  '/media/icons/games.png',
  '/media/icons/advertising.png',
  '/media/icons/weather.png',
  '/media/icons/about.jpg',
  '/media/icons/download.png',
  '/media/icons/dashboard.png',
  '/media/icons/CampusDC.png',
  '/media/icons/smileflex.png',
  '/media/icons/wecantilan.png',
  '/media/icons/band.png',
  '/media/icons/videoke.png',
  '/media/icons/musify.png',
  '/media/icons/reeltalk.png',
  '/media/icons/sports.png',
  '/media/icons/jollibee.png',
  '/media/icons/NSPYR.png',
  '/media/icons/tools.png',
  '/media/icons/smileshop.png',
  '/media/icons/freedom.png',
  '/media/icons/wikipedia.png',
  '/media/icons/shop2.png',
  '/media/icons/AWDT.png',
  '/media/icons/politics.png',
  '/media/icons/emergency.png',
  '/media/icons/hbo.png',
  '/media/icons/news.png',
  '/media/icons/youtube.png',
  '/media/icons/netflex.png',
  '/media/icons/x.png',
  '/media/icons/saga.png',

  // Gifs
  '/media/GIF/earth.gif',
  '/media/GIF/Mars.gif',
  '/media/GIF/footer.gif',

  // Audio
  '/audio/intro.mp3',

  // CSS
  '/style.css'
];

// Install & cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate & remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch with cache-first (but ignore external domains)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignore non-local requests (YouTube, Vimeo, Wikipedia, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request)
          .then(response => {
            // Cache cloned response
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => cached) // fallback if offline
      );
    })
  );
});
