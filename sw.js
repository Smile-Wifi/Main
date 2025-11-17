// ===============================
// Smile Wifi — Service Worker v1
// ===============================

const CACHE_NAME = "smilewifi-cache-v1";

// Add ALL important files you want stored offline
const ASSETS = [
  "/",
  "/index.html",

  // Background videos
  "/media/background/bg.mp4",
  "/media/background/space.mp4",

  // Audio
  "/audio/intro.mp3",

  // Icons
  "/media/icons/nest.png",
  "/media/icons/banner.png",
  "/media/icons/download.png",
  "/media/icons/Home.png",

  // Common image/UI assets
  "/media/GIF/earth.gif",
  "/media/GIF/Mars.gif",

  // CSS (if external)
  // "/style.css",

  // JS internal (index.html inline code cannot be cached separately)
];

// ===== INSTALL — Pre-cache Everything =====
self.addEventListener("install", event => {
  console.log("[SW] Installing…");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching assets");
      return cache.addAll(ASSETS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// ===== ACTIVATE — Clean Old Caches =====
self.addEventListener("activate", event => {
  console.log("[SW] Activated");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ===== FETCH — Network First (HTML), Cache First (assets) =====
self.addEventListener("fetch", event => {
  const req = event.request;

  // HTML pages → Network first
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Clone to cache
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match("/index.html")))
    );
    return;
  }

  // Assets → Cache first
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(res => {
          // Store in cache only if safe
          if (req.url.startsWith(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
