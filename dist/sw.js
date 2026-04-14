// Service Worker for FX Travel Jumbo Minisite
const CACHE_NAME = 'fx-travel-jumbo-v1.0.0';

// Resources to cache for offline support
const STATIC_CACHE_URLS = [
  '/',
  '/minisite-interactive.html',
  '/assets/app-icon-new.png',
  '/assets/appstore-banner.jpg',
  '/assets/hero-video.mp4',
  '/assets/jumbo-wave-transparent.gif', 
  '/assets/ocr-screen.png',
  '/assets/settlement.png',
  '/assets/thbhkd-quote.mp4',
  '/sounds/jumbo-sound.mp3',
  '/sounds/boo-sound.mp3',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        // Silent fail for service worker
      })
  );
});

// Activate event - cleanup old caches
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if found
        if (response) {
          return response;
        }
        
        // Fetch from network for uncached resources
        return fetch(event.request).then((networkResponse) => {
          // Cache successful network responses
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network request failed - return offline page or fallback
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Message handling (optional functionality)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});