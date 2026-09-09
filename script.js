/* ==========================================================================
   AAI-E-MC1-S01-READ01 — screen sequencing, prediction recall, check tally
   No browser storage: the learner's typed answer lives in memory only.
   ========================================================================== */

(function(){
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var i = 0;
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var fill = document.getElementById('fill');
  var count = document.getElementById('count');
  var dots = document.getElementById('dots');
  var ECHO_STEP = 7;

  steps.forEach(function(s, n){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Screen ' + (n + 1));
    b.addEventListener('click', function(){ go(n); });
    dots.appendChild(b);
  });

  function pad(n){ return (n < 10 ? '0' : '') + n; }

  function go(n){
    i = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach(function(s, k){
      var on = k === i;
      s.classList.toggle('on', on);
      if (on) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
    });
    Array.prototype.forEach.call(dots.children, function(b, k){
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
    fill.style.width = ((i + 1) / steps.length * 100) + '%';
    count.textContent = pad(i + 1) + ' / ' + pad(steps.length);
    prev.disabled = i === 0;
    next.textContent = i === steps.length - 1 ? 'Start again' : 'Next';
    if (i === ECHO_STEP) { echo(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev.addEventListener('click', function(){ go(i - 1); });
  next.addEventListener('click', function(){ go(i === steps.length - 1 ? 0 : i + 1); });

  document.addEventListener('keydown', function(e){
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });

  var pred = document.getElementById('pred');
  var echoWrap = document.getElementById('echoWrap');
  var echoEl = document.getElementById('echo');
  var noEcho = document.getElementById('noEcho');
  function echo(){
    var v = pred && pred.value.trim();
    if (v) {
      echoEl.textContent = v;
      echoWrap.removeAttribute('hidden');
      noEcho.setAttribute('hidden', '');
    } else {
      echoWrap.setAttribute('hidden', '');
      noEcho.removeAttribute('hidden');
    }
  }
  if (pred) {
    pred.addEventListener('keydown', function(e){ if (e.key === 'Enter') go(i + 1); });
  }

  var chkLists = Array.prototype.slice.call(document.querySelectorAll('.chk'));
  chkLists.forEach(function(list){
    var tally = list.parentNode.querySelector('[data-tally]');
    if (!tally) return;
    var doneLabel = tally.getAttribute('data-done-label') || '';
    list.addEventListener('change', function(){
      var boxes = list.querySelectorAll('input');
      var done = list.querySelectorAll('input:checked').length;
      tally.textContent = done === boxes.length
        ? 'All ' + boxes.length + ' checked' + (doneLabel ? ' ' + doneLabel : '')
        : done + ' of ' + boxes.length + ' checked';
      tally.classList.toggle('done', done === boxes.length);
    });
  });

  go(0);
})();
