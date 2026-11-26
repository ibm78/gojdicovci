if (!window.__gojdicovciFresh && !window.__gojdicovciRefreshing && location.protocol!=='file:') {
  const loader=document.createElement('script');
  loader.src=new URL('fresh-assets.js?_fresh='+Date.now()+'-'+Math.random().toString(36).slice(2),document.currentScript.src).href;
  document.head.append(loader);
}

// Load the same icon font as the players, with a fresh URL on every opening.
// Keep the CSS-drawn icons if loading fails.
if (window.FontFace && document.fonts) {
  const fontUrl=new URL('webPlayer.ttf',document.currentScript.src);
  fontUrl.searchParams.set('_fresh',Date.now()+'-'+Math.random().toString(36).slice(2));
  const font=new FontFace('webPlayerRepertoire','url('+JSON.stringify(fontUrl.href)+')');
  font.load().then(loaded => {
    document.fonts.add(loaded);
    document.documentElement.classList.add('repertoire-font-ready');
  }).catch(error => console.warn('Gojdičovci: písmo ikon repertoára sa nenačítalo.',error));
}

for (const playerLink of document.querySelectorAll('a.play')) {
  // Google Sites blocks navigation of the parent tab from embedded cards.
  playerLink.target = window.self === window.top ? '_self' : '_blank';
  playerLink.rel = 'noopener';
  for (const event of ['click', 'auxclick', 'contextmenu']) {
    playerLink.addEventListener(event, () => {
      const url = new URL(playerLink.href);
      url.searchParams.set('_open', Date.now().toString());
      playerLink.href = url.href;
    });
  }
}
