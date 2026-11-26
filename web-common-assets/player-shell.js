'use strict';

(() => {
  function mount() {
    const root=document.getElementById('player-v1-root');
    if (!root || root.dataset.shellReady==='1') return;
    const data=JSON.parse(document.getElementById('song-data').textContent);
    const source=document.getElementById('player-score-source');
    if (!source) throw Error('Chýba partitúra skladby.');
    // Only the fixed structure is HTML. Song metadata is inserted as text.
    root.innerHTML=`
<section id="nacvik"><h3></h3>
<div class="controls">
<div class="control-row"><button id="play" disabled data-i18n="play"></button><button type="button" data-close-player data-i18n="close"></button><button id="reset" data-i18n="reset"></button><label for="tempo" data-i18n="tempo"></label><input id="tempo" type="range" min="50" max="150" value="100" step="5"><output id="speed" for="tempo"></output></div>
<div class="control-row"><label for="position" data-i18n="position"></label><input id="position" type="range" min="0" step=".01" value="0"><output id="bar" for="position"></output></div>
<p id="player-sound"></p><div id="mixer" class="mixer" role="group" data-i18n-aria="mixer"></div>
<p id="error" role="status" hidden></p>
</div>
<p id="player-seek-hint"></p>
<div class="sheet" data-i18n-aria="score"></div>
</section>
<footer id="player-dates"><small><time id="player-modified"></time><br><time id="player-loaded"></time></small></footer>`;
    root.querySelector('h3').textContent=data.title ?? document.title;
    if (data.composer) {
      const author=document.createElement('p');author.textContent=data.composer;
      root.querySelector('h3').after(author);
    }
    const duration=Number(data.duration);
    root.querySelector('#position').max=String(Number.isFinite(duration) ? duration : Math.max(0,...data.tracks.flatMap(track=>track.map(note=>note[1]))));
    root.querySelector('.sheet').append(...source.childNodes);
    source.remove();
    if (data.pianoSamples?.length) {
      const paragraph=document.createElement('p'),link=document.createElement('a');
      link.href='web-common-assets/klavir/LICENCIA.md';link.target='_blank';link.rel='noopener';link.dataset.i18n='pianoLicense';
      paragraph.append(link);root.querySelector('footer').before(paragraph);
    }
    const floating=document.createElement('div');
    floating.id='floating-controls';floating.hidden=true;floating.setAttribute('role','group');floating.dataset.i18nAria='playbackControls';
    floating.innerHTML='<button type="button" data-close-player data-i18n-aria="close" data-i18n-title="close">×</button><button id="previous-bar" type="button" data-i18n-aria="previousBar" data-i18n-title="previousBar">⏴</button><button id="floating-play" type="button" disabled data-i18n-aria="play" data-i18n-title="play">▶</button>';
    root.after(floating);
    root.dataset.shellReady='1';
  }
  window.GojdicovciV1Shell={mount};
  mount();
})();
