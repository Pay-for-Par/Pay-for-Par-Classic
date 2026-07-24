const CACHE = 'pay-to-par-phase-3-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/main.css',
  './js/app.js', './js/router.js', './js/views.js', './js/data.js', './js/state.js', './js/setup.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/icons/icon-512-maskable.png', './assets/icons/apple-touch-icon.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response;
  })));
});
