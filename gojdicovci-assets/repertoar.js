const playerLink = document.querySelector('a.play');
  playerLink.target = '_top';
  function refreshPlayerLink() {
    const url = new URL(playerLink.href);
    url.searchParams.set('_open', Date.now().toString());
    playerLink.href = url.href;
  }
  for (const event of ['click', 'auxclick', 'contextmenu']) {
    playerLink.addEventListener(event, refreshPlayerLink);
  }
