const CACHE_NAME = 'num-trainer-v3';
const FILES = [
  '/numbers/',
  '/numbers/index.html',
  '/numbers/manifest.json',
  '/numbers/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Bebas+Neue&display=swap',
  'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2',
  'https://fonts.gstatic.com/s/tajawal/v4/Iura6YBj_oCad4k1rzaLCr5IlLA.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, response.clone());
        return response;
      });
    }))
  );
});
