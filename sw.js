const CACHE_NAME = 'vitatrack-v11';
const URLS_TO_CACHE = [
  './index.html',
  './logo.svg',
  './manifest.json'
];

// Install: Cache only the core shell files. 
// We do NOT cache .tsx files here to prevent 404 errors during installation 
// in environments where build artifacts are dynamic.
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching core assets');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First, then Cache, then Offline Fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like CDN) from strict caching to avoid CORS issues,
  // unless we want to handle opaque responses. For this app, we focus on local code.
  // We also only handle HTTP/HTTPS requests.
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try the cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // SPA Fallback: If it's a navigation request (e.g. /settings) and we are offline,
            // serve index.html so the React app can load.
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});