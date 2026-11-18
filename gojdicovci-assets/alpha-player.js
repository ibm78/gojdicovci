'use strict';

(() => {
  const byId = id => document.getElementById(id);
  const modifiedTime = byId('player-modified');
  if (modifiedTime) {
    modifiedTime.removeAttribute('datetime');
    modifiedTime.textContent = 'Načítavam…';
    const readModifiedTime = async () => {
      try {
        let value;
        if (location.protocol === 'file:') {
          value = document.lastModified;
        } else {
          const response = await fetch(location.href, {
            method:'HEAD',cache:'no-cache',signal:AbortSignal.timeout(10000)
          });
          if (!response.ok) throw new Error('HTTP '+response.status);
          value = response.headers.get('Last-Modified');
        }
        const date = value ? new Date(value) : null;
        if (!date || !Number.isFinite(date.getTime())) throw new Error('Chýba dátum súboru.');
        modifiedTime.dateTime = date.toISOString();
        modifiedTime.textContent = new Intl.DateTimeFormat('sk-SK', {
          dateStyle:'medium',timeStyle:'medium',timeZone:'Europe/Bratislava'
        }).format(date);
      } catch {
        modifiedTime.removeAttribute('datetime');
        modifiedTime.textContent = 'Údaj nie je dostupný';
      }
    };
    readModifiedTime();
    window.addEventListener('pageshow', event => {
      if (event.persisted) readModifiedTime();
    });
  }
  const controls = document.querySelector('.controls');
  controls.classList.add('at-controls');
  controls.innerHTML = `
    <div class="at-toolbar">
      <button id="play" type="button" disabled>Načítavam…</button>
      <button id="reset" type="button" data-ready disabled>⏹ Zastaviť</button>
      <button type="button" data-close-player>Ukončiť</button>
      <output id="at-time">0:00 / 0:00</output>
    </div>
    <div class="at-position">
      <label for="position">Poloha</label>
      <input id="position" type="range" min="0" max="1" value="0" step="1" data-ready disabled>
      <output id="bar">Takt 1</output>
    </div>
    <div class="at-options">
      <label>Tempo <input id="tempo" type="range" min="10" max="300" value="100" step="5"><output id="speed">100 %</output></label>
      <label>Celková hlasitosť <input id="at-master" type="range" min="0" max="100" value="100"></label>
      <label>Transpozícia zvuku <input id="at-transpose" type="number" min="-24" max="24" value="0" step="1"> poltónov</label>
    </div>
    <details open><summary>Hlasy a stopy</summary>
      <div id="at-groups" class="at-toolbar" aria-label="Zobrazené hlasy"></div>
      <div id="mixer" class="at-track-list"></div>
    </details>
    <details><summary>Opakovanie a rytmus</summary>
      <div class="at-options">
        <label><input id="at-loop" type="checkbox"> Opakovať prehrávanie</label>
        <label>Od taktu <input id="at-range-from" type="number" min="1" value="1" data-ready disabled></label>
        <label>Po takt <input id="at-range-to" type="number" min="1" value="1" data-ready disabled></label>
        <button id="at-range-apply" type="button" data-ready disabled>Použiť rozsah</button>
        <button id="at-range-clear" type="button" data-ready disabled>Celá skladba</button>
        <label>Metronóm <input id="at-metronome" type="range" min="0" max="100" value="0"></label>
        <label>Odpočítanie pred štartom <input id="at-count-in" type="range" min="0" max="100" value="0"></label>
      </div>
    </details>
    <details><summary>Zobrazenie partitúry</summary>
      <div class="at-options">
        <label>Rozloženie <select id="at-layout"><option value="Page" selected>Riadky</option><option value="Horizontal">Vodorovne</option><option value="Parchment">Súvislá stránka</option></select></label>
        <label>Zväčšenie <select id="at-zoom"><option value="0.5">50 %</option><option value="0.75">75 %</option><option value="1" selected>100 %</option><option value="1.25">125 %</option><option value="1.5">150 %</option><option value="2">200 %</option></select></label>
        <label>Takty na riadku <input id="at-bars-row" type="number" min="-1" max="16" value="-1" step="1"><small>−1 = automaticky</small></label>
        <label>Posúvanie <select id="at-scroll"><option value="OffScreen" selected>Keď noty zmiznú z okna</option><option value="Continuous">Priebežne</option><option value="Smooth">Plynulo</option><option value="Off">Vypnuté</option></select></label>
        <label><input id="at-cursor" type="checkbox" checked> Kurzor prehrávania</label>
        <label><input id="at-animated" type="checkbox" checked> Plynulý pohyb kurzora</label>
        <label><input id="at-highlight" type="checkbox" checked> Červené zvýrazňovanie</label>
        <label><input id="at-lyrics" type="checkbox" checked> Text piesne</label>
        <label><input id="at-interaction" type="checkbox" checked> Výber úseku a kliknutie do nôt</label>
        <button id="at-cursor-now" type="button" data-ready disabled>Ukázať aktuálne noty</button>
      </div>
    </details>
    <details><summary>Zvuk a export</summary>
      <div class="at-options">
        <button id="at-devices-load" type="button" data-ready disabled>Vyhľadať zvukové výstupy</button>
        <label>Zvukový výstup <select id="at-device" disabled><option>Predvolený výstup</option></select></label>
        <button id="at-midi" type="button" data-ready disabled>Stiahnuť MIDI</button>
        <button id="at-print" type="button" data-ready disabled>Tlačiť noty</button>
      </div>
    </details>
    <p id="error" role="status" hidden></p>`;
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
  byId('speed').textContent = '100 % · '+bpm+' BPM';
  const libraryRoot = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.8.3/dist/';
  const api = new alphaTab.AlphaTabApi(byId('alpha-score'), {
    core:{fontDirectory:libraryRoot+'font/',scriptFile:libraryRoot+'alphaTab.min.js',engine:'svg'},
    display:{staveProfile:alphaTab.StaveProfile.Score,layoutMode:alphaTab.LayoutMode.Page},
    notation:{elements:new Map([[alphaTab.NotationElement.EffectTempo,false]])},
    player:{
      enablePlayer:true,soundFont:libraryRoot+'soundfont/sonivox.sf2',
      enableCursor:true,enableElementHighlighting:true,
      enableUserInteraction:true,enableSeekToClick:true,
      scrollElement:document.querySelector('.sheet'),
      scrollMode:alphaTab.ScrollMode.OffScreen
    }
  });
  api.error.on(cause => {
    showError('alphaTab nedokázal načítať partitúru alebo zvuk. Obnovte stránku.');
    console.warn('Gojdičovci: alphaTab',cause);
  });
  const sheet = document.querySelector('.sheet');
  sheet.tabIndex = -1;
  let focusOnNextBeat = false;
  function focusScore() {
    sheet.focus({preventScroll:true});
    sheet.scrollIntoView({block:'start',inline:'nearest'});
    api.scrollToCursor();
  }
  // Follow the current beat even when a single bar is wider than the viewport.
  api.playedBeatChanged.on(beat => {
    if (beat && focusOnNextBeat) {
      focusOnNextBeat = false;
      focusScore();
    }
    if (!beat || api.settings.player.scrollMode === alphaTab.ScrollMode.Off) return;
    const bounds = api.boundsLookup?.findBeat(beat);
    if (!bounds || !sheet.clientWidth || sheet.scrollWidth <= sheet.clientWidth) return;
    const left = sheet.getBoundingClientRect().left + sheet.clientLeft;
    const x = byId('alpha-score').getBoundingClientRect().left + bounds.onNotesX;
    const margin = Math.min(40,sheet.clientWidth*.12);
    if (x >= left+margin && x <= left+sheet.clientWidth-margin) return;
    sheet.scrollLeft = Math.max(0,sheet.scrollLeft+x-left-sheet.clientWidth*.25);
  });
  let initialScore;
  const trackStates = [];
  function showTracks() {
    const selected = trackStates.filter(state => state.visible.checked).map(state => state.track);
    if (!selected.length) {
      showError('Vyberte aspoň jednu stopu na zobrazenie.');
      return;
    }
    error.hidden = true;
    for (const button of byId('at-groups').querySelectorAll('[data-group]')) {
      const shown = trackStates.filter(state => state.group === button.dataset.group).every(state => state.visible.checked);
      button.setAttribute('aria-pressed',String(shown));
    }
    api.renderTracks(selected);
  }
  function applyMix() {
    for (const state of trackStates) {
      api.changeTrackVolume([state.track],Number(state.volume.value)/100);
      api.changeTrackMute([state.track],state.mute.checked);
      api.changeTrackSolo([state.track],state.solo.checked);
    }
    if (api.score) api.changeTrackTranspositionPitch(api.score.tracks,Number(byId('at-transpose').value));
  }
  api.scoreLoaded.on(score => {
    if (score.tracks.length !== order.length) {
      showError('Počet hlasov alphaTab nesúhlasí s exportom MIDI.');
      return;
    }
    if (score === initialScore) return;
    initialScore = score;
    score.tracks.forEach(track => {
      track.playbackInfo.program = 0;
      track.playbackInfo.volume = 12;
    });
    byId('mixer').replaceChildren();
    byId('at-groups').replaceChildren();
    trackStates.length = 0;
    score.tracks.forEach((track,index) => {
      const row = document.createElement('div');
      row.className = 'at-track';
      row.setAttribute('role','group');
      row.setAttribute('aria-label',track.name || 'Stopa '+(index+1));
      row.innerHTML = '<strong></strong><label><input type="checkbox" data-visible checked> Noty</label><label>Hlasitosť <input type="range" data-volume min="0" max="100" value="75"></label><label><input type="checkbox" data-mute> Stíšiť</label><label><input type="checkbox" data-solo> Solo</label>';
      row.querySelector('strong').textContent = track.name || 'Stopa '+(index+1);
      const state = {track,group:order[index],visible:row.querySelector('[data-visible]'),
        volume:row.querySelector('[data-volume]'),mute:row.querySelector('[data-mute]'),solo:row.querySelector('[data-solo]')};
      trackStates.push(state);
      state.visible.onchange = () => {
        if (!trackStates.some(item => item.visible.checked)) state.visible.checked = true;
        showTracks();
      };
      state.volume.oninput = state.mute.onchange = state.solo.onchange = applyMix;
      byId('mixer').append(row);
    });
    ['Soprán','Alt','Tenor','Bas'].forEach((name,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.group = 'SATB'[index];
      button.setAttribute('aria-pressed','true');
      button.textContent = 'Noty '+name;
      button.onclick = () => {
        const group = trackStates.filter(state => state.group === 'SATB'[index]);
        const visible = !group.every(state => state.visible.checked);
        if (!visible && trackStates.every(state => state.group === 'SATB'[index] || !state.visible.checked)) return;
        group.forEach(state => {state.visible.checked = visible;});
        showTracks();
      };
      byId('at-groups').append(button);
    });
    byId('at-range-from').max = byId('at-range-to').max = score.masterBars.length;
    byId('at-range-to').value = score.masterBars.length;
  });
  api.playerReady.on(() => {
    if (!api.isReadyForPlayback || !api.score?.masterBars.length) return;
    play.disabled = floatingPlay.disabled = false;
    play.textContent = 'Prehrať';
    byId('position').max = api.endTick;
    for (const element of controls.querySelectorAll('[data-ready]')) element.disabled = false;
    applyMix();
  });
  api.playerStateChanged.on(event => {
    const playing = event.state === alphaTab.synth.PlayerState.Playing;
    play.textContent = playing?'Pozastaviť':'Prehrať';
    floatingPlay.textContent = playing?'⏸':'▶';
    floatingPlay.setAttribute('aria-label',play.textContent);
    floatingPlay.title = play.textContent;
    if (playing) {
      byId('floating-controls').hidden = false;
      focusOnNextBeat = true;
      focusScore();
    } else {
      focusOnNextBeat = false;
    }
  });
  const toggle = () => {
    error.hidden = true;
    api.playPause();
  };
  play.onclick = floatingPlay.onclick = toggle;
  byId('reset').onclick = () => {
    if (!api.isReadyForPlayback || !api.score?.masterBars.length) return;
    api.stop();
    api.scrollToCursor();
  };
  byId('previous-bar').onclick = () => {
    const bars = api.score?.masterBars;
    if (!api.isReadyForPlayback || !bars?.length) return;
    const index = bars.findLastIndex(bar => bar.start <= api.tickPosition);
    api.tickPosition = bars[Math.max(0,index-1)].start;
    api.scrollToCursor();
  };
  byId('position').oninput = event => {
    if (!api.isReadyForPlayback || !api.score?.masterBars.length) return;
    api.tickPosition = Number(event.target.value);
    api.scrollToCursor();
  };
  byId('tempo').oninput = event => {
    api.playbackSpeed = Number(event.target.value)/100;
    byId('speed').textContent = event.target.value+' % · '+Math.round(bpm*api.playbackSpeed)+' BPM';
  };
  api.playerPositionChanged.on(event => {
    const bars = api.score?.masterBars;
    if (!bars?.length) return;
    byId('position').value = event.currentTick;
    const index = bars.findLastIndex(bar => bar.start <= event.currentTick);
    byId('bar').textContent = 'Takt '+(index+1)+' / '+bars.length;
    const format = milliseconds => {
      const seconds = Math.floor(milliseconds/1000);
      return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    };
    byId('at-time').textContent = format(event.currentTime)+' / '+format(event.endTime);
  });
  byId('at-master').oninput = event => {api.masterVolume = Number(event.target.value)/100;};
  byId('at-transpose').onchange = () => {
    if (!byId('at-transpose').checkValidity()) return;
    applyMix();
  };
  byId('at-loop').onchange = event => {api.isLooping = event.target.checked;};
  byId('at-metronome').oninput = event => {api.metronomeVolume = Number(event.target.value)/100;};
  byId('at-count-in').oninput = event => {api.countInVolume = Number(event.target.value)/100;};
  byId('at-range-apply').onclick = () => {
    const bars = api.score?.masterBars;
    if (!bars?.length) return;
    const from = Number(byId('at-range-from').value)-1;
    const to = Number(byId('at-range-to').value)-1;
    if (!Number.isInteger(from) || !Number.isInteger(to) || from<0 || to<from || to>=bars.length) {
      showError('Zadajte platný rozsah taktov od začiatku po koniec.');
      return;
    }
    error.hidden = true;
    api.playbackRange = {startTick:bars[from].start,endTick:bars[to+1]?.start ?? api.endTick};
    api.tickPosition = bars[from].start;
  };
  byId('at-range-clear').onclick = () => {api.playbackRange = null;};
  api.playbackRangeChanged.on(event => {
    const bars = api.score?.masterBars;
    if (!bars?.length || !event.playbackRange) return;
    byId('at-range-from').value = 1+bars.findLastIndex(bar => bar.start<=event.playbackRange.startTick);
    byId('at-range-to').value = 1+bars.findLastIndex(bar => bar.start<event.playbackRange.endTick);
  });
  function updateDisplay() {
    api.settings.display.layoutMode = alphaTab.LayoutMode[byId('at-layout').value];
    api.settings.display.scale = Number(byId('at-zoom').value);
    api.settings.display.barsPerRow = Number(byId('at-bars-row').value);
    api.settings.player.scrollMode = alphaTab.ScrollMode[byId('at-scroll').value];
    api.settings.player.enableCursor = byId('at-cursor').checked;
    api.settings.player.enableAnimatedBeatCursor = byId('at-animated').checked;
    api.settings.player.enableElementHighlighting = byId('at-highlight').checked;
    api.settings.player.enableUserInteraction = byId('at-interaction').checked;
    api.settings.notation.elements.set(alphaTab.NotationElement.EffectLyrics,byId('at-lyrics').checked);
    api.updateSettings();
    api.render();
  }
  for (const id of ['at-layout','at-zoom','at-bars-row','at-scroll','at-cursor','at-animated','at-highlight','at-interaction','at-lyrics']) {
    byId(id).onchange = updateDisplay;
  }
  byId('at-cursor-now').onclick = () => api.scrollToCursor();
  byId('at-midi').onclick = () => api.downloadMidi();
  byId('at-print').onclick = () => api.print();
  let devices = [];
  byId('at-devices-load').onclick = async () => {
    try {
      devices = await api.enumerateOutputDevices();
      const select = byId('at-device');
      select.replaceChildren();
      for (const [index,device] of devices.entries()) {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = device.label || 'Výstup '+(index+1);
        select.append(option);
      }
      select.disabled = !devices.length;
    } catch (cause) {
      showError('Tento prehliadač nesprístupnil výber zvukového výstupu.');
      console.warn(cause);
    }
  };
  byId('at-device').onchange = async event => {
    try { await api.setOutputDevice(devices[Number(event.target.value)]); }
    catch (cause) {showError('Zvukový výstup sa nepodarilo zmeniť.');console.warn(cause);}
  };
  api.load(new TextEncoder().encode(musicXml),[...order].map((_,index) => index));
})();
