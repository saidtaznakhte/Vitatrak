const CACHE_NAME = 'vitatrack-v13';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './logo.svg',
  './manifest.json'
];

// Install: Cache core assets immediately
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

// Fetch: Network First -> Cache -> Offline Fallback
self.addEventListener('fetch', (event) => {
  // Only handle http/https requests
  if (!event.request.url.startsWith('http')) return;

  // Strategy: Try Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // CRITICAL CHANGE: 
        // allow response.type === 'cors' to cache external CDNs (React, Tailwind, etc.)
        // allow response.type === 'basic' for same-origin files
        if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try Cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Offline Fallback for Navigation (SPA Routing)
            // If the user requests any page route (e.g. /dashboard) and we are offline,
            // serve the cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            return null;
          });
      })
  );
});