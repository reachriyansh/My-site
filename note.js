// Add your notes here, one line each.
//   sem  = semester number (3, 4, ...)
//   s    = maths | physics | chemistry
//   href = path to the PDF, e.g. 'notes/sem3/maths/epsilon-delta.pdf'
// The semester buttons are created automatically from the sem values below.
// These four are samples with '#' as the link: replace them with your own.
var NOTES = [
  {t:'Epsilon–delta, made intuitive', s:'maths', sem:3, d:'Why the definition of a limit looks the way it does, with pictures first and symbols second.', href:'#'},
  {t:'Groups and symmetry: a first look', s:'maths', sem:3, d:'From rotations of a square to the axioms, and what they are good for.', href:'#'},
  {t:'Electrodynamics', s:'physics', sem:3, d:'Physics of moving charges and the invisible fields they create.', href:'file:///C:/Users/Riyan/OneDrive/Documents/Image-Line/CODING/web%20dev/riyansh/Ed.pdf'},
  {t:'Hückel theory on one page', s:'chemistry', sem:3, d:'Estimating π-electron energies of conjugated molecules with a small matrix.', href:'#'}
];

var LABEL = {maths:'Mathematics', physics:'Physics', chemistry:'Chemistry'};
var state = {sem:'all', s:'all', q:''};
var list = document.getElementById('list'), empty = document.getElementById('empty');

function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

function makeChips(el, items, key){
  el.innerHTML = items.map(function(it){
    return '<button class="chip" data-v="' + it[0] + '" aria-pressed="' + (it[0] === 'all') + '">' + it[1] + '</button>';
  }).join('');
  el.addEventListener('click', function(e){
    var b = e.target.closest('.chip');
    if (!b) return;
    state[key] = b.dataset.v;
    el.querySelectorAll('.chip').forEach(function(c){ c.setAttribute('aria-pressed', c === b); });
    render();
  });
}

function item(n){
  return '<li><a href="' + esc(n.href) + '"><h3>' + esc(n.t) + '</h3><p>' + esc(n.d) + '</p>' +
    '<span class="meta"><span><i class="dot ' + n.s + '"></i>' + LABEL[n.s] + '</span><span>Sem ' + n.sem + '</span></span></a></li>';
}

function render(){
  var q = state.q.toLowerCase();
  var shown = NOTES.filter(function(n){
    return (state.sem === 'all' || String(n.sem) === state.sem) &&
           (state.s === 'all' || n.s === state.s) &&
           (n.t + ' ' + n.d).toLowerCase().indexOf(q) > -1;
  });
  var html = '', last = null;
  // Newest semester first, grouped under headings
  shown.slice().sort(function(a, b){ return b.sem - a.sem; }).forEach(function(n){
    if (n.sem !== last){ html += '<li class="group"><h2>Semester ' + n.sem + '</h2></li>'; last = n.sem; }
    html += item(n);
  });
  list.innerHTML = html;
  empty.hidden = shown.length > 0;
}

var sems = NOTES.map(function(n){ return n.sem; })
  .filter(function(v, i, a){ return a.indexOf(v) === i; })
  .sort(function(a, b){ return b - a; });
makeChips(document.getElementById('semChips'), [['all','All semesters']].concat(sems.map(function(s){ return [String(s), 'Sem ' + s]; })), 'sem');
makeChips(document.getElementById('subChips'), [['all','All subjects'],['maths','Mathematics'],['physics','Physics'],['chemistry','Chemistry']], 's');
document.getElementById('q').addEventListener('input', function(e){ state.q = e.target.value; render(); });
render();