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
})();
