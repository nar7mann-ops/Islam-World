const CACHE_NAME = 'islam-v-final';
// Кэшируем только самое необходимое и через относительные пути
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll может упасть, если один файл не найден, 
      // поэтому используем более мягкий способ
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Стратегия: Сначала сеть, если упала — кэш
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
