const CACHE_NAME = 'cia-study-v1';
const ASSETS = [
  './',
  './index.html',
  './quiz_menu.html',
  './summary_menu.html',
  './unit1.html',
  './unit2.html',
  './unit3.html',
  './unit4.html',
  './unit5.html',
  './unit6.html',
  './unit7.html',
  './unit8.html',
  './unit9.html',
  './unit10.html',
  './exam.html',
  './summary1.html',
  './summary2.html',
  './summary3.html',
  './summary4.html',
  './summary5.html',
  './summary6.html',
  './summary7.html',
  './summary8.html',
  './summary9.html',
  './summary10.html',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
