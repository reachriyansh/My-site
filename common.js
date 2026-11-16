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