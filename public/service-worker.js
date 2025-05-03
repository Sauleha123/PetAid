// public/service-worker.js
// This is a placeholder. The actual service worker will be generated during the build process.

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('petaid-cache-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/bundle.js', // Adjust paths based on your build output
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });