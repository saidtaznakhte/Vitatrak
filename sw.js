const CACHE_NAME = 'vitatrack-v6';
// We only cache the specific files we know exist. 
// accessing './' can cause 404s on some static hosts that don't implicitly serve index.html
const URLS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We handle the cache add individually so one failure doesn't break the whole install
      return Promise.all(
        URLS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || (response.status !== 200 && response.type !== 'opaque')) {
          return response;
        }

        // Clone the response to store in cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Cache the new resource for future use
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch((error) => {
        console.log('Fetch failed; returning offline page instead.', error);
        // Fallback for navigation requests (like refreshing the page while offline)
        if (event.request.mode === 'navigate') {
            return caches.match('index.html');
        }
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