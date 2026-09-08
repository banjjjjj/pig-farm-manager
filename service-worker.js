const CACHE_NAME = 'pigfarm-pro-cache-v7';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/db.js?v=2.6',
  './js/app.js?v=2.6',
  './js/pages.js?v=2.6',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell Assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor for Offline Capabilities
self.addEventListener('fetch', event => {
  // Let Firebase / Firestore APIs pass through directly
  if (event.request.method !== 'GET' || 
      event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebase') ||
      event.request.url.includes('google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(fetchResponse => {
            // Check if response is valid
            if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Cache the newly requested asset dynamically
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return fetchResponse;
          })
          .catch(() => {
            // Fallback for CDN or external resources if network fails and not cached
            if (event.request.url.includes('chart.js')) {
              console.log('Failed fetching Chart.js library - Offline mode active');
            }
          });
      })
  );
});
