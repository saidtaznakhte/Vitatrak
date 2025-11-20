
const CACHE_NAME = 'vitatrack-v9';
const URLS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        URLS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn('Failed to cache during install:', url, err);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // NETWORK FIRST STRATEGY
  // 1. Try network
  // 2. If success, cache copy and return
  // 3. If fail (offline), return from cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check for valid response
        // We allow opaque responses (status 0) for CDNs to be cached
        if (!response || (response.status !== 200 && response.type !== 'opaque')) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache and network failed, and it's a navigation, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
