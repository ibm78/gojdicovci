const playerLink = document.querySelector('a.play');
// Google Sites sandboxes its embeds and blocks navigation of the parent tab.
playerLink.target = window.self === window.top ? '_self' : '_blank';
playerLink.rel = 'noopener';

function refreshPlayerLink() {
  const url = new URL(playerLink.href);
  url.searchParams.set('_open', Date.now().toString());
  playerLink.href = url.href;
}

for (const event of ['click', 'auxclick', 'contextmenu']) {
  playerLink.addEventListener(event, refreshPlayerLink);
}
