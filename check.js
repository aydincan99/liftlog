(function () {
  function metaBuild() {
    var el = document.querySelector('meta[name="aflift-build"]');
    return el ? el.getAttribute('content') : '';
  }
  function check() {
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (d) {
        if (!d || !d.build) return;
        var want = String(d.build);
        if (metaBuild() === want) return;
        var u = new URL(window.location.href);
        if (u.searchParams.get('b') === want) {
          u.searchParams.set('_', String(Date.now()));
        } else {
          u.searchParams.set('b', want);
        }
        window.location.replace(u.toString());
      })
      .catch(function () {});
  }
  check();
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') check();
  });
  window.addEventListener('pageshow', check);
})();
