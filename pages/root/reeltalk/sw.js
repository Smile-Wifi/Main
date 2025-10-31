const CACHE_NAME = "reeltalk-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/media/logo/reeltalk.png",
  "/media/audio/intro.mp3"
];

// Install
self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch handler
self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(response=>{
      return response || fetch(e.request).then(fetchRes=>{
        return caches.open(CACHE_NAME).then(cache=>{
          cache.put(e.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(()=>response);
    })
  );
});
