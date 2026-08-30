const CACHE = 'aflift-v30';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('key') || url.searchParams.has('token')) return;

  const fresh =
    url.pathname.endsWith('/version.json') ||
    url.pathname.endsWith('/rev.json') ||
    url.pathname.endsWith('/sw.js') ||
    url.pathname.endsWith('/check.js') ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/liftlog/') ||
    url.pathname.endsWith('/liftlog') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json');

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((res) => {
        if (res.ok && !fresh) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./'))),
  );
});
