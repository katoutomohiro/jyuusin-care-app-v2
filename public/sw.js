const CACHE_NAME = 'jyushin-care-app-v2-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.svg',
  '/index.css',
  '/favicon.ico',
  // 主要なJS/CSS/HTML/アイコンを追加
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  // APIリクエストは除外（例: /api/ で始まるものはネットワーク優先）
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('[ServiceWorker] Cache hit:', event.request.url);
        return response;
      }
      console.log('[ServiceWorker] Cache miss, fetching:', event.request.url);
      return fetch(event.request).then(networkResponse => {
        // GETリクエストのみキャッシュ
        if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // オフライン時はキャッシュのみ返す
        return caches.match(event.request);
      });
    })
  );
});
