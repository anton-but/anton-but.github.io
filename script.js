(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Fade-up при скролле --- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 5, 4) * 55) + 'ms';
      io.observe(el);
    });
  }

  /* --- Подсветка активной секции в навигации --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.4] });

    targets.forEach(function (t) { spy.observe(t); });
  }
})();
