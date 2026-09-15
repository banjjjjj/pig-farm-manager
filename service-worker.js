const CACHE_NAME = 'pigfarm-pro-cache-v9';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/db.js?v=2.8',
  './js/app.js?v=2.8',
  './js/pages.js?v=2.8',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Pre-caching App Shell Assets');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate Service Worker & Clear Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: Network-First with Cache Fallback for instant updates
self.addEventListener('fetch', event => {
  // Let Firebase / Firestore APIs pass through directly
  if (event.request.method !== 'GET' || 
      event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebase') ||
      event.request.url.includes('google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request);
      })
  );
});
