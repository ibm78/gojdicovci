'use strict';

(() => {
  function mount() {
    const root=document.getElementById('repertoire-root');
    if (!root || root.dataset.shellReady==='1') return;
    const data=JSON.parse(document.getElementById('repertoire-data').textContent);
    const linkUrl=value=>{
      const url=new URL(value,location.href);
      if (!['https:','http:','file:'].includes(url.protocol)) throw Error('Neplatný odkaz skladby.');
      return url.href;
    };
    // Validate every link before inserting a partially built card.
    const pdf=linkUrl(data.pdf),player=linkUrl(data.player),playerAlpha=linkUrl(data.playerAlpha);
    root.innerHTML=`<article aria-labelledby="repertoire-song-title">
<div class="song-info"><h2 id="repertoire-song-title"></h2></div>
<nav>
<a data-download aria-label="Stiahnuť PDF" title="Stiahnuť PDF"><span class="icon download-icon" aria-hidden="true"></span></a>
<a class="play versioned-play" target="_blank" rel="noopener" aria-label="Ukáž a prehraj – v1" title="Ukáž a prehraj – v1"><span class="icon play-icon" aria-hidden="true"></span><span class="player-version" aria-hidden="true">v1</span></a>
<a class="play alpha-play versioned-play" target="_blank" rel="noopener" aria-label="Ukáž a prehraj v alphaTab – v2" title="Ukáž a prehraj v alphaTab – v2"><span class="icon play-icon" aria-hidden="true"></span><span class="player-version" aria-hidden="true">v2</span></a>
</nav></article>`;
    root.querySelector('h2').textContent=data.title;
    root.querySelector('nav').setAttribute('aria-label',data.title);
    if (data.composer) {
      const author=document.createElement('p');author.textContent=data.composer;
      root.querySelector('.song-info').append(author);
    }
    const download=root.querySelector('[data-download]');
    download.href=pdf;download.download=data.pdfName;
    root.querySelector('a.play:not(.alpha-play)').href=player;
    root.querySelector('a.alpha-play').href=playerAlpha;
    root.dataset.shellReady='1';
  }
  window.GojdicovciRepertoireShell={mount};
  mount();
})();
