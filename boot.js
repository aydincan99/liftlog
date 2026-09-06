(function () {
  var KEY = 'aflift.scriptfail';
  window.addEventListener(
    'error',
    function (ev) {
      var el = ev.target;
      if (!el || el.tagName !== 'SCRIPT') return;
      try {
        if (sessionStorage.getItem(KEY)) return;
        sessionStorage.setItem(KEY, '1');
      } catch (e) {
        return;
      }
      var u = new URL(location.href);
      u.searchParams.set('r', String(Date.now()));
      location.replace(u.pathname + u.search);
    },
    true,
  );

  function pref() {
    try {
      var raw = localStorage.getItem('liftlog.v3');
      if (!raw) return 'light';
      var data = JSON.parse(raw);
      var a = data && data.appearance;
      if (a === 'dark' || a === 'system') return a;
    } catch (e) {
      /* keep light */
    }
    return 'light';
  }

  var choice = pref();
  var dark =
    choice === 'dark' ||
    (choice === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var scheme = dark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', scheme);
  document.documentElement.style.colorScheme = scheme;
  var theme = document.querySelector('meta[name="theme-color"]');
  if (theme) theme.setAttribute('content', dark ? '#05060A' : '#F7F8F5');
})();
