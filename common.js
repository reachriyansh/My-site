(function(){
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Flight progress under the header
  var bar = document.getElementById('bar'), mini = document.getElementById('mini');
  function progress(){
    var max = document.documentElement.scrollHeight - innerHeight;
    var t = max > 0 ? scrollY / max : 0;
    bar.style.width = (t*100) + '%';
    mini.style.left = (t*100) + '%';
  }
  var ticking = false;
  addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(function(){ progress(); ticking = false; }); }
  }, {passive:true});
  addEventListener('resize', progress);
  progress();

  // Reveal on enter
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.2});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();

/* Language switcher: Google's website translator behind our own menu.
   Google's script loads only when someone picks a language (or already chose one earlier). */
(function(){
  var LANGS = [
    ['en','English','English'], ['hi','हिन्दी','Hindi'], ['te','తెలుగు','Telugu'], ['ta','தமிழ்','Tamil'],
    ['ml','മലയാളം','Malayalam'], ['or','ଓଡ଼ିଆ','Odia'], ['bn','বাংলা','Bengali'], ['mr','मराठी','Marathi'],
    ['gu','ગુજરાતી','Gujarati'], ['pa','ਪੰਜਾਬੀ','Punjabi'], ['kn','ಕನ್ನಡ','Kannada'], ['ur','اردو','Urdu'],
    ['fr','Français','French'], ['es','Español','Spanish'], ['de','Deutsch','German'], ['pt','Português','Portuguese'],
    ['it','Italiano','Italian'], ['nl','Nederlands','Dutch'], ['ru','Русский','Russian'], ['tr','Türkçe','Turkish'],
    ['ar','العربية','Arabic'], ['ja','日本語','Japanese'], ['ko','한국어','Korean'], ['zh-CN','中文（简体）','Chinese (Simplified)'],
    ['zh-TW','中文（繁體）','Chinese (Traditional)'], ['id','Bahasa Indonesia','Indonesian'], ['vi','Tiếng Việt','Vietnamese'], ['th','ไทย','Thai']
  ];
  var nav = document.querySelector('nav');
  if (!nav) return;

  // Names stay as written
  document.querySelectorAll('.brand,.intro h1').forEach(function(e){ e.setAttribute('translate','no'); e.classList.add('notranslate'); });

  function cookieLang(){ var m = document.cookie.match(/(?:^|; )googtrans=([^;]*)/); return m ? m[1].split('/').pop() : ''; }
  function clearCookie(){
    var past = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'googtrans=; ' + past;
    document.cookie = 'googtrans=; ' + past + '; domain=' + location.hostname;
    document.cookie = 'googtrans=; ' + past + '; domain=.' + location.hostname;
  }
  var cur = cookieLang() || 'en';

  // Button and panel
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'theme lang-btn'; btn.setAttribute('aria-label', 'Change language'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>';
  var th = document.getElementById('theme');
  if (th) th.after(btn); else nav.insertBefore(btn, nav.querySelector('.progress'));

  var panel = document.createElement('div');
  panel.className = 'lang-panel notranslate'; panel.setAttribute('translate', 'no');
  panel.innerHTML = '<div class="lang-grid">' + LANGS.map(function(l){
    return '<button type="button" data-l="' + l[0] + '"' + (l[0] === cur ? ' aria-current="true"' : '') + '><span>' + l[1] + '</span><small>' + l[2] + '</small></button>';
  }).join('') + '</div><p class="lang-note">Automatic translation by Google Translate. Some wording may not be perfect.</p>';
  document.body.appendChild(panel);
  var box = document.createElement('div'); box.id = 'gt-box'; box.className = 'gt-hidden'; document.body.appendChild(box);

  function toggle(open){
    var o = open === undefined ? !panel.classList.contains('open') : open;
    panel.classList.toggle('open', o); btn.setAttribute('aria-expanded', o);
  }
  btn.addEventListener('click', function(e){ e.stopPropagation(); toggle(); });
  document.addEventListener('click', function(e){ if (!panel.contains(e.target)) toggle(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') toggle(false); });

  // Google widget, loaded on demand
  var loading = false, ready = false, queue = [];
  function loadWidget(cb){
    if (ready){ cb && cb(); return; }
    if (cb) queue.push(cb);
    if (loading) return;
    loading = true;
    window.googleTranslateElementInit = function(){
      new google.translate.TranslateElement({
        pageLanguage: 'en', autoDisplay: false,
        includedLanguages: LANGS.map(function(l){ return l[0]; }).filter(function(c){ return c !== 'en'; }).join(',')
      }, 'gt-box');
      ready = true; queue.splice(0).forEach(function(f){ setTimeout(f, 250); });
    };
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.onerror = function(){ loading = false; };
    document.body.appendChild(s);
  }
  function whenCombo(cb, tries){
    var sel = document.querySelector('select.goog-te-combo');
    if (sel) cb(sel); else if (tries > 0) setTimeout(function(){ whenCombo(cb, tries - 1); }, 200);
  }

  function choose(code){
    toggle(false);
    if (code === cur) return;
    if (code === 'en'){ clearCookie(); location.reload(); return; }
    loadWidget(function(){
      whenCombo(function(sel){
        sel.value = code; sel.dispatchEvent(new Event('change'));
        cur = code;
        panel.querySelectorAll('[data-l]').forEach(function(b){ if (b.dataset.l === code) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      }, 15);
    });
  }
  panel.addEventListener('click', function(e){ var b = e.target.closest('[data-l]'); if (b) choose(b.dataset.l); });

  // Already chose a language on an earlier page: translate this one too
  if (cur !== 'en') loadWidget();
})();

/* Extras: skip link, mobile menu, Ctrl+K search, last-updated date, optional analytics */
(function(){
  var GOATCOUNTER = '';   // after making a free GoatCounter site, put its name here, e.g. 'riyansh'
  var nav = document.querySelector('nav'), menu = nav && nav.querySelector('.menu');

  var sk = document.createElement('a'); sk.className = 'skip'; sk.href = '#main'; sk.textContent = 'Skip to content'; document.body.prepend(sk);
  var m = document.querySelector('main'); if (m && !m.id) m.id = 'main';

  var up = document.getElementById('upd');
  if (up){ var d = new Date(document.lastModified); if (!isNaN(d)) up.textContent = d.toLocaleDateString('en', {month:'short', year:'numeric'}); }

  if (GOATCOUNTER){
    var g = document.createElement('script'); g.async = true; g.dataset.goatcounter = 'https://' + GOATCOUNTER + '.goatcounter.com/count'; g.src = 'https://gc.zgo.at/count.js'; document.body.appendChild(g);
  }
  if (!nav) return;

  // Mobile menu
  if (menu){
    menu.id = 'menu';
    var bg = document.createElement('button'); bg.type = 'button'; bg.className = 'theme burger';
    bg.setAttribute('aria-label', 'Menu'); bg.setAttribute('aria-expanded', 'false'); bg.setAttribute('aria-controls', 'menu');
    bg.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.insertBefore(bg, nav.querySelector('.progress'));
    var setMenu = function(o){ menu.classList.toggle('open', o); bg.setAttribute('aria-expanded', o); };
    bg.addEventListener('click', function(e){ e.stopPropagation(); setMenu(!menu.classList.contains('open')); });
    document.addEventListener('click', function(e){ if (!menu.contains(e.target)) setMenu(false); });
    menu.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  }

  // Search / command palette (Ctrl+K, Cmd+K or /)
  var PAGES = [['Intro','Home','index.html'], ['Notes','Maths, Physics, Chemistry','notes.html'], ['Journey','How I got here','journey.html'], ['Projects','Things I build','projects.html'],
    ['Lab','Particle showreel','lab.html'], ['About me','Who I am, my code','about.html'], ['Contact','Say hello','#contact'], ['CV','Download PDF','cv.pdf'],
    ['GitHub','reachriyansh','https://github.com/reachriyansh'], ['Privacy','How this site handles data','privacy.html']];
  var ACTIONS = [['Toggle dark mode','Appearance', function(){ var t = document.getElementById('theme'); if (t) t.click(); }],
    ['Change language','28 languages', function(){ var l = document.querySelector('.lang-btn'); if (l) setTimeout(function(){ l.click(); }, 60); }]];

  var pal = document.createElement('div'); pal.className = 'pal notranslate'; pal.setAttribute('translate', 'no');
  pal.innerHTML = '<div class="pal-box" role="dialog" aria-label="Search the site"><input type="text" placeholder="Search pages, notes, actions…" aria-label="Search"><ul></ul><p class="pal-hint">↑ ↓ to move · Enter to open · Esc to close</p></div>';
  document.body.appendChild(pal);
  var inp = pal.querySelector('input'), ul = pal.querySelector('ul'), shown = [], sel = 0;

  function items(){
    var a = PAGES.map(function(p){ return {t:p[0], s:p[1], go:function(){ location.href = p[2]; }}; });
    if (window.NOTES) NOTES.forEach(function(n){ a.push({t:n.t, s:'Note · Sem ' + n.sem, go:function(){ location.href = n.href; }}); });
    return a.concat(ACTIONS.map(function(x){ return {t:x[0], s:x[1], go:x[2]}; }));
  }
  function draw(){
    var q = inp.value.toLowerCase().trim();
    shown = items().filter(function(i){ return (i.t + ' ' + i.s).toLowerCase().indexOf(q) > -1; }).slice(0, 12);
    if (sel >= shown.length) sel = 0;
    ul.innerHTML = shown.length ? shown.map(function(i, k){ return '<li role="option" data-k="' + k + '" aria-selected="' + (k === sel) + '"><span>' + i.t.replace(/</g, '&lt;') + '</span><small>' + i.s + '</small></li>'; }).join('') : '<li><span>No matches</span></li>';
  }
  function open(o){ pal.classList.toggle('open', o); if (o){ inp.value = ''; sel = 0; draw(); setTimeout(function(){ inp.focus(); }, 30); } }
  function run(k){ var i = shown[k]; if (i){ open(false); i.go(); } }

  var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'theme'; sb.setAttribute('aria-label', 'Search the site');
  sb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  var th = document.getElementById('theme'); if (th) th.before(sb); else nav.insertBefore(sb, nav.querySelector('.progress'));
  sb.addEventListener('click', function(e){ e.stopPropagation(); open(true); });
  pal.addEventListener('click', function(e){ var li = e.target.closest('li[data-k]'); if (li) run(+li.dataset.k); else if (!e.target.closest('.pal-box')) open(false); });
  inp.addEventListener('input', function(){ sel = 0; draw(); });
  document.addEventListener('keydown', function(e){
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey)){ e.preventDefault(); open(!pal.classList.contains('open') || e.key === '/'); return; }
    if (!pal.classList.contains('open')) return;
    if (e.key === 'Escape') open(false);
    else if (e.key === 'ArrowDown'){ e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); draw(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
    else if (e.key === 'Enter'){ e.preventDefault(); run(sel); }
  });
})();
