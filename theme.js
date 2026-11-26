// Runs in <head> so the saved theme is applied before the page paints (no flash).
(function(){
  var root = document.documentElement, KEY = 'theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function(){
    var b = document.getElementById('theme');
    if (!b) return;
    function sync(){
      var d = root.getAttribute('data-theme') === 'dark';
      b.setAttribute('aria-pressed', d);
      b.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode');
    }
    sync();
    b.addEventListener('click', function(){
      var d = root.getAttribute('data-theme') !== 'dark';
      root.setAttribute('data-theme', d ? 'dark' : 'light');
      try { localStorage.setItem(KEY, d ? 'dark' : 'light'); } catch (e) {}
      sync();
    });
  });
})();
