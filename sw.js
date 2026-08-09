// Backcountry service worker — installability + basic offline shell only.
//
// This app leans on real network behavior for almost everything: pmtiles.js
// issues HTTP Range requests against multi-hundred-MB/multi-GB archives,
// and the AI guide, search, and photo gallery all make live cross-origin
// fetches (Supabase, Wikidata, NLCD, Wikimedia Commons, the AI provider
// APIs). A service worker that intercepts indiscriminately can silently
// break Range semantics or swallow POST bodies. So this one only ever
// touches a short, explicit allowlist of same-origin GET requests for the
// static app shell (the HTML/manifest/icons) — everything else is left
// completely alone by never calling event.respondWith() for it, which
// means the browser handles it exactly as if no service worker existed.
const CACHE_VERSION = 'backcountry-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

const SHELL_PATHS = new Set([
  '/', '/index.html', '/manifest.webmanifest',
  '/icon-192.png', '/icon-512.png', '/icon-512-maskable.png', '/apple-touch-icon.png',
]);
function isShellRequest(url) {
  return url.origin === self.location.origin && SHELL_PATHS.has(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // never touch POSTs (AI provider calls) or Range GETs below
  if (request.headers.has('range')) return; // pmtiles archive reads — must hit the network untouched

  const url = new URL(request.url);
  if (!isShellRequest(url)) return; // everything else: leave completely alone

  // Network-first so a fresh deploy is always picked up when online;
  // cache is only a fallback for offline/flaky-connection use.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request))
  );
});
