// Sample notes: replace with your own. href can point to a PDF in this folder, e.g. "notes/limits.pdf".
var NOTES = [
  {t:'Epsilon–delta, made intuitive', s:'maths', d:'Why the definition of a limit looks the way it does, with pictures first and symbols second.', href:'#'},
  {t:'Groups and symmetry: a first look', s:'maths', d:'From rotations of a square to the axioms, and what they are good for.', href:'#'},
  {t:'Lagrangian mechanics from scratch', s:'physics', d:'Deriving the equations of motion from least action, with worked examples.', href:'#'},
  {t:'Hückel theory on one page', s:'chemistry', d:'Estimating π-electron energies of conjugated molecules with a small matrix.', href:'#'}
];
var LABEL = {maths:'Mathematics', physics:'Physics', chemistry:'Chemistry'};
var subject = 'all', query = '';
var list = document.getElementById('list'), empty = document.getElementById('empty');

function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

function render(){
  var q = query.toLowerCase();
  var shown = NOTES.filter(function(n){
    return (subject === 'all' || n.s === subject) && (n.t + ' ' + n.d).toLowerCase().indexOf(q) > -1;
  });
  list.innerHTML = shown.map(function(n){
    return '<li><a href="' + esc(n.href) + '"><h3>' + esc(n.t) + '</h3><p>' + esc(n.d) + '</p>' +
      '<span class="meta"><span><i class="dot ' + n.s + '"></i>' + LABEL[n.s] + '</span><span>Read note</span></span></a></li>';
  }).join('');
  empty.hidden = shown.length > 0;
}

document.querySelectorAll('.chip').forEach(function(b){
  b.addEventListener('click', function(){
    subject = b.dataset.s;
    document.querySelectorAll('.chip').forEach(function(c){ c.setAttribute('aria-pressed', c === b); });
    render();
  });
});
document.getElementById('q').addEventListener('input', function(e){ query = e.target.value; render(); });
render();