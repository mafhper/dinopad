importScripts('./precache-manifest.js');

const CACHE_NAME = 'dinopad-atlas-__DINOPAD_CACHE_VERSION__';
const PRECACHE = self.DINOPAD_PRECACHE || ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (let index = 0; index < PRECACHE.length; index += 40) {
      await cache.addAll(PRECACHE.slice(index, index + 40));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match('./index.html')) || Response.error()));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(url.href, { ignoreVary: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put(url.href, response.clone()));
      return response;
    } catch {
      return Response.error();
    }
  })());
});
