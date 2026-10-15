// Service worker minimal : l'application se charge toujours depuis le réseau (donc toujours
// à jour) ; la dernière page connue sert uniquement de secours hors connexion.
const CACHE = "grands-espaces-shell";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;   // API Apps Script : jamais interceptée
  if (req.mode !== "navigate") return;
  e.respondWith(
    fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("shell", copy)); return res; })
      .catch(() => caches.open(CACHE).then(c => c.match("shell")).then(r => r || Response.error()))
  );
});
