/* site.js - Elevated Dreams redesign pitch. No dependencies. Every feature fails closed: without this file the page
   shows everything (html.no-site after 4 s), the gate stays out of the way, and links still work. */
(function () {
  'use strict';
  window.__ed = true;
  var d = document, html = d.documentElement;
  html.classList.remove('no-site');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- 21+ gate ---------- */
  var gate = $('[data-gate]');
  function focusMain() { var m = $('#main'); if (m) m.focus({ preventScroll: true }); }
  if (gate) {
    var ok = false;
    try { ok = localStorage.getItem('ed-21') === '1'; } catch (e) { ok = html.classList.contains('is-21'); }
    if (!ok) {
      gate.hidden = false;
      d.body.style.overflow = 'hidden';
      var yes = $('[data-gate-yes]', gate);
      setTimeout(function () { if (yes) yes.focus(); }, 50);
      gate.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = $$('button', gate).filter(function (b) { return !b.hidden; });
        var i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      });
    }
    $('[data-gate-yes]', gate).addEventListener('click', function () {
      try { localStorage.setItem('ed-21', '1'); } catch (e) {}
      html.classList.add('is-21');
      gate.hidden = true;
      d.body.style.overflow = '';
      focusMain();
    });
    $('[data-gate-no]', gate).addEventListener('click', function () {
      var r = $('[data-gate-refused]', gate); if (r) r.hidden = false;
    });
  }

  /* ---------- header ---------- */
  var hdr = $('[data-hdr]');
  var lastY = -1;
  function onScrollHdr() { var y = window.scrollY; if ((y > 8) !== (lastY > 8)) hdr && hdr.classList.toggle('is-scrolled', y > 8); lastY = y; }

  /* dropdowns: hover on fine pointers, the caret button everywhere, Escape closes */
  var drops = $$('[data-drop]');
  function closeAll(except) { drops.forEach(function (li) { if (li !== except) { li.classList.remove('is-open'); var b = $('[data-drop-btn]', li); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  drops.forEach(function (li) {
    var b = $('[data-drop-btn]', li), t;
    function open() { clearTimeout(t); closeAll(li); li.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
    function close() { li.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); }
    b.addEventListener('click', function () { li.classList.contains('is-open') ? close() : open(); });
    li.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') open(); });
    li.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') t = setTimeout(close, 180); });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) close(); });
    li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); b.focus(); } });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('[data-drop]')) closeAll(); });

  /* drawer */
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]'), opener = $('[data-drawer-open]');
  function setDrawer(on) {
    if (!drawer) return;
    if (on) {
      drawer.hidden = false; scrim.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('is-on'); scrim.classList.add('is-on'); });
      opener.setAttribute('aria-expanded', 'true');
      d.body.style.overflow = 'hidden';
      setTimeout(function () { var c = $('[data-drawer-close]', drawer); if (c) c.focus(); }, 60);
    } else {
      drawer.classList.remove('is-on'); scrim.classList.remove('is-on');
      opener.setAttribute('aria-expanded', 'false');
      d.body.style.overflow = '';
      setTimeout(function () { if (!drawer.classList.contains('is-on')) { drawer.hidden = true; scrim.hidden = true; } }, reduce ? 0 : 500);
      opener.focus();
    }
  }
  if (opener) opener.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    $('[data-drawer-close]', drawer).addEventListener('click', function () { setDrawer(false); });
    scrim.addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
      if (e.key === 'Tab') {
        var f = $$('a,button', drawer); var i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1180 && drawer.classList.contains('is-on')) setDrawer(false); });
  }

  /* ---------- compliance rotator (WCAG 2.2.2: pausable, stops under reduced motion) ---------- */
  $$('[data-rot]').forEach(function (box) {
    var items = $$('[data-rot-item]', box), i = 0, timer = null, paused = reduce, hover = false;
    var count = $('[data-rot-count]', box), pauseBtn = $('[data-rot-pause]', box);
    function show(n) {
      i = (n + items.length) % items.length;
      items.forEach(function (it, k) { it.classList.toggle('is-on', k === i); it.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      if (count) count.textContent = (i + 1) + '/' + items.length;
    }
    function tick() { clearInterval(timer); if (!paused) timer = setInterval(function () { if (!hover && !d.hidden) show(i + 1); }, 6500); }
    $('[data-rot-prev]', box).addEventListener('click', function () { show(i - 1); tick(); });
    $('[data-rot-next]', box).addEventListener('click', function () { show(i + 1); tick(); });
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.setAttribute('aria-label', paused ? 'Resume automatic warning rotation' : 'Pause automatic warning rotation');
    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', paused ? 'Resume automatic warning rotation' : 'Pause automatic warning rotation');
      tick();
    });
    box.addEventListener('pointerenter', function () { hover = true; });
    box.addEventListener('pointerleave', function () { hover = false; });
    box.addEventListener('focusin', function () { hover = true; });
    box.addEventListener('focusout', function () { hover = false; });
    tick();
  });

  /* ---------- reveals and light sweeps ---------- */
  var reveal = $$('[data-reveal]'), lights = $$('[data-light]');
  function done(el) {
    el.classList.add('is-in');
    var t = parseFloat(getComputedStyle(el).transitionDuration) || 1;
    setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('is-in'); }, (t + 1.4) * 1000);
  }
  if (!('IntersectionObserver' in window) || reduce) {
    reveal.forEach(function (el) { el.removeAttribute('data-reveal'); });
    lights.forEach(function (el) { el.classList.add('is-lit'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.hasAttribute('data-reveal')) done(e.target);
        if (e.target.hasAttribute('data-light')) e.target.classList.add('is-lit');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    reveal.concat(lights).forEach(function (el) { io.observe(el); });
    /* failsafe: anything already above the fold after load, or anything a hidden tab never reported */
    window.addEventListener('load', function () {
      setTimeout(function () {
        reveal.concat(lights).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < innerHeight && r.bottom > 0) { if (el.hasAttribute('data-reveal')) done(el); el.classList.add('is-lit'); }
        });
      }, 1200);
    });
  }

  /* ---------- lantern: the card is lit where the pointer rests ---------- */
  if (!reduce) {
    d.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var el = e.target.closest && e.target.closest('[data-lantern]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- depth: framed pictures drift a little against the scroll (individual translate, never transform) ---------- */
  var depth = reduce ? [] : $$('[data-depth]');
  var hero = $('[data-hero]'), heroMedia = hero && $('.hero__media', hero), heroCopy = hero && $('[data-hero-copy]', hero);
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = innerHeight;
    depth.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.getAttribute('data-depth')) || 0;
      var c = r.top + r.height / 2 - vh / 2;
      el.style.translate = '0 ' + (c * k).toFixed(1) + 'px';
    });
    if (hero && !reduce) {
      var hr = hero.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -hr.top / hr.height));
      if (heroMedia) { heroMedia.style.scale = String(1 + p * 0.08); heroMedia.style.filter = 'brightness(' + (1 - p * 0.45).toFixed(3) + ')'; }
      if (heroCopy) { heroCopy.style.translate = '0 ' + (p * 70).toFixed(1) + 'px'; heroCopy.style.opacity = String(1 - p * 0.9); }
    }
  }
  function onScroll() { onScrollHdr(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- hero film: tier by width, phone cut on narrow portrait screens, pausable ---------- */
  var film = $('[data-film]');
  var filmBtn = $('[data-film-toggle]');
  if (film) {
    var cfg = {};
    try { cfg = JSON.parse(film.getAttribute('data-film')); } catch (e) {}
    var phone = cfg.phone && innerWidth < 760 && innerHeight > innerWidth;
    var dpr = window.devicePixelRatio || 1, need = innerWidth * dpr;
    var tiers = (cfg.tiers || []).slice().sort(function (a, b) { return a.w - b.w; });
    var pick = phone ? cfg.phone : (tiers.filter(function (t) { return t.w >= need * 0.9; })[0] || tiers[tiers.length - 1]);
    if (pick && !reduce) {
      if (phone && cfg.phone.poster) film.poster = cfg.phone.poster;
      film.src = pick.src;
      film.addEventListener('playing', function () { film.classList.add('is-on'); }, { once: true });
      var tryPlay = function () { var pr = film.play(); if (pr && pr.catch) pr.catch(function () {}); };
      if (d.readyState === 'complete') tryPlay(); else window.addEventListener('load', tryPlay, { once: true });
      var vio = 'IntersectionObserver' in window && new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (filmBtn && filmBtn.getAttribute('aria-pressed') === 'true') return; if (e.isIntersecting) tryPlay(); else film.pause(); });
      });
      if (vio) vio.observe(film);
      if (filmBtn) filmBtn.addEventListener('click', function () {
        var on = filmBtn.getAttribute('aria-pressed') === 'true';
        if (on) { tryPlay(); filmBtn.setAttribute('aria-pressed', 'false'); filmBtn.setAttribute('aria-label', 'Pause background film'); }
        else { film.pause(); filmBtn.setAttribute('aria-pressed', 'true'); filmBtn.setAttribute('aria-label', 'Play background film'); }
      });
    } else if (filmBtn) { filmBtn.hidden = true; }
  } else if (filmBtn) { filmBtn.hidden = true; }

  /* ---------- lightbox ---------- */
  var lb = $('[data-lightbox]');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('[data-lightbox-img]', lb), lbCap = $('[data-lightbox-cap]', lb), lbFrom = null;
    $$('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        lbFrom = b; lbImg.src = b.getAttribute('data-zoom'); lbImg.alt = b.getAttribute('data-zoom-alt') || '';
        lbCap.textContent = b.getAttribute('data-zoom-alt') || '';
        lb.showModal();
      });
    });
    $('[data-lightbox-close]', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (lbFrom) lbFrom.focus(); });
  } else {
    $$('[data-zoom]').forEach(function (b) { b.addEventListener('click', function () { window.open(b.getAttribute('data-zoom'), '_blank', 'noopener'); }); });
  }

  /* ---------- learn filters ---------- */
  var filters = $('[data-filters]'), list = $('[data-filter-list]');
  if (filters && list) {
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      var v = b.getAttribute('data-filter');
      $$('[data-filter]', filters).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.acard', list).forEach(function (c) {
        var show = !v || c.getAttribute('data-cat') === v;
        c.hidden = !show;
        if (show && c.hasAttribute('data-reveal')) done(c);
      });
    });
  }

  /* ---------- table of contents: mark the section in view ---------- */
  var toc = $$('.edu__toc a, .art__toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {};
    toc.forEach(function (a) { var id = decodeURIComponent(a.getAttribute('href').slice(1)); var el = d.getElementById(id); if (el) map[id] = a; });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && map[e.target.id]) { toc.forEach(function (a) { a.classList.remove('is-cur'); }); map[e.target.id].classList.add('is-cur'); } });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { tio.observe(d.getElementById(id)); });
  }

  /* ---------- preview forms never send ---------- */
  $$('[data-preview-form]').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); }); });
})();
