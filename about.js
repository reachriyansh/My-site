// Put your GitHub username here to show your latest repositories.
var GITHUB_USER = 'reachriyansh';

var list = document.getElementById('repos');
var msg = document.getElementById('repoMsg');
var all = document.getElementById('ghAll');
all.href = 'https://github.com/' + GITHUB_USER;

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

if (GITHUB_USER === 'your-username') {
  msg.textContent = 'Set GITHUB_USER at the top of about.js to show your repositories here.';
} else {
  fetch('https://api.github.com/users/' + encodeURIComponent(GITHUB_USER) + '/repos?sort=updated&per_page=30')
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(repos){
      var top = repos.filter(function(r){ return !r.fork; }).slice(0, 6);
      if (!top.length) { msg.textContent = 'No public repositories yet.'; return; }
      list.innerHTML = top.map(function(r){
        return '<li><a href="' + esc(r.html_url) + '" rel="noopener"><h3>' + esc(r.name) + '</h3><p>' + esc(r.description || 'No description yet.') + '</p>' +
          '<span class="meta"><span>' + esc(r.language || 'Mixed') + '</span><span>★ ' + r.stargazers_count + '</span></span></a></li>';
      }).join('');
    })
    .catch(function(){ msg.textContent = 'Couldn’t load repositories right now. You can see them on GitHub.'; });
}
