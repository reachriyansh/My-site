(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function(v,a,b){return Math.min(b,Math.max(a,v))};

  // Split statement into words
  var st = document.getElementById('statementText');
  var words = st.textContent.trim().split(/\s+/);
  st.innerHTML = words.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
  var spans = st.querySelectorAll('.w');

  var intro = document.getElementById('intro');
  var statement = document.getElementById('statement');
  var copy = document.getElementById('introCopy');
  var hint = document.getElementById('hint');
  var trail = document.getElementById('trail');
  var plane = document.getElementById('plane');
  var len = trail.getTotalLength();
  trail.style.strokeDasharray = len;

  function progressOf(el){
    var r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  }

  function update(){

    // Intro: headline recedes, plane follows the route
    var p = progressOf(intro);
    var d = reduce ? 0 : p;
    copy.style.transform = 'scale('+(1 - d*.18)+') translateY('+(-d*40)+'px)';
    copy.style.opacity = reduce ? 1 : clamp(1 - p*1.5, 0, 1);
    hint.style.opacity = clamp(1 - p*6, 0, 1);
    var at = p * len;
    trail.style.strokeDashoffset = len - at;
    var pt = trail.getPointAtLength(at);
    var pt2 = trail.getPointAtLength(Math.min(len, at + 1));
    var ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    plane.setAttribute('transform', 'translate('+pt.x+' '+pt.y+') rotate('+ang+')');

    // Statement: light up word by word
    var s = progressOf(statement);
    var n = Math.round(clamp((s - .05) / .8, 0, 1) * spans.length);
    for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('on', i < n);
  }

  var ticking = false;
  addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(function(){ update(); ticking = false; }); }
  }, {passive:true});
  addEventListener('resize', update);
  update();

})();