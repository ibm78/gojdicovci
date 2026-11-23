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
