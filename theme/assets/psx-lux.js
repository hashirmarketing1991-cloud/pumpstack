/* Pump Stack luxury product page: pack picker, bottom bar, picture row. No dependencies. */
(function () {
  if (window.__psxLux) return;
  window.__psxLux = true;

  var watcher = null;

  function each(root, selector, fn) {
    [].forEach.call(root.querySelectorAll(selector), fn);
  }

  /* Picking a pack updates every price, both buttons and the variant that gets added. */
  function onChange(event) {
    var input = event.target;
    if (!input || !input.matches || !input.matches('[data-lux-pack]')) return;
    var root = input.closest('[data-psx-lux]');
    if (!root) return;
    var price = input.getAttribute('data-price');
    var compare = input.getAttribute('data-compare');
    var available = input.getAttribute('data-available') === 'true';
    each(root, '[data-lux-variant]', function (el) { el.value = input.value; });
    each(root, '[data-lux-price]', function (el) { el.textContent = price; });
    each(root, '[data-lux-compare]', function (el) { el.textContent = compare; el.hidden = !compare; });
    each(root, '[data-lux-atc]', function (btn) {
      btn.disabled = !available;
      var label = btn.querySelector('[data-lux-atc-label]');
      if (label) label.textContent = btn.getAttribute(available ? 'data-label-add' : 'data-label-sold');
    });
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', input.value);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  }

  /* Width of one picture plus the gap after it. */
  function stepOf(rail) {
    var first = rail.firstElementChild;
    if (!first) return rail.clientWidth * 0.8;
    var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }

  /* Keep the arrows and the "2 / 5" counter in step with the picture row. */
  function syncRail(rail) {
    var look = rail.closest('[data-lux-look]');
    if (!look) return;
    var total = rail.children.length;
    var max = rail.scrollWidth - rail.clientWidth;
    var at = rail.scrollLeft;
    var index = Math.min(total, Math.max(1, Math.round(at / stepOf(rail)) + 1));
    if (max > 0 && at >= max - 4) index = total;
    each(look, '[data-lux-prev]', function (btn) { btn.disabled = at <= 4; });
    each(look, '[data-lux-next]', function (btn) { btn.disabled = max <= 0 || at >= max - 4; });
    each(look, '[data-lux-count]', function (el) { el.textContent = total > 1 ? index + ' / ' + total : ''; });
  }

  function watchRails() {
    each(document, '[data-psx-lux] [data-lux-rail]', function (rail) {
      if (!rail.__lux) {
        rail.__lux = true;
        var queued = false;
        rail.addEventListener('scroll', function () {
          if (queued) return;
          queued = true;
          window.requestAnimationFrame(function () { queued = false; syncRail(rail); });
        }, { passive: true });
      }
      syncRail(rail);
    });
  }

  /* Arrows move the picture row by one picture. */
  function onClick(event) {
    var btn = event.target.closest ? event.target.closest('[data-lux-prev], [data-lux-next]') : null;
    if (!btn) return;
    var look = btn.closest('[data-lux-look]');
    var rail = look ? look.querySelector('[data-lux-rail]') : null;
    if (!rail) return;
    var step = stepOf(rail);
    var dir = btn.hasAttribute('data-lux-prev') ? -1 : 1;
    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({ left: dir * step, behavior: smooth ? 'smooth' : 'auto' });
  }

  /* The bottom bar shows whenever the main button is off screen. */
  function watch() {
    if (watcher) watcher.disconnect();
    if (!('IntersectionObserver' in window)) return;
    watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var root = entry.target.closest('[data-psx-lux]');
        var bar = root ? root.querySelector('[data-lux-bar]') : null;
        if (bar) bar.classList.toggle('is-on', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    each(document, '[data-psx-lux] [data-lux-buybox]', function (el) { watcher.observe(el); });
  }

  /* On small screens the product tabs scroll sideways: start with the current product in view. */
  function centerTabs() {
    each(document, '[data-psx-lux] .psx-lux__tabs', function (nav) {
      var current = nav.querySelector('.is-current');
      if (!current || nav.scrollWidth <= nav.clientWidth) return;
      nav.scrollLeft = current.offsetLeft - nav.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
    });
  }

  function setup() {
    watch();
    centerTabs();
    watchRails();
  }

  function init() {
    setup();
    document.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    document.addEventListener('shopify:section:load', setup);
    window.addEventListener('load', centerTabs);
    window.addEventListener('load', watchRails);
    window.addEventListener('resize', watchRails);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
