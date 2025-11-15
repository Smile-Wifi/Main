// ===============================
// Smile Wifi Cache System
// GitHub Pages Compatible
// ===============================

const CACHE_NAME = "smile-wifi-v1";

// IMPORTANT: Add your asset folders here
const ASSETS = [
  "/", 
  "index.html",

  // Media
  "media/background/bg.mp4",
  "media/icons/nest.png",
  "media/icons/banner.png",
  
  // Add folders (GitHub won’t auto cache folders)
  // Icons
  "media/icons/CampusDC.png",
  "media/icons/smileflex.png",
  "media/icons/wecantilan.png",
  "media/icons/band.png",
  "media/icons/videoke.png",
  "media/icons/musify.png",
  "media/icons/reeltalk.png",
  "media/icons/sports.png",
  "media/icons/jollibee.png",
  "media/icons/NSPYR.png",
  "media/icons/tools.png",
  "media/icons/smileshop.png",
  "media/icons/freedom.png",
  "media/icons/wikipedia.png",
  "media/icons/shop2.png",
  "media/icons/AWDT.png",
  "media/icons/politics.png",
  "media/icons/emergency.png",
  "media/icons/hbo.png",
  "media/icons/news.png",
  "media/icons/youtube.png",
  "media/icons/netflex.png",
  "media/icons/x.png",
  "media/icons/saga.png",
  "media/icons/Home.png",

  // GIFs
  "media/GIF/earth.gif",
  "media/GIF/Mars.gif",

  // Videos
  "media/video-player/ad3.mp4",

  // Audio
  "audio/intro.mp3"
];

// ===============================
// INSTALL — cache all assets
// ===============================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ===============================
// ACTIVATE — cleanup old cache
// ===============================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ===============================
// FETCH — network first, fallback to cache
// ===============================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // update cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
