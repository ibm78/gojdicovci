'use strict';

(() => {
  if (!window.__gojdicovciFresh && !window.__gojdicovciRefreshing && location.protocol!=='file:') {
    const script=document.createElement('script');
    const root=document.currentScript?.src || new URL('web-common-assets/player-i18n.js',location.href).href;
    script.src=new URL('fresh-assets.js?_fresh='+Date.now()+'-'+Math.random().toString(36).slice(2),root).href;
    document.head.append(script);
  }
  // Texty oboch prehrávačov upravujte tu. Výrazy v {zátvorkách} zachovajte.
  const messages = {
    play: 'Prehrať',
    pause: 'Pozastaviť',
    close: 'Ukončiť',
    downloadPdf: 'Stiahnuť PDF',
    reset: 'Od začiatku',
    stop: '⏹ Zastaviť',
    previousBar: 'Predchádzajúci takt',
    previousThreeBars: 'Dozadu o 3 takty',
    jumpToBar: 'Preskočiť do taktu',
    barField: 'Takt',
    cancel: 'Zrušiť',
    setBar: 'Nastav takt',
    invalidBar: 'Zadajte celé číslo taktu od 1.',
    jumpToCurrentBar: 'Takt {current}. Preskočiť do taktu',
    playSymbol: '▶',
    pauseSymbol: '⏸',
    closeSymbol: '×',
    previousSymbol: '⏴',
    loading: 'Načítavam…',
    startingAudio: 'Spúšťam zvuk…',
    unavailable: 'Údaj nie je dostupný',
    documentTitle: '{title} · Nácvik SATB',
    tempo: 'Tempo',
    position: 'Poloha',
    bar: 'Takt {current}',
    barCount: 'Takt {current} / {total}',
    tempoValue: '{percent} % · {bpm} BPM',
    percent: '{value} %',
    timePosition: '{current} / {total}',
    score: 'Partitúra',
    mixer: 'Hlasitosť hlasov',
    playbackControls: 'Ovládanie prehrávania',
    modifiedDate: 'Posledná úprava notového zápisu',
    loadedDate: 'Načítanie obsahu z vyrovnávacej pamäte internetového prehliadača',
    soprano: 'Soprán',
    alto: 'Alt',
    tenor: 'Tenor',
    bass: 'Bas',
    track: 'Stopa {number}',
    trackName: '{voice} {number}',
    mute: 'Stíšiť',
    unmute: 'Zapnúť',
    muteVoice: 'Stíšiť {voice}',
    unmuteVoice: 'Zapnúť {voice}',
    volume: 'Hlasitosť',
    notes: 'Noty',
    solo: 'Solo',
    soloV1: 'Sólo',
    soloVoice: 'Prehrať sólo {voice}',
    exitSoloVoice: 'Zrušiť sólo {voice}',
    voiceNotes: 'Noty {voice}',
    visibleVoices: 'Zobrazené hlasy',
    voicesAndTracks: 'Hlasy a stopy',
    masterVolume: 'Celková hlasitosť',
    transpose: 'Transpozícia zvuku',
    semitones: 'poltónov',
    repeatAndRhythm: 'Opakovanie a rytmus',
    loop: 'Opakovať prehrávanie',
    fromBar: 'Od taktu',
    toBar: 'Po takt',
    applyRange: 'Použiť rozsah',
    wholeSong: 'Celá skladba',
    metronome: 'Metronóm',
    countIn: 'Odpočítanie pred štartom',
    scoreDisplay: 'Zobrazenie partitúry',
    layout: 'Rozloženie',
    layoutPage: 'Riadky',
    layoutHorizontal: 'Vodorovne',
    layoutParchment: 'Súvislá stránka',
    zoom: 'Zväčšenie',
    barsPerRow: 'Takty na riadku',
    automaticBars: '−1 = automaticky',
    scrolling: 'Posúvanie',
    scrollOffScreen: 'Keď noty zmiznú z okna',
    scrollContinuous: 'Priebežne',
    scrollSmooth: 'Plynulo',
    scrollOff: 'Vypnuté',
    cursor: 'Kurzor prehrávania',
    animatedCursor: 'Plynulý pohyb kurzora',
    highlighting: 'Červené zvýrazňovanie',
    lyrics: 'Text piesne',
    scoreInteraction: 'Výber úseku a kliknutie do nôt',
    showCurrentNotes: 'Ukázať aktuálne noty',
    soundAndExport: 'Zvuk a export',
    findAudioOutputs: 'Vyhľadať zvukové výstupy',
    audioOutput: 'Zvukový výstup',
    defaultAudioOutput: 'Predvolený výstup',
    audioOutputNumber: 'Výstup {number}',
    downloadMidi: 'Stiahnuť MIDI',
    printScore: 'Tlačiť noty',
    soundPiano: 'Zvuk: Grand Piano',
    soundTriangle: 'Zvuk: trojuholníkový signál',
    pianoLicense: 'Licencia zvuku Grand Piano',
    alphaLicense: 'Licencia alphaTab',
    alphaSoundLicense: 'Licencia klavírneho zvuku',
    seekNotes: 'Prejdite na iný takt kliknutím na označenú notu alebo posuvníkom Poloha.',
    seekPosition: 'Prejdite na iný takt posuvníkom Poloha.',
    errorAudioStart: 'Zvuk sa nepodarilo spustiť. Skúste stlačiť Prehrať znova.',
    errorAudioOutputStart: 'Zvukový výstup sa nespustil.',
    errorAudioInterrupted: 'Zvukový výstup bol prerušený.',
    errorPianoSample: 'Klavírna vzorka: HTTP {status}',
    errorAlphaLibrary: 'Knižnica alphaTab sa nenačítala. Skontrolujte internetové pripojenie a obnovte stránku.',
    errorAlphaLoad: 'alphaTab nedokázal načítať partitúru alebo zvuk. Obnovte stránku.',
    errorTrackCount: 'Počet hlasov alphaTab nesúhlasí s exportom MIDI.',
    errorSelectTrack: 'Vyberte aspoň jednu stopu na zobrazenie.',
    errorRange: 'Zadajte platný rozsah taktov od začiatku po koniec.',
    errorAudioOutputs: 'Tento prehliadač nesprístupnil výber zvukového výstupu.',
    errorAudioOutputChange: 'Zvukový výstup sa nepodarilo zmeniť.',
    logAudioStart: 'Gojdičovci: štart prehrávania zlyhal.',
    logAlpha: 'Gojdičovci: alphaTab'
  };
  const locale = 'sk-SK';
  const timeZone = 'Europe/Bratislava';
  const text = (key, values = {}) => (messages[key] ?? key).replace(
    /\{(\w+)\}/g, (match,name) => values[name] === undefined ? match : String(values[name]));
  const html = (key, values) => text(key,values).replace(/[&<>"']/g, character =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[character]);
  const voiceNames = () => ['soprano','alto','tenor','bass'].map(key => text(key));
  const iconCodes = {'▶':'a','⏸':'b','⏴':'c','⏮':'d','⏹':'e','×':'f','↓':'g','⏱':'h','🔊':'i','🔇':'j','◎':'k','✎':'l'};
  const iconHtml = symbol => '<span class="web-player-icon" data-font-code="'+iconCodes[symbol]+'" aria-hidden="true">'+symbol+'</span>';
  function setIcon(target,symbol) {
    const span=document.createElement('span');
    span.className='web-player-icon';
    span.dataset.fontCode=iconCodes[symbol] ?? '';
    span.textContent=symbol;
    span.setAttribute('aria-hidden','true');
    target.replaceChildren(span);
  }
  function setLabeledIcon(target,symbol,label) {
    setIcon(target,symbol);
    const caption=document.createElement('span');
    caption.className='web-player-label';
    caption.textContent=label;
    target.append(document.createTextNode(' '),caption);
    target.setAttribute('aria-label',label);
  }
  function loadIconFont() {
    if (!document.fonts?.load) return;
    document.fonts.load('16px "webPlayer"','abcdefghijkl').then(fonts => {
      if (fonts.length) document.documentElement.classList.add('web-player-font-ready');
    }).catch(() => {}); // Original symbols remain available if the font cannot load.
  }
  function updateBarJump(current) {
    const button=document.getElementById('floating-bar');
    if (!button) return;
    button.textContent=String(current);
    button.title=text('jumpToBar');
    button.setAttribute('aria-label',text('jumpToCurrentBar',{current}));
  }
  function installBarJump(actions) {
    const floating=document.getElementById('floating-controls');
    const button=document.createElement('button');
    button.id='floating-bar';
    button.type='button';
    floating.querySelector('#floating-reset').before(button);
    const overlay=document.createElement('div');
    overlay.className='bar-jump-overlay';
    overlay.hidden=true;
    overlay.innerHTML='<form class="bar-jump-dialog" role="dialog" aria-modal="true" aria-labelledby="bar-jump-title">'+
      '<h3 id="bar-jump-title">'+html('jumpToBar')+'</h3>'+
      '<label for="bar-jump-input">'+html('barField')+'</label>'+
      '<input id="bar-jump-input" type="number" inputmode="numeric" min="1" step="1" required aria-describedby="bar-jump-error">'+
      '<p id="bar-jump-error" role="alert" hidden></p>'+
      '<div class="bar-jump-actions"><button type="button" id="bar-jump-cancel"></button><button type="submit" id="bar-jump-set"></button></div></form>';
    document.body.append(overlay);
    const form=overlay.querySelector('form'),input=overlay.querySelector('input');
    const cancel=overlay.querySelector('#bar-jump-cancel'),submit=overlay.querySelector('#bar-jump-set');
    const error=overlay.querySelector('#bar-jump-error');
    setLabeledIcon(cancel,text('closeSymbol'),text('cancel'));
    setLabeledIcon(submit,'✎',text('setBar'));
    let wasPlaying=false,previousFocus,background=[],previousOverflow='';
    const close=()=>{
      overlay.hidden=true;
      document.body.style.overflow=previousOverflow;
      for (const [element,inert] of background) element.inert=inert;
      background=[];
      previousFocus?.focus({preventScroll:true});
    };
    const resume=()=>{
      Promise.resolve(actions.play()).catch(cause=>console.warn(text('logAudioStart'),cause));
    };
    button.onclick=()=>{
      if (!actions.total() || !overlay.hidden) return;
      wasPlaying=actions.isPlaying();
      actions.pause();
      previousFocus=document.activeElement;
      input.value=String(actions.current());
      error.hidden=true;
      input.removeAttribute('aria-invalid');
      overlay.hidden=false;
      previousOverflow=document.body.style.overflow;
      document.body.style.overflow='hidden';
      background=[...document.body.children].filter(element=>element!==overlay && element.tagName!=='SCRIPT').map(element=>[element,element.inert]);
      for (const [element] of background) element.inert=true;
      input.focus();
      input.select();
    };
    cancel.onclick=()=>{close();if(wasPlaying) resume();};
    form.noValidate=true;
    form.onsubmit=event=>{
      event.preventDefault();
      if (!/^\d+$/.test(input.value) || Number(input.value)<1) {
        error.textContent=text('invalidBar');error.hidden=false;input.setAttribute('aria-invalid','true');input.focus();return;
      }
      const target=Math.min(Number(input.value),actions.total());
      close();
      actions.seek(target);
      resume();
    };
    overlay.addEventListener('keydown',event=>{
      if (event.key==='Escape') {event.preventDefault();cancel.click();}
      if (event.key==='Tab') {
        const controls=[input,cancel,submit];
        const index=controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();
      }
    });
    updateBarJump(actions.current());
  }
  const formatDate = date => new Intl.DateTimeFormat(locale, {
    dateStyle:'medium',timeStyle:'medium',timeZone
  }).format(date);

  function applyBindings(root = document) {
    for (const node of root.querySelectorAll('[data-i18n]')) node.textContent = text(node.dataset.i18n);
    for (const node of root.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label',text(node.dataset.i18nAria));
    for (const node of root.querySelectorAll('[data-i18n-title]')) node.title = text(node.dataset.i18nTitle);
  }

  function initPage(version) {
    applyBindings();
    const setText = (selector,key) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = text(key);
    };
    const title = document.querySelector('#nacvik > h3');
    if (title) document.title = text('documentTitle',{title:title.textContent});
    setText('#play','play');
    setText('#reset',version === 'v2' ? 'stop' : 'reset');
    {
      const play=document.getElementById('play'),reset=document.getElementById('reset');
      if (play) setLabeledIcon(play,text('playSymbol'),text('play'));
      if (reset && version==='v1') setLabeledIcon(reset,'⏮',text('reset'));
    }
    if (version==='v2') {
      const stop=document.getElementById('reset');
      if (stop) {
        setIcon(stop,'⏹');
        stop.append(document.createTextNode(' '+text('stop').replace(/^⏹\s*/,'')));
      }
    }
    setText('label[for="tempo"]','tempo');
    const tempo=document.getElementById('tempo');
    const tempoLabel=document.querySelector('label[for="tempo"]') || tempo?.closest('label');
    if (tempoLabel && !tempoLabel.querySelector('.web-player-icon')) {
      const icon=document.createElement('span');
      setIcon(icon,'⏱');
      tempoLabel.prepend(icon,document.createTextNode(' '));
    }
    for (const id of ['at-master','at-metronome']) {
      const slider=document.getElementById(id);
      if (slider && !slider.previousElementSibling?.classList.contains('volume-icon')) {
        const icon=document.createElement('span');
        icon.className='volume-icon';
        setIcon(icon,'🔊');
        slider.before(icon);
      }
    }
    setText('label[for="position"]','position');
    const sheet = document.querySelector('.sheet');
    if (sheet) sheet.setAttribute('aria-label',text('score'));
    document.getElementById('mixer')?.setAttribute('aria-label',text('mixer'));
    const closeControl=document.querySelector('.controls [data-close-player], .controls a.return-link');
    if (closeControl) {
      let download=document.getElementById('download-pdf');
      if (!download) {
        download=document.createElement('a');
        download.id='download-pdf';
        download.className='pdf-download';
        closeControl.before(download);
      }
      const pdf=new URL(location.href);
      pdf.search='';
      pdf.hash='';
      pdf.pathname=pdf.pathname.replace(/-player(?:AlphaTab)?\.html$/i,'.pdf');
      download.href=pdf.href;
      download.download=decodeURIComponent(pdf.pathname.split('/').pop());
      download.textContent=text('downloadPdf');
      setLabeledIcon(download,'↓',text('downloadPdf'));
      download.title=text('downloadPdf');
      download.setAttribute('aria-label',text('downloadPdf'));
    }
    const floating = document.getElementById('floating-controls');
    if (floating) floating.setAttribute('aria-label',text('playbackControls'));
    const previous = document.getElementById('previous-bar');
    if (previous) {
      const makeSkip = (button,count,key) => {
        const icon=document.createElement('span');
        setIcon(icon,text('previousSymbol'));
        const label=document.createElement('small');
        label.textContent=String(count);
        button.replaceChildren(icon,label);
        button.classList.add('floating-skip');
        button.title=text(key);
        button.setAttribute('aria-label',text(key));
      };
      makeSkip(previous,1,'previousBar');
      previous.title = text('previousBar');
      previous.setAttribute('aria-label',text('previousBar'));
      let three=document.getElementById('previous-three-bars');
      if (!three) {
        three=document.createElement('button');
        three.id='previous-three-bars';
        three.type='button';
        previous.before(three);
      }
      makeSkip(three,3,'previousThreeBars');
      // Older cached player scripts only wire the original controls. Delegate
      // to those controls when no current player handler has been installed.
      if (!three.dataset.fallbackBound) {
        three.dataset.fallbackBound='1';
        three.addEventListener('click',() => {
          if (three.onclick) return;
          for (let count=0;count<3;count++) previous.click();
        });
      }
      let reset=document.getElementById('floating-reset');
      if (!reset) {
        reset=document.createElement('button');
        reset.id='floating-reset';
        reset.type='button';
        three.before(reset);
      }
      setIcon(reset,'⏮');
      reset.title=text('reset');
      reset.setAttribute('aria-label',text('reset'));
      if (!reset.dataset.fallbackBound) {
        reset.dataset.fallbackBound='1';
        reset.addEventListener('click',() => {
          if (reset.onclick) return;
          const position=document.getElementById('position');
          if (!position) return;
          position.value='0';
          position.dispatchEvent(new Event('input',{bubbles:true}));
        });
      }
    }
    const play = document.getElementById('floating-play');
    if (play) {
      setIcon(play,text('playSymbol'));
      play.title = text('play');
      play.setAttribute('aria-label',text('play'));
    }
    for (const button of document.querySelectorAll('[data-close-player], a.return-link')) {
      if (button.closest('#floating-controls')) setIcon(button,text('closeSymbol'));
      else setLabeledIcon(button,text('closeSymbol'),text('close'));
      button.title = text('close');
      button.setAttribute('aria-label',text('close'));
    }
    // Selectors also translate players generated before data-i18n attributes existed.
    const sound = document.getElementById('player-sound') ?? document.querySelector('.controls > p:not([id])');
    if (sound) {
      const data = document.getElementById('song-data');
      const piano = data ? JSON.parse(data.textContent).pianoSamples.length > 0 : true;
      sound.textContent = text(piano ? 'soundPiano' : 'soundTriangle');
    }
    const hint = document.querySelector('#nacvik > p');
    if (hint) hint.textContent = text(version === 'v2' || sheet?.querySelector('[data-bar]') ? 'seekNotes' : 'seekPosition');
    for (const link of document.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (href.includes('/klavir/LICENCIA.md')) link.textContent = text('pianoLicense');
      if (href.includes('@coderline/alphatab') && href.endsWith('/LICENSE')) {
        link.textContent = text(href.includes('/soundfont/') ? 'alphaSoundLicense' : 'alphaLicense');
      }
    }
    initDates();
    loadIconFont();
  }

  function initDates() {
    const modified = document.getElementById('player-modified');
    const loaded = document.getElementById('player-loaded');
    const small = document.querySelector('#player-dates small');
    if (small && modified && loaded) small.replaceChildren(
      document.createTextNode(text('modifiedDate')+': '), modified, document.createElement('br'),
      document.createTextNode(text('loadedDate')+': '), loaded);
    const updateLoaded = date => {
      if (!loaded) return;
      loaded.dateTime = date.toISOString();
      loaded.textContent = formatDate(date);
    };
    const updateModified = async () => {
      if (!modified) return;
      modified.removeAttribute('datetime');
      modified.textContent = text('loading');
      try {
        let value;
        if (location.protocol === 'file:') value = document.lastModified;
        else {
          const response = await fetch(location.href, {
            method:'HEAD',cache:'no-cache',signal:AbortSignal.timeout(10000)
          });
          if (!response.ok) throw new Error(String(response.status));
          value = response.headers.get('Last-Modified');
        }
        const date = value ? new Date(value) : null;
        if (!date || !Number.isFinite(date.getTime())) throw new Error();
        modified.dateTime = date.toISOString();
        modified.textContent = formatDate(date);
      } catch {
        modified.removeAttribute('datetime');
        modified.textContent = text('unavailable');
      }
    };
    updateLoaded(new Date(performance.timeOrigin));
    updateModified();
    window.addEventListener('pageshow',event => {
      if (event.persisted) {
        updateLoaded(new Date());
        updateModified();
      }
    });
  }
  // Invoke inside the user's click and keep silence connected until playback starts.
  function prepareAudio(context) {
    const wake = context.createBufferSource();
    wake.buffer = context.createBuffer(1,128,context.sampleRate);
    wake.loop = true;
    wake.connect(context.destination);
    const resumed = context.resume();
    wake.start();
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      try { wake.stop(); } finally { wake.disconnect(); }
    };
    const ready = (async () => {
      const bounded = async operation => {
        let timer;
        try {
          return await Promise.race([operation,new Promise((_,reject) => {
            timer = setTimeout(() => reject(new Error(text('errorAudioOutputStart'))),8000);
          })]);
        } finally { clearTimeout(timer); }
      };
      await bounded(resumed);
      const deadline = performance.now()+8000;
      let runningSince = null;
      let lastAdvance = performance.now();
      let previousTime = context.currentTime;
      let recovered = false;
      while (performance.now()<deadline) {
        const currentTime = context.currentTime;
        if (currentTime > previousTime) lastAdvance = performance.now();
        previousTime = currentTime;
        if (context.state === 'running') {
          runningSince ??= currentTime;
          if (currentTime-runningSince >= .15) return;
        } else runningSince = null;
        // Some mobile outputs report "running" while their clock is frozen.
        // Reopen the same output once, without advancing the score or asking
        // the user to pause/play. Keep the wake source connected throughout.
        if (!recovered && performance.now()-lastAdvance >= 750) {
          recovered = true;
          if (context.state === 'running' && context.suspend) await bounded(context.suspend());
          await bounded(context.resume());
          runningSince = null;
          previousTime = context.currentTime;
          lastAdvance = performance.now();
        }
        await new Promise(resolve => setTimeout(resolve,25));
      }
      throw new Error(text('errorAudioOutputStart'));
    })();
    return {ready,release};
  }
  window.GojdicovciI18n = {text,html,voiceNames,initPage,applyBindings,prepareAudio,setIcon,setLabeledIcon,iconHtml,installBarJump,updateBarJump};
})();
