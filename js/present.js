/* ============================================================
   PRESENT.JS — Modo apresentação (15 min, 6 apresentadores)
   · barra do apresentador com cronômetro por parte e total
   · passos (setas ← →) que levam de tela em tela
   · aviso "passa a vez" quando muda o apresentador
   · números que contam e gráficos que crescem ao entrar na tela
   ============================================================ */
(function () {
  'use strict';

  var PRES = [
    { n: 1, nome: 'Pedro dos Santos',  parte: 'Capa e contexto',                      s: 120 },
    { n: 2, nome: 'Pedro Henrique',   parte: 'Problema e metodologia',               s: 135 },
    { n: 3, nome: 'Kauan Henrique',   parte: 'Alfabetização',                        s: 150 },
    { n: 4, nome: 'Juliana Rabelo',   parte: 'Escolaridade e ensino médio',          s: 150 },
    { n: 5, nome: 'Guilherme Araújo', parte: 'Jovens, abandono e medidas',           s: 165 },
    { n: 6, nome: 'Daniel Cordeiro', parte: 'Resultados, conclusões e intervenção', s: 150 }
  ];
  var TOTAL_MAX = 900; /* 15 min */

  /* cada passo é uma "tela": [seletor, ancestral opcional] */
  var BEATS = [
    ['#hero'], ['#contexto'], ['#problema'], ['#plano'],
    ['#plotAnalf15', '.chart-frame'], ['#plotAnalf60', '.chart-frame'],
    ['#plotAnosEstudo', '.chart-pair'], ['#plotMedio', '.chart-frame'],
    ['#plotJovens', '.chart-frame'], ['#plotAbandono', '.chart-frame'],
    ['#medidas'], ['#plotBox1', '.chart-frame'],
    ['#sintese'], ['#plotGap', '.chart-frame'], ['#conclusoes'], ['#intervencao'], ['#referencias']
  ];

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmtT(sec) { sec = Math.max(0, Math.floor(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function $(id) { return document.getElementById(id); }

  /* ---------------- apresentador ---------------- */
  function initPresenter() {
    var bar = $('pbar'); if (!bar) return;
    var els = BEATS.map(function (b) { var e = document.querySelector(b[0]); if (e && b[1]) e = e.closest(b[1]); return e; });
    var pOf = function (el) { var s = el && el.closest('section[data-presenter]'); return s ? +s.dataset.presenter : 1; };
    var navH = function () { var n = $('navbar'); return n ? n.offsetHeight : 64; };
    var cur = 0, st = { running: false, t0: 0, acc: 0, partAcc: 0, partT0: Date.now(), pres: 1 };
    var toast = $('toastPass'), toastTimer = null;

    function totSec() { return st.running ? st.acc + (Date.now() - st.t0) / 1000 : st.acc; }
    function partSec() { return st.running ? st.partAcc + (Date.now() - st.partT0) / 1000 : st.partAcc; }

    function paint() {
      var pr = PRES[st.pres - 1], tot = totSec(), part = partSec();
      $('pNum').textContent = pr.n; $('pName').textContent = pr.nome; $('pPart').textContent = pr.parte;
      $('pPartT').textContent = fmtT(part); $('pPartMax').textContent = fmtT(pr.s); $('pTotT').textContent = fmtT(tot);
      var fp = $('pPartFill'), ft = $('pTotFill');
      fp.style.width = Math.min(100, part / pr.s * 100) + '%'; ft.style.width = Math.min(100, tot / TOTAL_MAX * 100) + '%';
      fp.className = part > pr.s ? 'is-over' : (part > pr.s * 0.85 ? 'is-warn' : '');
      ft.className = tot > TOTAL_MAX ? 'is-over' : (tot > TOTAL_MAX * 0.9 ? 'is-warn' : '');
    }

    function setPresenter(n, announce) {
      if (n === st.pres) return;
      if (st.running) { st.partAcc = 0; st.partT0 = Date.now(); } else { st.partAcc = 0; }
      st.pres = n;
      document.querySelectorAll('.agenda__row').forEach(function (r) { r.classList.toggle('is-now', +r.dataset.jump === n); });
      if (announce && toast) {
        toast.innerHTML = '<span>passa a vez</span><strong></strong><em></em>';
        toast.querySelector('strong').textContent = PRES[n - 1].nome; toast.querySelector('em').textContent = PRES[n - 1].parte;
        toast.classList.add('is-on'); clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2600);
      }
      paint();
    }

    function targetTop(el) {
      var r = el.getBoundingClientRect(), free = window.innerHeight - navH() - 72;
      var off = r.height < free ? (free - r.height) / 2 : 12;
      return r.top + window.scrollY - navH() - Math.max(12, off);
    }

    function toggleTimer(force) {
      var run = typeof force === 'boolean' ? force : !st.running;
      if (run === st.running) return;
      if (run) { st.t0 = Date.now(); st.partT0 = Date.now(); st.running = true; }
      else { st.acc += (Date.now() - st.t0) / 1000; st.partAcc += (Date.now() - st.partT0) / 1000; st.running = false; }
      var b = $('pPlay'); b.textContent = st.running ? '❚❚' : '▶';
      b.setAttribute('aria-label', st.running ? 'Pausar cronômetro' : 'Iniciar cronômetro'); paint();
    }
    function resetTimer() { st.running = false; st.acc = 0; st.partAcc = 0; $('pPlay').textContent = '▶'; paint(); }

    function go(i) {
      i = Math.max(0, Math.min(BEATS.length - 1, i));
      var el = els[i]; if (!el) return;
      cur = i;
      if (i > 0 && !st.running && st.acc === 0) toggleTimer(true);
      window.scrollTo({ top: Math.max(0, targetTop(el)), behavior: REDUCED ? 'auto' : 'smooth' });
      setPresenter(pOf(el), true);
    }

    /* acompanha rolagem manual: passo atual = último cujo topo passou de 45% da altura */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false; var y = window.innerHeight * 0.45, idx = 0;
        els.forEach(function (el, i) { if (el && el.getBoundingClientRect().top <= y) idx = i; });
        cur = idx; setPresenter(pOf(els[idx]), false);
      });
    }, { passive: true });

    $('pNext').addEventListener('click', function () { go(cur + 1); });
    $('pPrev').addEventListener('click', function () { go(cur - 1); });
    $('pPlay').addEventListener('click', function () { toggleTimer(); });
    $('pPlay').addEventListener('dblclick', resetTimer);
    document.querySelectorAll('.agenda__row').forEach(function (r) {
      r.addEventListener('click', function (e) {
        e.preventDefault(); var n = +r.dataset.jump, i = -1;
        els.forEach(function (el, k) { if (i < 0 && pOf(el) === n) i = k; });
        go(i < 0 ? 0 : i);
      });
    });
    document.querySelectorAll('.nav-link[data-p], .mobile-menu__link[data-p]').forEach(function (a) {
      a.addEventListener('click', function () {
        var n = +a.dataset.p, i = -1; els.forEach(function (el, k) { if (i < 0 && pOf(el) === n) i = k; });
        if (i >= 0) { cur = i; setPresenter(n, true); }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target && e.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA') return;
      var modal = document.querySelector('.detail.is-open'), menu = document.querySelector('.mobile-menu.is-open'), k = e.key;
      if (k === 'r' || k === 'R') {
        e.preventDefault();
        if (modal && modal.id === 'detail-roteiro') document.querySelector('[data-close="roteiro"]').click();
        else if (!modal) document.querySelector('[data-detail="roteiro"]').click();
        return;
      }
      if (modal || menu) return;
      if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(cur - 1); }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 't' || k === 'T') { toggleTimer(); }
      else if (k === 'p' || k === 'P') { bar.classList.toggle('is-hidden'); }
    });

    setInterval(paint, 500);
    var first = document.querySelector('.agenda__row'); if (first) first.classList.add('is-now');
    paint();
    window.EST_PRESENTER = { go: go, count: BEATS.length, state: st, toggle: toggleTimer, current: function () { return cur; } };
  }

  /* ---------------- números que contam ---------------- */
  function initCountUp() {
    var els = document.querySelectorAll('[data-count], .stat-card__value, .step__num');
    if (!els.length || REDUCED) return;
    function prep(el) {
      var txt = el.textContent, re = /\d+(?:,\d+)?/g, toks = [], m;
      while ((m = re.exec(txt))) toks.push({ i: m.index, s: m[0], v: parseFloat(m[0].replace(',', '.')), d: (m[0].split(',')[1] || '').length });
      el._c = { txt: txt, toks: toks }; return toks.length;
    }
    function render(el, f) {
      var c = el._c, out = '', last = 0;
      c.toks.forEach(function (t) { out += c.txt.slice(last, t.i) + (t.v * f).toFixed(t.d).replace('.', ','); last = t.i + t.s.length; });
      el.textContent = out + c.txt.slice(last);
    }
    function run(el) {
      var t0 = null;
      (function step(ts) {
        if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / 1000);
        render(el, 1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(step); else el.textContent = el._c.txt;
      })(performance.now());
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { if (prep(el)) io.observe(el); });
  }

  /* ---------------- gráficos que crescem ---------------- */
  function initChartGrow() {
    if (REDUCED || typeof Plotly === 'undefined') return;
    ['plotAnalf15', 'plotAnalf60', 'plotAnosEstudo', 'plotBasica', 'plotMedio', 'plotJovens', 'plotAbandono', 'plotGap'].forEach(function (id) {
      var gd = $(id); if (!gd || !gd.data) return;
      var idx = [], key = [];
      gd.data.forEach(function (tr, i) {
        var k = (tr.type === 'bar' && tr.orientation === 'h') ? 'x' : ((tr.type === 'bar' || tr.type === 'scatter') ? 'y' : null);
        if (k && tr[k] && tr[k].length) { idx.push(i); key.push(k); }
      });
      if (!idx.length) return;
      var orig = idx.map(function (i, j) { return gd.data[i][key[j]].slice(); });
      try {
        idx.forEach(function (i, j) {
          var up = {}; up[key[j]] = [orig[j].map(function (v) { return typeof v === 'number' ? 0 : v; })]; Plotly.restyle(gd, up, [i]);
        });
      } catch (e) { return; }
      var done = false, frame = gd.closest('.chart-frame') || gd;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting || done) return; done = true; io.disconnect();
          try {
            Plotly.animate(gd, { data: idx.map(function (i, j) { var o = {}; o[key[j]] = orig[j]; return o; }), traces: idx },
              { transition: { duration: 900, easing: 'cubic-out' }, frame: { duration: 900, redraw: true } });
          } catch (e) { idx.forEach(function (i, j) { var up = {}; up[key[j]] = [orig[j]]; Plotly.restyle(gd, up, [i]); }); }
        });
      }, { threshold: 0.4 });
      io.observe(frame);
    });
  }

  window.EST_PRESENT = { init: function () { initPresenter(); initCountUp(); } };
})();
