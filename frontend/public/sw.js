/**
 * WebinarPH Service Worker
 * PWA Offline Cache, Static Resource Management, and Web Push Notification Handlers.
 */

const CACHE_VERSION = 'webinarph-v1';
const STATIC_CACHE = `webinarph-static-${CACHE_VERSION}`;
const ASSET_CACHE = `webinarph-assets-${CACHE_VERSION}`;

// Pre-cached essential static shell assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/icon.svg',
];

// 1. Install Event: Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== ASSET_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Offline & Security Handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests (mutations, login POSTs, import uploads)
  if (request.method !== 'GET') {
    return;
  }

  // A. API REQUESTS: Strict Security & Accuracy Guardrail
  // Sensitive tokens, user registrations, and live seat counts must NEVER be served from stale unsafe caches.
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return structured offline JSON response
        return new Response(
          JSON.stringify({
            offline: true,
            error: 'OFFLINE_MODE',
            message: 'You are currently offline. Webinar seat availability, certificate deadlines, and live registrations cannot be verified without an active internet connection.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable (Offline)',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // B. NAVIGATION REQUESTS (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, put a clone in the cache for future navigation
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(async () => {
          // Try to return the cached SPA index or the offline fallback page
          const cache = await caches.open(STATIC_CACHE);
          const cachedIndex = await cache.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedOffline = await cache.match('/offline.html');
          return cachedOffline || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // C. STATIC ASSETS (JS, CSS, Images, Icons, Fonts)
  // Stale-While-Revalidate strategy for fast app-like performance
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(ASSET_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Web Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'WebinarPH Reminder',
    body: 'An upcoming verified webinar is starting soon. Check your schedule!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: '/calendar' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: [
      { action: 'open', title: 'Open WebinarPH' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
