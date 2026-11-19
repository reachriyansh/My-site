// Edit these stops: when = small label, t = title, d = description. Add or remove freely.
var JOURNEY = [
  {when:'Before IISER', t:'Where it started', d:'Add the beginning here: what first pulled you towards planes, maths and science.'},
  {when:'BS-MS at IISER Bhopal', t:'Maths, with Physics and Chemistry', d:'Started the BS-MS programme, with a pre-major in Mathematics, Physics and Chemistry.'},
  {when:'Semesters 1 and 2', t:'The first year', d:'Add what you learned and enjoyed most, and what surprised you.'},
  {when:'Semester 3 · now', t:'Writing, building, sharing', d:'Writing notes in LaTeX, building this site, and starting projects in Python.'},
  {when:'Next', t:'Semester 4 and beyond', d:'A Fourier tool that splits sound into its sine waves, terrain mapping for Earth research, and more notes.'}
];

function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

var tl = document.getElementById('tl');
var box = document.getElementById('stops');
box.innerHTML = JOURNEY.map(function(s){
  return '<div class="stop"><div class="when">' + esc(s.when) + '</div><h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p></div>';
}).join('');
var stops = box.children;

function update(){
  var r = tl.getBoundingClientRect(), mark = innerHeight * 0.55;
  var p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
  tl.style.setProperty('--p', p);
  for (var i = 0; i < stops.length; i++){
    stops[i].classList.toggle('on', stops[i].getBoundingClientRect().top < mark);
  }
}
var ticking = false;
addEventListener('scroll', function(){
  if (!ticking){ ticking = true; requestAnimationFrame(function(){ update(); ticking = false; }); }
}, {passive:true});
addEventListener('resize', update);
update();