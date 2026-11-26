'use strict';

(() => {
  function mount() {
    const root=document.getElementById('player-v2-root');
    if (!root || root.dataset.shellReady==='1') return;
    const data=JSON.parse(document.getElementById('alpha-data').textContent);
    // Static structure only. The control sections are built by alpha-player.js.
    root.innerHTML=`
<section id="nacvik"><h3></h3>
<div class="controls"><p id="error" role="status" hidden></p></div>
<p id="player-seek-hint"></p>
<div class="sheet alpha-sheet" data-i18n-aria="score"><div id="alpha-score"></div></div>
</section>
<p><a href="web-common-assets/alphatab/LICENSE" target="_blank" rel="noopener" data-i18n="alphaLicense"></a> · <a href="web-common-assets/alphatab/soundfont/LICENSE" target="_blank" rel="noopener" data-i18n="alphaSoundLicense"></a></p>
<footer id="player-dates"><small><time id="player-modified"></time><br><time id="player-loaded"></time></small></footer>`;
    root.querySelector('h3').textContent=data.title ?? document.title;
    if (data.composer) {
      const author=document.createElement('p');author.textContent=data.composer;
      root.querySelector('h3').after(author);
    }
    const floating=document.createElement('div');
    floating.id='floating-controls';floating.hidden=true;floating.setAttribute('role','group');floating.dataset.i18nAria='playbackControls';
    floating.innerHTML='<button type="button" data-close-player data-i18n-aria="close" data-i18n-title="close">×</button><button id="previous-bar" type="button" data-i18n-aria="previousBar" data-i18n-title="previousBar">⏴</button><button id="floating-play" type="button" disabled data-i18n-aria="play" data-i18n-title="play">▶</button>';
    root.after(floating);
    root.dataset.shellReady='1';
  }
  window.GojdicovciV2Shell={mount};
  mount();
})();
