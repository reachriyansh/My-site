/* Lab: ~4000 particles that morph between the things I care about.
   Plane -> benzene -> DNA -> Fourier sum -> galaxy -> terrain -> Lorenz attractor.
   Plain Canvas 2D with a hand-written 3D projection, no libraries. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = matchMedia('(pointer: coarse)').matches || innerWidth < 700;
  var N = small ? 1800 : 4200, CH = 7, TAU = Math.PI * 2;
  var reel = document.getElementById('reel'), cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  var stage = document.getElementById('stage'), hint = document.getElementById('hint');
  var chaps = document.querySelectorAll('.chap'), dots = document.querySelectorAll('.dots i');
  var W, H, DPR, S, cx, cy;
  var rnd = Math.random;
  function gauss(){ return (rnd() + rnd() + rnd() - 1.5) * 0.8; }
  function pick(w){ var r = rnd(), s = 0; for (var i = 0; i < w.length; i++){ s += w[i]; if (r < s) return i; } return w.length - 1; }

  function resize(){
    DPR = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W * (small ? .5 : .56); cy = H * (small ? .4 : .41); S = Math.min(W / 3.6, H / 2.4);
  }

  /* ---------- Shapes: each is a Float32Array of N points (x,y,z) ---------- */
  function build(fn){ var a = new Float32Array(N * 3); for (var i = 0; i < N; i++){ var p = fn(i); a[i*3] = p[0]; a[i*3+1] = p[1]; a[i*3+2] = p[2]; } return a; }

  // Airliner (A380-style: upper-deck bulge, four engines, winglets), nose towards +x
  function fus(t){ return t > .9 ? .105 * Math.sqrt(Math.max(0, 1 - Math.pow((t - .9) / .6, 2))) : t < -.7 ? .105 * (1 - .8 * Math.pow((-.7 - t) / .8, 1.3)) : .105; }
  function planeShape(){
    var lead = function(s){ return .25 - .75 * s; }, chord = function(s){ return .55 - .33 * s; };
    return build(function(){
      var part = pick([.2, .06, .3, .03, .14, .08, .07, .12]), s, a, t, r, sg = rnd() < .5 ? -1 : 1;
      if (part === 0){ t = -1.5 + rnd() * 3; r = fus(t); a = rnd() * TAU; return [t, r * Math.cos(a) * .95, r * Math.sin(a)]; }
      if (part === 1){ t = -.75 + Math.floor(rnd() * 30) * .052; r = fus(t) * 1.02; return [t + gauss() * .004, r * Math.cos(1.15), sg * r * Math.sin(1.15)]; }
      if (part === 2){ s = rnd(); return [lead(s) - rnd() * chord(s), -.03 + .09 * s + gauss() * .004, sg * (.09 + s * 1.15)]; }
      if (part === 3){ return [lead(1) - rnd() * .2, .06 + rnd() * .16, sg * 1.24]; }
      if (part === 4){ var ez = (rnd() < .5 ? .38 : .72), xl = lead((ez - .09) / 1.15) + .14; a = rnd() * TAU;
        if (rnd() < .25){ r = Math.sqrt(rnd()) * .062; return [xl, -.14 + r * Math.cos(a), sg * ez + r * Math.sin(a)]; }
        return [xl - rnd() * .32, -.14 + .062 * Math.cos(a), sg * ez + .062 * Math.sin(a)]; }
      if (part === 5){ s = rnd(); return [-1 - .3 * s - rnd() * (.28 - .14 * s), .03, sg * (.04 + s * .45)]; }
      if (part === 6){ s = rnd(); return [-.95 - .38 * s - rnd() * (.38 - .22 * s), .09 + s * .42, gauss() * .008]; }
      t = -.1 + rnd() * 1.1; r = .12 * Math.sqrt(Math.max(0, 1 - Math.pow((t - .4) / .6, 2))); a = rnd() * TAU;
      return [t, .04 + r * Math.cos(a) * .9, r * Math.sin(a) * .9];
    });
  }

  // DNA double helix with base-pair rungs, tilted for style
  function dnaShape(){
    var turns = 2.8, len = .8, rad = .32, rot = .4, cs = Math.cos(rot), sn = Math.sin(rot);
    function put(x, y, z){ return [x * cs - y * sn, x * sn + y * cs, z]; }
    return build(function(){
      var part = pick([.5, .3, .2]), y, ph, k, u;
      if (part === 0){ y = -len + rnd() * 2 * len; ph = y / len * turns * Math.PI + (rnd() < .5 ? 0 : Math.PI);
        return put(rad * Math.cos(ph) + gauss() * .012, y, rad * Math.sin(ph) + gauss() * .012); }
      y = -len + Math.floor(rnd() * 23) * (2 * len / 22); ph = y / len * turns * Math.PI;
      if (part === 1){ u = 1 - 2 * rnd(); return put(rad * u * Math.cos(ph), y + gauss() * .006, rad * u * Math.sin(ph)); }
      k = rnd() < .5 ? 0 : Math.PI;
      return put(rad * Math.cos(ph + k) + gauss() * .035, y + gauss() * .035, rad * Math.sin(ph + k) + gauss() * .035);
    });
  }

  // Spiral galaxy: bulge plus three logarithmic-style arms
  function galaxyShape(){
    return build(function(){
      var r, a, b;
      if (rnd() < .22){ r = Math.abs(gauss()) * .35; a = rnd() * TAU; b = Math.acos(2 * rnd() - 1); return [r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * .6, r * Math.sin(b) * Math.sin(a)]; }
      r = Math.pow(rnd(), .62) * 1.5 + .12; a = ((rnd() * 3) | 0) * TAU / 3 + r * 2.6 + gauss() * (.18 + .2 * r);
      return [r * Math.cos(a), gauss() * .05 * (1.2 - r / 1.5), r * Math.sin(a)];
    });
  }

  function benzeneShape(){
    var R = .8, ang = function(i){ return i * Math.PI / 3; };
    function C(i){ return [R * Math.cos(ang(i)), R * Math.sin(ang(i))]; }
    return build(function(){
      var part = pick([.34, .12, .22, .12, .2]), i = (rnd() * 6) | 0, c = C(i), u = rnd(), a, b, d;
      if (part === 0) return [c[0] + gauss() * .08, c[1] + gauss() * .08, gauss() * .08];
      if (part === 1) return [c[0] * 1.75 + gauss() * .05, c[1] * 1.75 + gauss() * .05, gauss() * .05];
      if (part === 2){ b = C((i + 1) % 6); return [c[0] + (b[0] - c[0]) * u + gauss() * .012, c[1] + (b[1] - c[1]) * u + gauss() * .012, gauss() * .012]; }
      if (part === 3){ i = ((rnd() * 3) | 0) * 2; c = C(i); b = C((i + 1) % 6); u = .15 + rnd() * .7; d = .78;
        return [(c[0] + (b[0] - c[0]) * u) * d, (c[1] + (b[1] - c[1]) * u) * d, gauss() * .012]; }
      return [c[0] * (1 + .75 * u * .8) + gauss() * .012, c[1] * (1 + .75 * u * .8) + gauss() * .012, gauss() * .012];
    });
  }

  // Terrain: layered contour-style heightfield
  function H2(x, z){ var h = .32 * Math.sin(1.4 * x + 1) * Math.cos(1.1 * z) + .2 * Math.sin(2.9 * x - 1.3 * z + 2) + .1 * Math.sin(5.3 * x + 4.1 * z) + .05 * Math.sin(9.7 * x - 7.1 * z);
    return Math.pow(Math.max(0, h + .35), 1.35) * 1.15 - .45; }
  function terrainShape(){
    return build(function(){ var x = -1.4 + rnd() * 2.8, z = -.95 + rnd() * 1.9, y = H2(x, z) * .85;
      if (rnd() < .45) y = Math.round(y * 9) / 9 + gauss() * .004; return [x, y, z]; });
  }

  // Lorenz attractor integrated with RK4
  function lorenzShape(){
    var x = 1, y = 1, z = 1, dt = .006, pts = [], s = 10, r = 28, b = 8 / 3;
    function f(x, y, z){ return [s * (y - x), x * (r - z) - y, x * y - b * z]; }
    for (var i = 0; i < N + 400; i++){
      var k1 = f(x, y, z), k2 = f(x + dt/2*k1[0], y + dt/2*k1[1], z + dt/2*k1[2]), k3 = f(x + dt/2*k2[0], y + dt/2*k2[1], z + dt/2*k2[2]), k4 = f(x + dt*k3[0], y + dt*k3[1], z + dt*k3[2]);
      x += dt/6*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0]); y += dt/6*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1]); z += dt/6*(k1[2] + 2*k2[2] + 2*k3[2] + k4[2]);
      if (i >= 400) pts.push([x * .05, (z - 25) * .05, y * .05]);
    }
    return build(function(i){ return pts[i]; });
  }

  // Fourier: stacked odd harmonics on the left of each row add up to a square wave on top
  var wPart = new Uint8Array(N), wU = new Float32Array(N), tw = new Float32Array(N * 3);
  for (var q = 0; q < N; q++){ wPart[q] = pick([.12, .12, .12, .12, .12, .4]); wU[q] = rnd(); }
  function waveTarget(t){
    for (var i = 0; i < N; i++){
      var x = -1.5 + 3 * wU[i], ph = 2.1 * x - t * 1.3, k = wPart[i], y, z;
      if (k === 5){ var sum = 0; for (var j = 0; j < 5; j++) sum += Math.sin((2 * j + 1) * ph) / (2 * j + 1); y = .34 + .2 * (4 / Math.PI) * sum; z = 0; }
      else { var m = 2 * k + 1; y = -.04 - .15 * k + .12 * (4 / Math.PI) / m * Math.sin(m * ph); z = (k - 2) * .12; }
      tw[i*3] = x; tw[i*3+1] = y; tw[i*3+2] = z;
    }
    return tw;
  }

  /* ---------- State ---------- */
  var shapes = [], px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N), ease = new Float32Array(N);
  var sx = new Float32Array(N), sy = new Float32Array(N), ss = new Float32Array(N);
  for (var i = 0; i < N; i++){ var a1 = rnd() * TAU, a2 = Math.acos(2 * rnd() - 1), r0 = 2.4 + rnd();
    px[i] = r0 * Math.sin(a2) * Math.cos(a1); py[i] = r0 * Math.sin(a2) * Math.sin(a1); pz[i] = r0 * Math.cos(a2); ease[i] = reduce ? 1 : .022 + rnd() * .06; }
  var PITCH = [.22, .5, .12, .12, .95, .6, .25];
  var t = 0, trans = 0, cur = -1, yaw = 0, pitch = 0, mx = 0, my = 0, mpx = -999, mpy = -999, pulse = null, visible = true, ready = false, lastDark = null;

  function setChapter(c){
    cur = c; trans = 1; if (c > 0) hint.classList.add('off');
    chaps.forEach(function(e, i){ e.classList.toggle('on', i === c); });
    dots.forEach(function(e, i){ e.classList.toggle('on', i === c); });
  }

  /* ---------- Input ---------- */
  function move(e){
    var r = stage.getBoundingClientRect(); mpx = e.clientX - r.left; mpy = e.clientY - r.top;
    mx = (mpx / W - .5) * 2; my = (mpy / H - .5) * 2;
    stage.style.setProperty('--mx', mpx + 'px'); stage.style.setProperty('--my', mpy + 'px');
  }
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerleave', function(){ mpx = mpy = -999; });
  stage.addEventListener('pointerdown', function(e){ move(e); if (!reduce) pulse = {x: mpx, y: mpy, a: 0}; hint.classList.add('off'); });
  new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }).observe(reel);

  /* ---------- Frame ---------- */
  function frame(){
    requestAnimationFrame(frame);
    if (!visible || document.hidden || !ready) return;
    t += .016;
    var rect = reel.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, -rect.top / (rect.height - H)));
    var c = Math.min(CH - 1, Math.floor(p * CH + 1e-4));
    if (c !== cur) setChapter(c);
    trans *= .965;

    var T = c === 3 ? waveTarget(t) : shapes[c];
    var spin = c === 3 ? Math.sin(t * .6) * .4 : c === 5 ? t * .12 : t * .28;
    var yawT = reduce ? 0 : spin + mx * .4, dy = yawT - yaw;
    dy -= TAU * Math.round(dy / TAU); yaw += dy * .05;
    pitch += (PITCH[c] - my * .15 - pitch) * .05;
    var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);

    for (var i = 0; i < N; i++){
      var k = ease[i], i3 = i * 3;
      px[i] += (T[i3] - px[i]) * k; py[i] += (T[i3 + 1] - py[i]) * k; pz[i] += (T[i3 + 2] - pz[i]) * k;
      if (trans > .02 && !reduce){ var w = trans * .02; px[i] += Math.sin(i * .37 + t * 3) * w; py[i] += Math.cos(i * .53 + t * 2.4) * w; pz[i] += Math.sin(i * .21 + t * 2) * w; }
      var x1 = px[i] * cyw + pz[i] * syw, z1 = -px[i] * syw + pz[i] * cyw;
      var y2 = py[i] * cp - z1 * sp, z2 = py[i] * sp + z1 * cp;
      var sc = 4.2 / (4.2 - z2); if (sc < .3) sc = .3;
      var X = cx + x1 * S * sc, Y = cy - y2 * S * sc;
      if (mpx > -900){ var ddx = X - mpx, ddy = Y - mpy, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 14400 && d2 > 1){ var d = Math.sqrt(d2), f = (1 - d / 120); f *= f * 46; X += ddx / d * f; Y += ddy / d * f; } }
      if (pulse){ var px2 = X - pulse.x, py2 = Y - pulse.y, dd = Math.sqrt(px2 * px2 + py2 * py2) + .01, band = Math.abs(dd - pulse.a * 14);
        if (band < 70){ var g = (1 - band / 70) * 34 * (1 - pulse.a / 70); X += px2 / dd * g; Y += py2 / dd * g; } }
      sx[i] = X; sy[i] = Y; ss[i] = sc;
    }
    if (pulse && ++pulse.a > 70) pulse = null;

    // Dark: glowing additive particles. Light: solid gold, ink and red particles on white.
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(' + (dark ? '10,10,11' : '255,255,255') + ',' + ((reduce || dark !== lastDark) ? 1 : (dark ? .2 : .26)) + ')';
    ctx.fillRect(0, 0, W, H); lastDark = dark;
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    var cols = dark ? ['rgba(212,168,90,.9)', 'rgba(255,240,205,.9)', 'rgba(229,38,47,.9)'] : ['rgba(160,120,50,.95)', 'rgba(29,29,31,.85)', 'rgba(215,25,33,.9)'];
    var lim = [N * .7 | 0, N * .86 | 0, N];
    var base = (small ? 1.5 : 1.7) * (dark ? 1 : 1.3), i0 = 0;
    for (var b = 0; b < 3; b++){ ctx.fillStyle = cols[b];
      for (var j = i0; j < lim[b]; j++){ var s = base * ss[j]; ctx.fillRect(sx[j] - s / 2, sy[j] - s / 2, s, s); } i0 = lim[b]; }
  }

  /* ---------- Go ---------- */
  var track = document.querySelector('.track'); if (track) track.innerHTML += track.innerHTML;
  resize(); addEventListener('resize', resize);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function(){
    shapes = [planeShape(), benzeneShape(), dnaShape(), null, galaxyShape(), terrainShape(), lorenzShape()];
    ready = true;
  });
  frame();
})();
