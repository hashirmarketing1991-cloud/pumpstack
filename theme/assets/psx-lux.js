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

  /* Arrows move the picture row by one picture. */
  function onClick(event) {
    var btn = event.target.closest ? event.target.closest('[data-lux-prev], [data-lux-next]') : null;
    if (!btn) return;
    var look = btn.closest('[data-lux-look]');
    var rail = look ? look.querySelector('[data-lux-rail]') : null;
    if (!rail) return;
    var first = rail.firstElementChild;
    var step = first ? first.getBoundingClientRect().width + 18 : rail.clientWidth * 0.8;
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
  }

  function init() {
    setup();
    document.addEventListener('change', onChange);
    document.addEventListener('click', onClick);
    document.addEventListener('shopify:section:load', setup);
    window.addEventListener('load', centerTabs);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
