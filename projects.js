// Add or edit projects here. status: 'Live' | 'Built' | 'Building' | 'Planned' | 'Idea'. link is optional.
var PROJECTS = [
  {t:'This website', status:'Live', d:'Hand-written HTML, CSS and JavaScript: scroll animations, a particle Lab, notes by semester, live GitHub repos, dark mode and 28 languages.', tags:['HTML','CSS','JavaScript'], link:'https://github.com/reachriyansh/My-site'},
  {t:'Space and time visualiser', status:'Built', d:'A Python tool that lets you see things moving in 3D space over time.', tags:['Python','3D','Visualisation']},
  {t:'Fourier sound analyser', status:'Building', d:'Breaks any sound into its constituent sine waves and amplitudes, then rebuilds it and shows a spectrogram.', tags:['Python','NumPy','SciPy']},
  {t:'Terrain for Earth research', status:'Planned', d:'3D terrain models from elevation data, with slope, drainage and change-over-time layers.', tags:['Python','GIS','3D']},
  {t:'Calmer store redesign', status:'Idea', d:'A less crowded redesign of an online shopping flow, written up as a design case study.', tags:['UX','HTML','CSS']}
];
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
document.getElementById('cards').innerHTML = PROJECTS.map(function(p){
  var el = p.link ? 'a href="' + esc(p.link) + '" rel="noopener"' : 'div', end = p.link ? 'a' : 'div';
  return '<' + el + ' class="card"><span class="status s-' + p.status.toLowerCase() + '">' + p.status + '</span><h3>' + esc(p.t) + '</h3><p>' + esc(p.d) +
    '</p><div class="tags">' + p.tags.map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' + (p.link ? '<span class="go">View code →</span>' : '') + '</' + end + '>';
}).join('');
