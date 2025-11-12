const C='smile-v1';
self.addEventListener('install',e=>e.waitUntil(
  caches.open(C).then(c=>c.addAll(['/', '/index.html','/GIF/earth.gif','/GIF/Home.png','/GIF/mars.gif']))
));
self.addEventListener('fetch',e=>e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
));
