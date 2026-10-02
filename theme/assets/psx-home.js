/* Pump Stack scroll homepage: hero card growth, stacking product deck, reveals. No dependencies. */
(function () {
  if (window.__psxHome) return;
  window.__psxHome = true;

  var root = document.documentElement;
  root.classList.add('psx-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = {};
  var ticking = false;
  var io = null;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* Height of a sticky or fixed store header, so pinned things sit below it. */
  function headerOffset() {
    var node = document.querySelector('header-component, .header, #shopify-section-header, [data-psx-header]');
    while (node && node !== document.body) {
      var pos = getComputedStyle(node).position;
      if (pos === 'sticky' || pos === 'fixed') return Math.round(node.getBoundingClientRect().height);
      node = node.parentElement;
    }
    return 0;
  }

  function collect() {
    els.heroes = [].slice.call(document.querySelectorAll('[data-psx-hero]'));
    els.decks = [].slice.call(document.querySelectorAll('[data-psx-deck]'));
    els.values = [].slice.call(document.querySelectorAll('[data-psx-values]'));
    if (io) io.disconnect();
    var reveals = document.querySelectorAll('[data-psx-reveal]');
    if (reduce || !('IntersectionObserver' in window) || (window.Shopify && window.Shopify.designMode)) {
      [].forEach.call(reveals, function (el) { el.classList.add('psx-in'); });
    } else {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('psx-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
      [].forEach.call(reveals, function (el) { io.observe(el); });
    }
    measure();
  }

  function measure() {
    var top = headerOffset();
    [].forEach.call(document.querySelectorAll('.psx'), function (el) { el.style.setProperty('--psx-top', top + 'px'); });
    els.decks.forEach(function (deck) {
      /* Cards pin just under the first line of the heading and slide over the rest. */
      var line = deck.querySelector('.psx-deck__head h2 span') || deck.querySelector('.psx-deck__head h2');
      if (line) deck.style.setProperty('--psx-headh', line.offsetHeight + 'px');
    });
    update();
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight;

    els.heroes.forEach(function (hero) {
      var stage = hero.querySelector('.psx-hero__stage');
      var card = hero.querySelector('.psx-hero__card');
      if (!stage || !card) return;
      if (reduce) { card.style.setProperty('--p', 1); return; }
      var r = stage.getBoundingClientRect();
      var start = vh * 0.5;
      var travel = start + (r.height - vh) * 0.55;
      card.style.setProperty('--p', clamp((start - r.top) / travel, 0, 1).toFixed(4));
    });

    els.decks.forEach(function (deck) {
      var cards = deck.querySelectorAll('.psx-card');
      if (reduce || !cards.length) return;
      var covers = [];
      var i;
      for (i = 0; i < cards.length; i++) {
        var stick = parseFloat(getComputedStyle(cards[i]).top) || 0;
        var rect = cards[i].getBoundingClientRect();
        covers[i] = clamp(1 - (rect.top - stick) / (rect.height * 0.9), 0, 1);
      }
      for (i = 0; i < cards.length; i++) {
        var depth = 0;
        for (var k = i + 1; k < cards.length; k++) depth += covers[k];
        cards[i].style.setProperty('--d', Math.min(depth, 4).toFixed(3));
      }
    });

    els.values.forEach(function (sec) {
      if (reduce) return;
      var r = sec.getBoundingClientRect();
      var t = clamp((vh - r.top) / (vh + r.height), 0, 1) - 0.5;
      var cards = sec.querySelectorAll('.psx-vcard');
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.setProperty('--y', (-t * (40 + (i % 3) * 46)).toFixed(1) + 'px');
      }
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  /* Video testimonial: start the hosted file, or swap in the YouTube or Vimeo player. */
  function onPlay(event) {
    var btn = event.target.closest ? event.target.closest('[data-psx-play]') : null;
    if (!btn) return;
    var frame = btn.closest('[data-psx-video]');
    if (!frame) return;
    var tpl = frame.querySelector('template');
    var video = frame.querySelector('video');
    if (tpl) {
      frame.appendChild(tpl.content.cloneNode(true));
    } else if (video) {
      video.setAttribute('controls', '');
      var started = video.play();
      if (started && started.catch) started.catch(function () {});
    }
    frame.classList.add('is-playing');
    btn.hidden = true;
  }

  /* Product gallery: thumbnails switch the big image. */
  function onThumb(event) {
    var thumb = event.target.closest ? event.target.closest('[data-psx-thumb]') : null;
    if (!thumb) return;
    var gallery = thumb.closest('[data-psx-gallery]');
    if (!gallery) return;
    var index = thumb.getAttribute('data-psx-thumb');
    [].forEach.call(gallery.querySelectorAll('[data-psx-slide]'), function (slide) {
      slide.classList.toggle('is-active', slide.getAttribute('data-psx-slide') === index);
    });
    [].forEach.call(gallery.querySelectorAll('[data-psx-thumb]'), function (el) {
      el.classList.toggle('is-active', el === thumb);
    });
  }

  /* Product packs: picking a pack updates the price, the button and the variant that gets added. */
  function onPack(event) {
    var input = event.target;
    if (!input || !input.matches || !input.matches('[data-psx-pack]')) return;
    var root = input.closest('[data-psx-product]');
    if (!root) return;
    var price = input.getAttribute('data-price');
    var compare = input.getAttribute('data-compare');
    var pct = input.getAttribute('data-pct');
    var available = input.getAttribute('data-available') === 'true';
    var set = function (sel, fn) { var el = root.querySelector(sel); if (el) fn(el); };
    set('[data-psx-variant-id]', function (el) { el.value = input.value; });
    set('[data-psx-now]', function (el) { el.textContent = price; });
    set('[data-psx-atc-price]', function (el) { el.textContent = price; });
    set('[data-psx-was]', function (el) { el.textContent = compare; el.hidden = !compare; });
    set('[data-psx-save]', function (el) { el.hidden = !compare || pct === '0'; });
    set('[data-psx-pct]', function (el) { el.textContent = pct; });
    set('[data-psx-atc]', function (btn) {
      btn.disabled = !available;
      var label = btn.querySelector('[data-psx-atc-label]');
      if (label) label.textContent = btn.getAttribute(available ? 'data-label-add' : 'data-label-sold');
    });
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', input.value);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  }

  function init() {
    collect();
    /* Capture phase, so this also hears themes that scroll an inner wrapper instead of the window. */
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    document.addEventListener('click', onPlay);
    document.addEventListener('click', onThumb);
    document.addEventListener('change', onPack);
    document.addEventListener('shopify:section:load', collect);
    document.addEventListener('shopify:section:reorder', collect);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
