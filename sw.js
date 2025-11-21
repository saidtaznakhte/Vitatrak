
const CACHE_NAME = 'vitatrack-v10';

// Core assets that MUST be present for the app to look like an app (static files)
const CORE_ASSETS = [
  './logo.svg',
  './manifest.json'
];

// Assets that are important but might fail in some environments during install
// We try to cache them, but don't fail the installation if they are missing initially.
// They will be cached upon first successful load via the Network-First strategy.
const OPTIONAL_ASSETS = [
  './',
  './index.html',
  './index.tsx'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Cache core assets - fail installation if these fail
      await cache.addAll(CORE_ASSETS);
      
      // 2. Try to cache optional assets, but don't fail installation if they are missing
      // This fixes "404 code not found" errors during SW installation on some servers
      await Promise.all(
        OPTIONAL_ASSETS.map(url => 
          cache.add(url).catch(err => console.warn(`SW: Failed to pre-cache ${url}:`, err))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Control open clients immediately
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Ignore non-http requests (like chrome-extension://)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    (async () => {
      try {
        // NETWORK FIRST STRATEGY
        // Try to get the freshest content from the network
        const networkResponse = await fetch(event.request);
        
        // Check if we got a valid response
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseToCache);
          return networkResponse;
        }
        
        // SPA FALLBACK:
        // If network returned 404 and it's a navigation request (e.g. /dashboard),
        // return the cached index.html so React Router can handle it.
        if (networkResponse && networkResponse.status === 404 && event.request.mode === 'navigate') {
           const cachedIndex = await caches.match('./index.html');
           if (cachedIndex) return cachedIndex;
        }

        return networkResponse;
      } catch (error) {
        // OFFLINE FALLBACK
        // Network failed (offline), try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If request is for a page navigation and not in cache, return index.html
        if (event.request.mode === 'navigate') {
          const cachedIndex = await caches.match('./index.html');
          if (cachedIndex) return cachedIndex;
        }
        
        throw error;
      }
    })()
  );
});
