const CACHE_NAME = "godavari-pushkaralu-v2";
const STATIC_ASSETS = [
  "/",
  "/te",
  "/hi",
  "/en",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("SW: Failed to cache some assets:", err);
      })
    )
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache, then offline page
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("docs.google.com")) return;
  if (event.request.url.includes("script.google.com")) return;
  if (event.request.url.includes("googleapis.com")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For page navigations, show offline page
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
          return new Response("Offline", { status: 503 });
        })
      )
  );
});
