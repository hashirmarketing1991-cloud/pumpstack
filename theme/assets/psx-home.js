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

  function init() {
    collect();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    document.addEventListener('shopify:section:load', collect);
    document.addEventListener('shopify:section:reorder', collect);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
