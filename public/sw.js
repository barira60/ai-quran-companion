// Quran Companion AI - Service Worker
const CACHE_NAME = "quran-companion-v2";
const AUDIO_CACHE_NAME = "quran-audio-cache-v1";
const DATA_CACHE_NAME = "quran-data-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/apple-touch-icon.png",
  "/fonts/al-qalam-quran-majeed.woff2",
  "/fonts/al-qalam-quran-majeed-1.woff2",
  "/fonts/jameel-noori-nastaleeq.woff2"
];

// Install Event: Cache static shell assets & core fonts
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Some static assets failed to pre-cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches while preserving audio & data caches
self.addEventListener("activate", (event) => {
  const allowedCaches = [CACHE_NAME, AUDIO_CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Intelligent multi-tier caching
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 1. Never intercept dynamic AI chat streams
  if (url.pathname.startsWith("/api/") || url.hostname.includes("generativelanguage.googleapis.com")) {
    return;
  }

  // 2. Audio Recitation Caching (Cache-First Strategy for offline listening)
  if (url.hostname.includes("everyayah.com") || url.pathname.endsWith(".mp3")) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === "opaque")) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // If offline and not in cache
          return new Response(null, { status: 504, statusText: "Audio not cached offline" });
        }
      })
    );
    return;
  }

  // 3. Quran API Data Caching (Cache-First for verified ayahs)
  if (url.hostname.includes("api.alquran.cloud")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response(JSON.stringify({ code: 503, status: "Offline" }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    return;
  }

  // 4. Remote Fonts & CDN Assets (Stale-While-Revalidate / Cache-First)
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("cdn.jsdelivr.net") ||
    url.hostname.includes("unpkg.com")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === "opaque")) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || new Response(null, { status: 503 });
        }
      })
    );
    return;
  }

  // 5. Standard Static UI Assets & Navigation fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.destination === "style" ||
            event.request.destination === "script" ||
            event.request.destination === "image" ||
            event.request.destination === "font")
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.mode === "navigate") {
          const shell = await caches.match("/");
          if (shell) return shell;
        }
        return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
      })
  );
});
