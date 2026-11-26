'use strict';

(async () => {
  const assetRoot = new URL('.',document.currentScript.src);
  for (const id of ['play','floating-play']) document.getElementById(id)?.setAttribute('disabled','');
  if (!window.GojdicovciI18n) {
    await new Promise((resolve,reject) => {
      const script = document.createElement('script');
      const url = new URL('player-i18n.js',assetRoot);
      url.searchParams.set('v',Date.now().toString());
      script.src = url.href;
      script.onload = resolve;
      script.onerror = () => reject(new Error(script.src));
      document.head.append(script);
    });
  }
  const i18n = window.GojdicovciI18n;
  const t = i18n.text;
  const h = i18n.html;
  const byId = id => document.getElementById(id);
  i18n.initPage('v1');
  const tempoGroup=document.createElement('div');
  tempoGroup.className='tempo-group';
  const tempoLabel=document.querySelector('label[for="tempo"]');
  tempoLabel.before(tempoGroup);
  tempoGroup.append(tempoLabel,byId('tempo'),byId('speed'));
  const separator = () => {
    const line = document.createElement('hr');
    line.className = 'control-separator';
    return line;
  };
  byId('position').closest('.control-row').before(separator());
  const soundLabel = byId('player-sound') ?? document.querySelector('.controls > p:not([id])');
  if (soundLabel) soundLabel.replaceWith(separator());
  else byId('mixer').before(separator());
  // Support return links already present in published players.
  for (const control of document.querySelectorAll('button[data-close-player], a.return-link')) {
    const isFloating = control.closest('#floating-controls');
    if (isFloating) {
      control.setAttribute('aria-label', t('close'));
      control.title = t('close');
    } else {
      i18n.setLabeledIcon(control,t('closeSymbol'),t('close'));
    }
    control.addEventListener('click', event => {
      event.preventDefault();
      window.close();
    });
  }

  const {tracks, pianoSamples, bars, bpm, toGroup} = JSON.parse(document.getElementById('song-data').textContent);
  let piano;
  const groups = i18n.voiceNames();
  const floatingPlay = byId('floating-play');
  const play = byId('play'), tempo = byId('tempo'), position = byId('position');
  const score = document.querySelector('.sheet');
  const noteHeads = [...score.querySelectorAll('[data-note]')].flatMap(node =>
    (node.dataset.noteTimes || node.dataset.note).split(';').map(value => ({
      node, timing:value.split(',').map(Number)
    })));
  const length = Number(position.max);
  function createMeasureHighlights() {
    const regions=new Map(),rectangles=[];
    const svgNS='http://www.w3.org/2000/svg';
    const bounds=(node,page)=>{
      const box=node.getBBox();
      const matrix=page.getCTM().inverse().multiply(node.getCTM());
      const point=page.createSVGPoint();
      const corners=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]]
        .map(([x,y])=>{point.x=x;point.y=y;return point.matrixTransform(matrix);});
      return {left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))};
    };
    for (const page of score.querySelectorAll('svg')) {
      const systems=new Map();
      for (const node of page.querySelectorAll('[data-score-system]')) {
        let box;
        try {box=bounds(node,page);} catch {continue;}
        const id=node.dataset.scoreSystem;
        if (!systems.has(id)) systems.set(id,{left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity,lines:[]});
        const system=systems.get(id);
        system.left=Math.min(system.left,box.left);system.right=Math.max(system.right,box.right);
        system.top=Math.min(system.top,box.top);system.bottom=Math.max(system.bottom,box.bottom);
        if (node.classList.contains('score-barline')) system.lines.push(box.left);
      }
      for (const system of systems.values()) {
        system.lines.sort((a,b)=>a-b);
        system.lines=system.lines.filter((value,index,list)=>!index || value-list[index-1]>.5);
        system.regions=new Map();
      }
      for (const anchor of page.querySelectorAll('[data-note]')) {
        const head=anchor.closest('.score-notehead[data-score-system]') || anchor.querySelector('.score-notehead[data-score-system]');
        const system=head && systems.get(head.dataset.scoreSystem);
        if (!system || !system.lines.length) continue;
        let box;
        try {box=bounds(head,page);} catch {continue;}
        const x=(box.left+box.right)/2;
        const left=system.lines.findLast(value=>value<x-.05) ?? system.left;
        const right=system.lines.find(value=>value>x+.05) ?? system.right;
        if (right<=left) continue;
        const key=left+':'+right;
        let rect=system.regions.get(key);
        if (!rect) {
          rect=document.createElementNS(svgNS,'rect');
          rect.setAttribute('class','current-measure-highlight');
          rect.setAttribute('x',left);rect.setAttribute('y',system.top-2);
          rect.setAttribute('width',right-left);rect.setAttribute('height',system.bottom-system.top+4);
          rect.setAttribute('aria-hidden','true');
          rect.style.opacity='0';
          page.prepend(rect);rectangles.push(rect);system.regions.set(key,rect);
        }
        for (const timing of (anchor.dataset.noteTimes || anchor.dataset.note).split(';')) {
          const from=Number(timing.split(',')[0]);
          const bar=1+Math.max(0,bars.findLastIndex(start=>start<=from+.000001));
          if (!regions.has(bar)) regions.set(bar,new Set());
          regions.get(bar).add(rect);
        }
      }
    }
    let visible=new Set();
    return bar=>{
      const next=regions.get(bar) ?? new Set();
      for (const rect of visible) if (!next.has(rect)) rect.style.opacity='0';
      for (const rect of next) if (!visible.has(rect)) rect.style.opacity='1';
      visible=next;
    };
  }
  let measurePainter;
  const highlightMeasure=bar=>{
    if (!measurePainter && bar) measurePainter=createMeasureHighlights();
    measurePainter?.(bar);
  };
  const rowForBar = new Map();
  for (const page of score.querySelectorAll('svg')) {
    const staffs = [...page.querySelectorAll('line')].flatMap(line => {
      const x1 = Number(line.getAttribute('x1')), x2 = Number(line.getAttribute('x2'));
      const y1 = Number(line.getAttribute('y1')), y2 = Number(line.getAttribute('y2'));
      const matrix = line.parentElement.transform?.baseVal.getItem(0)?.matrix;
      return matrix && y1 === y2 && Math.abs(x2 - x1) > 20 ? [matrix.f + y1] : [];
    }).sort((a,b)=>a-b);
    const staffTops = staffs.filter((y,index) => index === 0 || y-staffs[index-1] > 2);
    const rows = new Map(staffTops.map(y => [y, {page, y}]));
    const timedNodes = page.querySelectorAll('[data-note-times]');
    for (const node of timedNodes.length ? timedNodes : page.querySelectorAll('[data-bar]')) {
      const position = node.querySelector('g[transform]')?.transform.baseVal.getItem(0)?.matrix;
      if (!position || !staffTops.length) continue;
      const y = staffTops.reduce((nearest, top) =>
        Math.abs(top + 2 - position.f) < Math.abs(nearest + 2 - position.f) ? top : nearest);
      const playbackBars = node.dataset.noteTimes
        ? node.dataset.noteTimes.split(';').map(value => 1+bars.findLastIndex(start=>start<=Number(value.split(',')[0])+.000001))
        : [Number(node.dataset.bar)];
      for (const bar of playbackBars) {
        const row = rowForBar.get(bar);
        if (!row || (row.page === page && y < row.y)) rowForBar.set(bar, rows.get(y));
      }
    }
  }
  let followedRow;
  function followRow(bar, force = false) {
    const row = rowForBar.get(bar);
    if (!row) {
      if (force) score.scrollIntoView({block:"start", inline:"nearest", behavior:"instant"});
      return;
    }
    if (!force && row === followedRow) return;
    followedRow = row;
    const point = row.page.createSVGPoint();
    point.y = row.y;
    const matrix = row.page.getScreenCTM();
    if (!matrix) return;
    const top = point.matrixTransform(matrix).y;
    window.scrollTo({top: window.scrollY + top - 35, behavior:'instant'});
  }
  const voices = groups.map(() => ({volume:.75, muted:false, gain:null}));
  let audio, scheduled=[], start=0, beat=0, playing=false, frame, currentBar=0, busy=false;
  let rate = bpm/60;
  if (new URLSearchParams(location.search).has('embed')) document.body.classList.add('embed');

  function applyGain(voice) {
    if (!voice.gain) return;
    const parameter = voice.gain.gain;
    const time = audio.currentTime;
    parameter.cancelScheduledValues(time);
    if (voice.muted || voice.volume===0) parameter.setValueAtTime(0,time);
    else parameter.setTargetAtTime(voice.volume,time,.01);
  }
  let soloVoice = -1;
  let statesBeforeSolo;
  const voiceButtons = [];
  function refreshMixer() {
    voices.forEach((voice,index) => {
      const buttons = voiceButtons[index];
      buttons.volume.value = Math.round(voice.volume*100);
      buttons.mute.setAttribute('aria-pressed',String(voice.muted));
      i18n.setLabeledIcon(buttons.mute,voice.muted?'🔊':'🔇',t(voice.muted?'unmute':'mute'));
      buttons.mute.setAttribute('aria-label',t(voice.muted?'unmuteVoice':'muteVoice',{voice:groups[index]}));
      buttons.solo.setAttribute('aria-pressed',String(soloVoice===index));
      buttons.solo.setAttribute('aria-label',t(soloVoice===index?'exitSoloVoice':'soloVoice',{voice:groups[index]}));
      applyGain(voice);
    });
    draw(playing?now():beat);
  }
  groups.forEach((name,index)=>{
    const row=document.createElement('div');
    row.className='voice';
    row.innerHTML=`<label for="voice${index}"></label><input id="voice${index}" type="range" min="0" max="100" value="75"><div class="voice-actions"><button type="button" data-mute aria-pressed="false">${h('mute')}</button><button type="button" data-solo aria-pressed="false">${h('soloV1')}</button></div>`;
    row.querySelector('label').textContent=name;
    const volumeRow=document.createElement('div');
    volumeRow.className='volume-control';
    volumeRow.innerHTML=i18n.iconHtml('🔊');
    const volumeSlider=row.querySelector('input');
    volumeSlider.before(volumeRow);
    volumeRow.append(volumeSlider);
    const voice=voices[index], volume=row.querySelector('input'), button=row.querySelector('[data-mute]');
    const solo=row.querySelector('[data-solo]');
    i18n.setLabeledIcon(button,'🔇',t('mute'));
    i18n.setLabeledIcon(solo,'◎',t('soloV1'));
    voiceButtons.push({mute:button,solo,volume});
    button.setAttribute('aria-label',t('muteVoice',{voice:name}));
    solo.setAttribute('aria-label',t('soloVoice',{voice:name}));
    volume.oninput=()=>{ voice.volume=Number(volume.value)/100; applyGain(voice); };
    button.onclick=()=>{
      soloVoice=-1;
      statesBeforeSolo=undefined;
      voice.muted=!voice.muted;
      refreshMixer();
    };
    solo.onclick=()=>{
      if(soloVoice===index){
        voices.forEach((item,i)=>{
          item.muted=statesBeforeSolo[i].muted;
          item.volume=statesBeforeSolo[i].volume;
        });
        soloVoice=-1;
        statesBeforeSolo=undefined;
      }else{
        if(soloVoice===-1) statesBeforeSolo=voices.map(item=>({muted:item.muted,volume:item.volume}));
        soloVoice=index;
        voices.forEach((item,i)=>{
          item.muted=false;
          item.volume=i===index?statesBeforeSolo[i].volume:.10;
        });
      }
      refreshMixer();
    };
    byId('mixer').append(row);
  });

  function now() {
    return Math.min(length,beat+Math.max(0,audio.currentTime-start)*rate);
  }
  function followNotes(notes) {
    if (!notes.length || score.scrollWidth <= score.clientWidth) return;
    const visibleLeft = score.getBoundingClientRect().left + score.clientLeft;
    const inset = score.clientWidth * .12;
    const positions = notes.map(note => note.getBoundingClientRect());
    const left = Math.min(...positions.map(rect => rect.left));
    const right = Math.max(...positions.map(rect => rect.right));
    const visibleRight = visibleLeft + score.clientWidth;
    if (left >= visibleLeft + inset && right <= visibleRight - inset) return;

    // Leave room for upcoming notes while keeping the sounding notes in view.
    const lead = Math.min(score.clientWidth * .25, Math.max(inset, score.clientWidth - (right - left) - inset));
    score.scrollLeft += left - visibleLeft - lead;
  }
  function draw(value, follow=false) {
    position.value=value;
    const bar=1+Math.max(0,bars.findLastIndex(start=>start<=value));
    highlightMeasure(playing ? bar : 0);
    i18n.updateBarJump(bar);
    const changedBar = bar !== currentBar;
    if (changedBar) {
      currentBar = bar;
      byId('bar').textContent=t('barCount',{current:bar,total:bars.length});
    }
    const sounding = [];
    for (const {node} of noteHeads) node.classList.remove('active');
    for (const {node, timing: [from, to, track]} of noteHeads) {
      const voice = voices[toGroup[track]];
      const active = playing && value >= from && value < to && !voice.muted && voice.volume > 0;
      if (active) node.classList.add('active');
      if (follow && active) sounding.push(node);
    }
    if (follow) {
      followRow(bar);
      followNotes(sounding);
    }
  }
  function tick() {
    if(!playing) return;
    const value=now();
    draw(value,true);
    if(value>=length){ pause(length); return; }
    frame=requestAnimationFrame(tick);
  }
  function updatePlaybackControls() {
    const label = playing ? t('pause') : t('play');
    i18n.setLabeledIcon(play,playing ? t('pauseSymbol') : t('playSymbol'),label);
    i18n.setIcon(floatingPlay,playing ? t('pauseSymbol') : t('playSymbol'));
    floatingPlay.setAttribute('aria-label', label);
    floatingPlay.title = label;
    if (playing) {
      byId('floating-controls').hidden = false;
      document.body.classList.add('following');
    }
  }
  function pause(value=playing?now():beat) {
    playing=false;
    beat=value;
    cancelAnimationFrame(frame);
    scheduled.forEach(note=>note.stop(audio.currentTime));
    scheduled=[];
    updatePlaybackControls();
    draw(beat);
  }
  function begin() {
    if(beat>=length) beat=0;
    start=audio.currentTime+.045;
    tracks.forEach((track,index)=>track.forEach(([from,to,pitch])=>{
      if(to<=beat) return;
      const on=start+Math.max(0,(from-beat)/rate);
      const off=start+(to-beat)/rate;
      const sound = pianoSamples.length ? audio.createBufferSource() : audio.createOscillator();
      if (pianoSamples.length) {
        const sample = piano.reduce((closest, candidate) =>
          Math.abs(candidate.pitch - pitch) < Math.abs(closest.pitch - pitch) ? candidate : closest);
        sound.buffer = sample.buffer;
        sound.playbackRate.value = 2 ** ((pitch - sample.pitch) / 12);
      } else {
        sound.type = 'triangle';
        sound.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
      }
      const envelope=audio.createGain();


      sound.connect(envelope).connect(voices[toGroup[index]].gain);
      envelope.gain.setValueAtTime(0,on);
      const attack=Math.min(.018,(off-on)/2);
      envelope.gain.linearRampToValueAtTime(pianoSamples.length ? .24 : .085,on+attack);
      envelope.gain.setTargetAtTime(0,off,.065);
      sound.start(on);
      sound.stop(off+.28);
      sound.onended=()=>{ sound.disconnect(); envelope.disconnect(); };
      scheduled.push(sound);
    }));
    playing=true;
    updatePlaybackControls();
    tick();
  }
  async function fetchPianoSamples() {
    return Promise.all(pianoSamples.map(async pitch => {
      const response = await fetch(new URL('klavir/'+pitch+'.m4a', assetRoot), {
        signal: AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error(t('errorPianoSample',{status:response.status}));
      return {pitch, bytes: await response.arrayBuffer()};
    }));
  }

  let sampleDownload = pianoSamples.length ? fetchPianoSamples().catch(() => null) : null;

  async function togglePlayback(){
    if(playing){pause();return;}
    if(busy) return;
    busy=true;
    const error = byId('error');
    error.hidden = true;
    i18n.setLabeledIcon(play,t('playSymbol'),t('startingAudio'));
    let activation;
    try {
      if(!audio || audio.state === 'closed'){
        audio=new (window.AudioContext || window.webkitAudioContext)();
        voices.forEach(voice=>{
          voice.gain=audio.createGain();
          voice.gain.gain.value=voice.muted?0:voice.volume;
          voice.gain.connect(audio.destination);
        });
      }
      // Request output and queue silence while still handling the user's click.
      const context = audio;
      activation = i18n.prepareAudio(context);

      async function preparePiano() {
        if (!pianoSamples.length || piano) return;
        const samples = (await sampleDownload) ?? await fetchPianoSamples();
        piano = await Promise.all(samples.map(async ({pitch, bytes})=>({
          pitch, buffer: await context.decodeAudioData(bytes.slice(0))
        })));
        sampleDownload = null;
      }

      await Promise.all([activation.ready, preparePiano()]);
      if (context.state !== 'running') throw new Error(t('errorAudioInterrupted'));

      document.body.classList.add('following');
      const target = beat >= length ? 0 : beat;
      const bar = 1 + Math.max(0, bars.findLastIndex(start => start <= target));
      followRow(bar, true);
      begin();
    } catch (cause) {
      pause();
      error.hidden=false;
      error.textContent=t('errorAudioStart') + (cause?.message ? ' ('+cause.message+')' : '');
      console.warn(t('logAudioStart'), cause);
    } finally { activation?.release(); busy=false; }
  }
  play.onclick = floatingPlay.onclick = togglePlayback;
  function seek(value) {
    const resume=playing;
    pause(value);
    if(resume) begin();
  }
  const skipBars = count => {
    const value = playing ? now() : beat;
    const barIndex = bars.findLastIndex(start => start <= value);
    seek(bars[Math.max(0, barIndex - count)]);
  };
  byId('previous-bar').onclick = () => skipBars(1);
  byId('previous-three-bars').onclick = () => skipBars(3);
  byId('floating-reset').onclick = () => seek(0);
  i18n.installBarJump({
    total:()=>bars.length,
    current:()=>1+Math.max(0,bars.findLastIndex(from=>from<=(playing?now():beat))),
    isPlaying:()=>playing,
    pause:()=>pause(),
    seek:bar=>pause(bars[bar-1]),
    play:()=>{if(!playing) return togglePlayback();}
  });
  byId('reset').onclick=()=>seek(0);
  position.oninput=()=>seek(Number(position.value));
  tempo.oninput=()=>{
    const resume=playing;
    if(resume) pause();
    rate=bpm/60*Number(tempo.value)/100;
    byId('speed').textContent=t('tempoValue',{percent:tempo.value,bpm:Math.round(rate*60)});
    if(resume) begin();
  };
  score.onclick=event=>{
    const target=event.target.closest('[data-bar]');
    if(target) seek(bars[Number(target.dataset.bar)-1]);
  };
  byId('speed').textContent=t('tempoValue',{percent:tempo.value,bpm});
  draw(0);
  play.disabled = floatingPlay.disabled = false;

})().catch(error => {
  console.error(error);
  const status = document.getElementById('error');
  if (status) {status.hidden = false;status.textContent = error.message;}
});
