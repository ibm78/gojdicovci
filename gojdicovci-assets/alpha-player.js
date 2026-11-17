'use strict';

(() => {
  const byId = id => document.getElementById(id);
  const error = byId('error');
  const play = byId('play');
  const floatingPlay = byId('floating-play');
  const showError = message => {
    error.hidden = false;
    error.textContent = message;
  };
  for (const button of document.querySelectorAll('[data-close-player]')) {
    button.addEventListener('click', () => window.close());
  }
  const loadedTime = byId('player-loaded');
  const updateLoadTime = () => {
    const date = new Date();
    loadedTime.dateTime = date.toISOString();
    loadedTime.textContent = new Intl.DateTimeFormat('sk-SK', {
      dateStyle:'medium',timeStyle:'medium',timeZone:'Europe/Bratislava'
    }).format(date);
  };
  updateLoadTime();
  window.addEventListener('pageshow', event => {
    if (event.persisted) updateLoadTime();
  });

  play.disabled = floatingPlay.disabled = true;
  play.textContent = 'Načítavam…';
  if (!window.alphaTab) {
    showError('Knižnica alphaTab sa nenačítala. Skontrolujte internetové pripojenie a obnovte stránku.');
    return;
  }
  const {musicXml,order,bpm} = JSON.parse(byId('alpha-data').textContent);
  const libraryRoot = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.8.3/dist/';
  const api = new alphaTab.AlphaTabApi(byId('alpha-score'), {
    core:{fontDirectory:libraryRoot+'font/',scriptFile:libraryRoot+'alphaTab.min.js',engine:'svg'},
    display:{staveProfile:alphaTab.StaveProfile.Score},
    player:{
      enablePlayer:true,soundFont:libraryRoot+'soundfont/sonivox.sf2',
      enableCursor:true,enableElementHighlighting:true,
      enableUserInteraction:true,enableSeekToClick:true,
      scrollMode:alphaTab.ScrollMode.OffScreen
    }
  });
  api.error.on(cause => {
    showError('alphaTab nedokázal načítať partitúru alebo zvuk. Obnovte stránku.');
    console.warn('Gojdičovci: alphaTab',cause);
  });
  api.scoreLoaded.on(score => {
    if (score.tracks.length !== order.length) {
      showError('Počet hlasov alphaTab nesúhlasí s exportom MIDI.');
      return;
    }
    score.tracks.forEach(track => {
      track.playbackInfo.program = 0;
      track.playbackInfo.volume = 12;
    });
    if (byId('mixer').childElementCount) return;
    ['Soprán','Alt','Tenor','Bas'].forEach((name,index) => {
      const tracks = score.tracks.filter((track,i) => order[i] === 'SATB'[index]);
      const row = document.createElement('div');
      row.className = 'voice';
      row.innerHTML = '<label for="voice'+index+'">'+name+'</label><input id="voice'+index+'" type="range" min="0" max="100" value="75"><button type="button" aria-pressed="false">Stíšiť</button>';
      const volume = row.querySelector('input'), button = row.querySelector('button');
      button.setAttribute('aria-label','Stíšiť '+name);
      let muted = false;
      volume.oninput = () => api.changeTrackVolume(tracks,Number(volume.value)/100);
      button.onclick = () => {
        muted = !muted;
        api.changeTrackMute(tracks,muted);
        button.setAttribute('aria-pressed',String(muted));
        button.setAttribute('aria-label',(muted?'Zapnúť ':'Stíšiť ')+name);
        button.textContent = muted?'Zapnúť':'Stíšiť';
      };
      byId('mixer').append(row);
    });
  });
  api.playerReady.on(() => {
    play.disabled = floatingPlay.disabled = false;
    play.textContent = 'Prehrať';
    byId('position').max = api.endTick;
  });
  api.playerStateChanged.on(event => {
    const playing = event.state === alphaTab.synth.PlayerState.Playing;
    play.textContent = playing?'Pozastaviť':'Prehrať';
    floatingPlay.textContent = playing?'⏸':'▶';
    floatingPlay.setAttribute('aria-label',play.textContent);
    floatingPlay.title = play.textContent;
    if (playing) byId('floating-controls').hidden = false;
  });
  const toggle = () => {
    error.hidden = true;
    api.playPause();
    if (api.playerState === alphaTab.synth.PlayerState.Playing) {
      document.querySelector('.sheet').scrollIntoView({block:'start'});
      api.scrollToCursor();
    }
  };
  play.onclick = floatingPlay.onclick = toggle;
  byId('reset').onclick = () => {
    api.tickPosition = 0;
    api.scrollToCursor();
  };
  byId('previous-bar').onclick = () => {
    const index = api.score.masterBars.findLastIndex(bar => bar.start <= api.tickPosition);
    api.tickPosition = api.score.masterBars[Math.max(0,index-1)].start;
    api.scrollToCursor();
  };
  byId('position').oninput = event => {
    api.tickPosition = Number(event.target.value);
    api.scrollToCursor();
  };
  byId('tempo').oninput = event => {
    api.playbackSpeed = Number(event.target.value)/100;
    byId('speed').textContent = event.target.value+' % · '+Math.round(bpm*api.playbackSpeed)+' BPM';
  };
  api.playerPositionChanged.on(event => {
    byId('position').value = event.currentTick;
    const index = api.score.masterBars.findLastIndex(bar => bar.start <= event.currentTick);
    byId('bar').textContent = 'Takt '+(index+1)+' / '+api.score.masterBars.length;
  });
  api.load(new TextEncoder().encode(musicXml),[...order].map((_,index) => index));
})();
