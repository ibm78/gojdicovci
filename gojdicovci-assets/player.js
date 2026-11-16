const loadedTime = document.getElementById('player-loaded');
if (loadedTime) {
  const timestampFormat = new Intl.DateTimeFormat('sk-SK', {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Europe/Bratislava'
  });
  const updateLoadTime = date => {
    loadedTime.dateTime = date.toISOString();
    loadedTime.textContent = timestampFormat.format(date);
  };
  updateLoadTime(new Date(performance.timeOrigin));
  window.addEventListener('pageshow', event => {
    if (event.persisted) updateLoadTime(new Date());
  });
}

'use strict';
const {tracks, pianoSamples, bars, bpm, toGroup} = JSON.parse(document.getElementById('song-data').textContent);
const assetRoot = new URL('.', document.currentScript.src);
let piano;
const groups = ['Soprán','Alt','Tenor','Bas'];
const byId = id => document.getElementById(id);
const floatingPlay = byId('floating-play');
const play = byId('play'), tempo = byId('tempo'), position = byId('position');
const score = document.querySelector('.sheet');
const noteHeads = [...score.querySelectorAll('[data-note]')].map(node => ({
  node, timing: node.dataset.note.split(',').map(Number)
}));
const length = Number(position.max);
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
  for (const node of page.querySelectorAll('[data-bar]')) {
    const position = node.querySelector('g[transform]')?.transform.baseVal.getItem(0)?.matrix;
    if (!position || !staffTops.length) continue;
    const y = staffTops.reduce((nearest, top) =>
      Math.abs(top + 2 - position.f) < Math.abs(nearest + 2 - position.f) ? top : nearest);
    const bar = Number(node.dataset.bar);
    const row = rowForBar.get(bar);
    if (!row || (row.page === page && y < row.y)) rowForBar.set(bar, rows.get(y));
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
  window.scrollTo({top: window.scrollY + top - 14, behavior:'instant'});
}
const voices = groups.map(() => ({volume:.75, muted:false, gain:null}));
let audio, scheduled=[], start=0, beat=0, playing=false, frame, currentBar=0, busy=false;
let rate = bpm/60;
if (new URLSearchParams(location.search).has('embed')) document.body.classList.add('embed');

function applyGain(voice) {
  voice.gain?.gain.setTargetAtTime(voice.muted ? 0 : voice.volume, audio.currentTime, .01);
}
groups.forEach((name,index)=>{
  const row=document.createElement('div');
  row.className='voice';
  row.innerHTML='<label for="voice'+index+'">'+name+'</label><input id="voice'+index+'" type="range" min="0" max="100" value="75"><button type="button" aria-pressed="false" aria-label="Stíšiť '+name+'">Stíšiť</button>';
  const voice=voices[index], volume=row.querySelector('input'), button=row.querySelector('button');
  volume.oninput=()=>{ voice.volume=Number(volume.value)/100; applyGain(voice); };
  button.onclick=()=>{
    voice.muted=!voice.muted;
    button.setAttribute('aria-pressed',String(voice.muted));
    button.textContent=voice.muted?'Zapnúť':'Stíšiť';
    applyGain(voice);
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
  const changedBar = bar !== currentBar;
  if (changedBar) {
    currentBar = bar;
    byId('bar').textContent='Takt '+bar+' / '+bars.length;
  }
  const sounding = [];
  for (const {node, timing: [from, to, track]} of noteHeads) {
    const voice = voices[toGroup[track]];
    const active = playing && value >= from && value < to && !voice.muted && voice.volume > 0;
    node.classList.toggle('active', active);
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
  const label = playing ? 'Pozastaviť' : 'Prehrať';
  play.textContent = label;
  floatingPlay.textContent = playing ? '⏸' : '▶';
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
    if (!response.ok) throw new Error('Klavírna vzorka: HTTP '+response.status);
    return {pitch, bytes: await response.arrayBuffer()};
  }));
}

let sampleDownload = pianoSamples.length ? fetchPianoSamples().catch(() => null) : null;

async function waitForAudioOutput(context, wake) {
  try {
    const startingTime = context.currentTime;
    const deadline = performance.now() + 8000;
    while (performance.now() < deadline) {
      if (context.state === 'running' && context.currentTime > startingTime) return;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw new Error('Zvukový výstup sa nespustil.');
  } finally {
    wake.stop();
    wake.disconnect();
  }
}

async function togglePlayback(){
  if(playing){pause();return;}
  if(busy) return;
  busy=true;
  const error = byId('error');
  error.hidden = true;
  play.textContent = 'Spúšťam zvuk…';
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
    const wake = context.createBufferSource();
    wake.buffer = context.createBuffer(1, 128, context.sampleRate);
    wake.loop = true;
    wake.connect(context.destination);
    const resumed = context.resume();
    wake.start();

    async function preparePiano() {
      if (!pianoSamples.length || piano) return;
      const samples = (await sampleDownload) ?? await fetchPianoSamples();
      piano = await Promise.all(samples.map(async ({pitch, bytes})=>({
        pitch, buffer: await context.decodeAudioData(bytes.slice(0))
      })));
      sampleDownload = null;
    }

    await Promise.all([resumed, waitForAudioOutput(context, wake), preparePiano()]);
    if (context.state !== 'running') throw new Error('Zvukový výstup bol prerušený.');

    document.body.classList.add('following');
    const target = beat >= length ? 0 : beat;
    const bar = 1 + Math.max(0, bars.findLastIndex(start => start <= target));
    followRow(bar, true);
    begin();
  } catch (cause) {
    pause();
    error.hidden=false;
    error.textContent='Zvuk sa nepodarilo spustiť. Skúste stlačiť Prehrať znova.';
    console.warn('Gojdičovci: štart prehrávania zlyhal.', cause);
  } finally { busy=false; }
}
play.onclick = floatingPlay.onclick = togglePlayback;
function seek(value) {
  const resume=playing;
  pause(value);
  if(resume) begin();
}
byId('previous-bar').onclick = () => {
  const value = playing ? now() : beat;
  const barIndex = bars.findLastIndex(start => start <= value);
  seek(bars[Math.max(0, barIndex - 1)]);
};
byId('reset').onclick=()=>seek(0);
position.oninput=()=>seek(Number(position.value));
tempo.oninput=()=>{
  const resume=playing;
  if(resume) pause();
  rate=bpm/60*Number(tempo.value)/100;
  byId('speed').textContent=tempo.value+' % · '+Math.round(rate*60)+' BPM';
  if(resume) begin();
};
score.onclick=event=>{
  const target=event.target.closest('[data-bar]');
  if(target) seek(bars[Number(target.dataset.bar)-1]);
};
draw(0);
