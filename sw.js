const CACHE_NAME = 'islam-v-force-update';
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
      // Кэшируем файлы по одному, чтобы ошибка в одном не ломала всё
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.log('Не критично:', url)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key)) // Удаляем ВООБЩЕ всё старое
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Прямая стратегия: сначала интернет. Если интернета нет — только тогда кэш.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
