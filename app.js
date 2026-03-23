const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const KEY_BINDINGS = [
  "A",
  "W",
  "S",
  "E",
  "D",
  "F",
  "T",
  "G",
  "Y",
  "H",
  "U",
  "J",
  "K",
  "O",
  "L",
  "P",
  ";",
  "'",
];
const STORAGE_KEY = "stage-keys-prefs-v2";
const MAX_POLYPHONY = 28;
const DEFAULT_BPM = 108;
const MIN_BPM = 60;
const MAX_BPM = 180;

const KEY_EVENT_MAP = new Map(
  KEY_BINDINGS.map((label, index) => [
    label === ";"
      ? "Semicolon"
      : label === "'"
        ? "Quote"
        : `Key${label}`,
    index,
  ]),
);

const INSTRUMENTS = [
  {
    id: "piano",
    korean: "피아노",
    english: "Grand Piano",
    accent: "#f7bf5b",
    detail: "해머 어택과 짧은 잔향이 섞인 클래식 톤",
    wave: [0, 1, 0.5, 0.16, 0.08, 0.03],
    attack: 0.005,
    decay: 1.2,
    sustain: 0.06,
    release: 0.8,
    filterType: "lowpass",
    filterFrequency: 4800,
    filterQ: 0.9,
    vibratoRate: 0,
    vibratoDepth: 0,
    reverbSend: 0.24,
    detuneSpread: 3,
    voiceMix: [
      { gain: 0.88, octave: 0 },
      { gain: 0.32, octave: 1, detune: 6 },
    ],
  },
  {
    id: "trumpet",
    korean: "트럼펫",
    english: "Brass Trumpet",
    accent: "#ff8a5b",
    detail: "밝게 튀는 브라스 성분과 살짝 흔들리는 비브라토",
    wave: [0, 1, 0.82, 0.61, 0.38, 0.24, 0.12],
    attack: 0.028,
    decay: 0.26,
    sustain: 0.48,
    release: 0.3,
    filterType: "bandpass",
    filterFrequency: 2200,
    filterQ: 0.95,
    vibratoRate: 5.2,
    vibratoDepth: 14,
    reverbSend: 0.18,
    detuneSpread: 9,
    voiceMix: [
      { gain: 0.88, octave: 0 },
      { gain: 0.25, octave: 0, detune: 7 },
    ],
  },
  {
    id: "violin",
    korean: "바이올린",
    english: "Solo Violin",
    accent: "#ff6392",
    detail: "느린 어택과 유연한 비브라토를 가진 스트링 톤",
    wave: [0, 1, 0.71, 0.5, 0.34, 0.2, 0.14, 0.08],
    attack: 0.08,
    decay: 0.38,
    sustain: 0.58,
    release: 0.42,
    filterType: "lowpass",
    filterFrequency: 3400,
    filterQ: 0.7,
    vibratoRate: 6,
    vibratoDepth: 18,
    reverbSend: 0.3,
    detuneSpread: 13,
    voiceMix: [
      { gain: 0.75, octave: 0 },
      { gain: 0.22, octave: 0, detune: -7 },
    ],
  },
  {
    id: "organ",
    korean: "오르간",
    english: "Cathedral Organ",
    accent: "#94d26a",
    detail: "지속감이 긴 파이프 오르간 계열의 풍성한 사운드",
    wave: [0, 1, 0.08, 0.74, 0.05, 0.44, 0.04, 0.24],
    attack: 0.012,
    decay: 0.22,
    sustain: 0.86,
    release: 0.5,
    filterType: "lowpass",
    filterFrequency: 3000,
    filterQ: 0.4,
    vibratoRate: 0,
    vibratoDepth: 0,
    reverbSend: 0.34,
    detuneSpread: 4,
    voiceMix: [
      { gain: 0.56, octave: 0 },
      { gain: 0.34, octave: 1 },
      { gain: 0.24, octave: 2, detune: 4 },
    ],
  },
  {
    id: "flute",
    korean: "플루트",
    english: "Concert Flute",
    accent: "#67d8ff",
    detail: "깨끗한 기본파와 은은한 숨결감에 가까운 음색",
    wave: [0, 1, 0.18, 0.06, 0.02],
    attack: 0.07,
    decay: 0.24,
    sustain: 0.52,
    release: 0.38,
    filterType: "lowpass",
    filterFrequency: 2500,
    filterQ: 0.5,
    vibratoRate: 5.3,
    vibratoDepth: 9,
    reverbSend: 0.28,
    detuneSpread: 2,
    voiceMix: [
      { gain: 0.9, octave: 0 },
      { gain: 0.12, octave: 1, detune: 3 },
    ],
  },
  {
    id: "saxophone",
    korean: "색소폰",
    english: "Alto Sax",
    accent: "#f58aeb",
    detail: "짙은 미드레인지와 살짝 거친 브레스 감각",
    wave: [0, 1, 0.6, 0.46, 0.25, 0.16, 0.08],
    attack: 0.04,
    decay: 0.32,
    sustain: 0.42,
    release: 0.28,
    filterType: "bandpass",
    filterFrequency: 1650,
    filterQ: 1.1,
    vibratoRate: 4.8,
    vibratoDepth: 11,
    reverbSend: 0.2,
    detuneSpread: 7,
    voiceMix: [
      { gain: 0.84, octave: 0 },
      { gain: 0.2, octave: 0, detune: -5 },
    ],
  },
  {
    id: "guitar",
    korean: "기타",
    english: "Electric Guitar",
    accent: "#ffd166",
    detail: "짧게 튕기는 플럭과 약간의 금속성 하모닉",
    wave: [0, 1, 0.34, 0.17, 0.1, 0.04],
    attack: 0.004,
    decay: 0.9,
    sustain: 0.08,
    release: 0.42,
    filterType: "lowpass",
    filterFrequency: 2800,
    filterQ: 0.8,
    vibratoRate: 0,
    vibratoDepth: 0,
    reverbSend: 0.14,
    detuneSpread: 6,
    voiceMix: [
      { gain: 0.86, octave: 0 },
      { gain: 0.18, octave: 1, detune: 8 },
    ],
  },
  {
    id: "xylophone",
    korean: "실로폰",
    english: "Xylophone",
    accent: "#91f2b3",
    detail: "짧고 선명한 말렛 계열 타격감",
    wave: [0, 1, 0.3, 0.06, 0.22, 0.05, 0.08],
    attack: 0.003,
    decay: 0.55,
    sustain: 0.02,
    release: 0.2,
    filterType: "highpass",
    filterFrequency: 620,
    filterQ: 0.45,
    vibratoRate: 0,
    vibratoDepth: 0,
    reverbSend: 0.3,
    detuneSpread: 0,
    voiceMix: [
      { gain: 0.9, octave: 0 },
      { gain: 0.22, octave: 1, detune: 12 },
    ],
  },
];

const state = {
  instrumentId: "piano",
  baseOctave: 4,
  volume: 0.74,
  audioReady: false,
  portraitMode: false,
  sustainEnabled: false,
  landscapeAttempted: false,
  notes: [],
  bpm: DEFAULT_BPM,
  metronomeEnabled: false,
  recordingActive: false,
  loopEnabled: false,
  loopActive: false,
  takeStartedAtMs: 0,
  takeDurationMs: 0,
  takeEvents: [],
  midiSupported: typeof navigator !== "undefined" && typeof navigator.requestMIDIAccess === "function",
};

const ui = {
  audioButton: document.querySelector("#start-audio-btn"),
  landscapeButton: document.querySelector("#landscape-btn"),
  overlayLandscapeButton: document.querySelector("#overlay-landscape-btn"),
  audioStatus: document.querySelector("#audio-status"),
  instrumentGrid: document.querySelector("#instrument-grid"),
  instrumentName: document.querySelector("#current-instrument-name"),
  instrumentDescription: document.querySelector("#instrument-description"),
  keyboard: document.querySelector("#keyboard"),
  volumeSlider: document.querySelector("#volume-slider"),
  volumeValue: document.querySelector("#volume-value"),
  activeNoteLabel: document.querySelector("#active-note-label"),
  activeNoteDetail: document.querySelector("#active-note-detail"),
  octaveDown: document.querySelector("#octave-down-btn"),
  octaveUp: document.querySelector("#octave-up-btn"),
  octaveRange: document.querySelector("#octave-range-label"),
  portraitOverlay: document.querySelector("#portrait-overlay"),
  sustainToggle: document.querySelector("#sustain-toggle-btn"),
  panicButton: document.querySelector("#panic-btn"),
  recordToggle: document.querySelector("#record-toggle-btn"),
  loopToggle: document.querySelector("#loop-toggle-btn"),
  clearTake: document.querySelector("#clear-take-btn"),
  takeInfo: document.querySelector("#take-info"),
  bpmSlider: document.querySelector("#bpm-slider"),
  bpmValue: document.querySelector("#bpm-value"),
  metronomeToggle: document.querySelector("#metronome-toggle-btn"),
  midiConnect: document.querySelector("#midi-connect-btn"),
  midiStatus: document.querySelector("#midi-status"),
};

class AudioEngine {
  constructor(maxPolyphony) {
    this.maxPolyphony = maxPolyphony;
    this.context = null;
    this.masterGain = null;
    this.outputCompressor = null;
    this.reverb = null;
    this.reverbInput = null;
    this.waveCache = new Map();
    this.activeVoices = new Map();
    this.voiceOrder = [];
  }

  async ensureReady() {
    if (!this.context) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error("Web Audio를 지원하지 않는 브라우저입니다.");
      }

      try {
        this.context = new AudioCtx({ latencyHint: "interactive" });
      } catch {
        this.context = new AudioCtx();
      }
      this.outputCompressor = this.context.createDynamicsCompressor();
      this.outputCompressor.threshold.value = -18;
      this.outputCompressor.knee.value = 20;
      this.outputCompressor.ratio.value = 3;
      this.outputCompressor.attack.value = 0.005;
      this.outputCompressor.release.value = 0.18;

      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = state.volume;

      this.reverb = this.context.createConvolver();
      this.reverb.buffer = this.createImpulseResponse(2.4, 1.9);

      this.reverbInput = this.context.createGain();
      this.reverbInput.gain.value = 0.35;

      this.reverbInput.connect(this.reverb);
      this.reverb.connect(this.outputCompressor);
      this.masterGain.connect(this.outputCompressor);
      this.outputCompressor.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  setVolume(nextVolume) {
    state.volume = nextVolume;
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(nextVolume, this.context.currentTime, 0.015);
    }
  }

  startVoice(sourceId, note, { velocity = 1 } = {}) {
    const preset = getInstrument();
    this.stopVoice(sourceId);

    if (!this.context) {
      return;
    }

    if (this.activeVoices.size >= this.maxPolyphony) {
      const oldestSourceId = this.voiceOrder[0];
      if (oldestSourceId) {
        this.stopVoice(oldestSourceId);
      }
    }

    const now = this.context.currentTime;
    const voiceGain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    const reverbSend = this.context.createGain();
    const vibratoOsc = preset.vibratoDepth ? this.context.createOscillator() : null;
    const vibratoGain = preset.vibratoDepth ? this.context.createGain() : null;
    const oscillators = [];

    filter.type = preset.filterType;
    filter.frequency.value = preset.filterFrequency;
    filter.Q.value = preset.filterQ;

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.connect(filter);
    filter.connect(this.masterGain);
    filter.connect(reverbSend);

    reverbSend.gain.value = preset.reverbSend;
    reverbSend.connect(this.reverbInput);

    if (vibratoOsc && vibratoGain) {
      vibratoOsc.type = "sine";
      vibratoOsc.frequency.value = preset.vibratoRate;
      vibratoGain.gain.value = preset.vibratoDepth;
      vibratoOsc.connect(vibratoGain);
    }

    const wave = this.getWave(preset.wave);

    preset.voiceMix.forEach((voicePart, voiceIndex) => {
      const oscillator = this.context.createOscillator();
      const partGain = this.context.createGain();
      const detuneJitter = voiceIndex * preset.detuneSpread;
      oscillator.setPeriodicWave(wave);
      oscillator.frequency.value = note.frequency * 2 ** (voicePart.octave || 0);
      oscillator.detune.value = (voicePart.detune || 0) + detuneJitter;
      partGain.gain.value = voicePart.gain;
      oscillator.connect(partGain);
      partGain.connect(voiceGain);
      if (vibratoGain) {
        vibratoGain.connect(oscillator.detune);
      }
      oscillator.start(now);
      oscillators.push(oscillator);
    });

    if (vibratoOsc) {
      vibratoOsc.start(now);
    }

    const peak = THREE.MathUtils.clamp(0.12 + velocity * 0.32, 0.06, 0.48);
    const sustain = Math.max(peak * preset.sustain, 0.0001);
    voiceGain.gain.cancelScheduledValues(now);
    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(peak, now + preset.attack);
    voiceGain.gain.exponentialRampToValueAtTime(
      sustain,
      now + preset.attack + preset.decay,
    );

    this.activeVoices.set(sourceId, {
      oscillators,
      vibratoOsc,
      voiceGain,
      filter,
      reverbSend,
      released: false,
      preset,
    });
    this.voiceOrder.push(sourceId);
  }

  stopVoice(sourceId) {
    const voice = this.activeVoices.get(sourceId);
    if (!voice || !this.context || voice.released) {
      return;
    }

    voice.released = true;
    const now = this.context.currentTime;
    const releaseEnd = now + voice.preset.release;
    const currentGain = Math.max(voice.voiceGain.gain.value, 0.0001);
    voice.voiceGain.gain.cancelScheduledValues(now);
    voice.voiceGain.gain.setValueAtTime(currentGain, now);
    voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);
    voice.reverbSend.gain.cancelScheduledValues(now);
    voice.reverbSend.gain.setValueAtTime(voice.reverbSend.gain.value, now);
    voice.reverbSend.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);

    voice.oscillators.forEach((oscillator) => oscillator.stop(releaseEnd + 0.05));
    voice.vibratoOsc?.stop(releaseEnd + 0.05);
    window.setTimeout(() => {
      voice.oscillators.forEach((oscillator) => oscillator.disconnect());
      voice.vibratoOsc?.disconnect();
      voice.voiceGain.disconnect();
      voice.filter.disconnect();
      voice.reverbSend.disconnect();
    }, (voice.preset.release + 0.08) * 1000);

    this.activeVoices.delete(sourceId);
    this.voiceOrder = this.voiceOrder.filter((id) => id !== sourceId);
  }

  stopAll() {
    [...this.activeVoices.keys()].forEach((sourceId) => this.stopVoice(sourceId));
  }

  createImpulseResponse(duration, decay) {
    const frameCount = Math.floor(this.context.sampleRate * duration);
    const impulse = this.context.createBuffer(2, frameCount, this.context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const channelData = impulse.getChannelData(channel);
      for (let index = 0; index < frameCount; index += 1) {
        const fade = (1 - index / frameCount) ** decay;
        channelData[index] = (Math.random() * 2 - 1) * fade;
      }
    }

    return impulse;
  }

  getWave(partials) {
    const cacheKey = partials.join("-");
    if (this.waveCache.has(cacheKey)) {
      return this.waveCache.get(cacheKey);
    }

    const real = new Float32Array(partials.length);
    const imag = new Float32Array(partials.length);
    partials.forEach((value, index) => {
      imag[index] = value;
      real[index] = 0;
    });

    const wave = this.context.createPeriodicWave(real, imag, {
      disableNormalization: false,
    });
    this.waveCache.set(cacheKey, wave);
    return wave;
  }
}

const audioEngine = new AudioEngine(MAX_POLYPHONY);
const keyElementMap = new Map();
const noteByLabelMap = new Map();
const pressedSources = new Map();
const activeNotes = new Map();
const pendingSustainSources = new Set();
const recordingSourceVoiceMap = new Map();
const midiInputHandlers = new Map();
const loopTimerIds = new Set();

let nextRecordingVoiceId = 1;
let metronomeTimerId = null;
let metronomeBeat = 0;
let loopCycleSerial = 0;
let midiAccess = null;

function getInstrument() {
  return INSTRUMENTS.find((instrument) => instrument.id === state.instrumentId) ?? INSTRUMENTS[0];
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function midiToLabel(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[midi % 12]}${octave}`;
}

function loadPreferences() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const prefs = JSON.parse(raw);
    if (INSTRUMENTS.some((instrument) => instrument.id === prefs.instrumentId)) {
      state.instrumentId = prefs.instrumentId;
    }
    const baseOctave = Number(prefs.baseOctave);
    if (Number.isFinite(baseOctave)) {
      state.baseOctave = Math.min(5, Math.max(2, Math.round(baseOctave)));
    }
    const volume = Number(prefs.volume);
    if (Number.isFinite(volume)) {
      state.volume = Math.min(1, Math.max(0, volume));
    }
    state.sustainEnabled = Boolean(prefs.sustainEnabled);
    const bpm = Number(prefs.bpm);
    if (Number.isFinite(bpm)) {
      state.bpm = Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));
    }
  } catch (error) {
    console.warn("Failed to load preferences:", error);
  }
}

function savePreferences() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        instrumentId: state.instrumentId,
        baseOctave: state.baseOctave,
        volume: state.volume,
        sustainEnabled: state.sustainEnabled,
        bpm: state.bpm,
      }),
    );
  } catch (error) {
    console.warn("Failed to save preferences:", error);
  }
}

function buildNoteRange() {
  const startMidi = (state.baseOctave + 1) * 12;
  const notes = [];
  let whiteIndex = 0;

  for (let offset = 0; offset < KEY_BINDINGS.length; offset += 1) {
    const midi = startMidi + offset;
    const pitch = midi % 12;
    const isBlack = NOTE_NAMES[pitch].includes("#");
    const note = {
      midi,
      label: midiToLabel(midi),
      bind: KEY_BINDINGS[offset],
      frequency: midiToFrequency(midi),
      isBlack,
    };

    if (!isBlack) {
      note.whiteIndex = whiteIndex;
      whiteIndex += 1;
    } else {
      note.blackOffset = whiteIndex;
    }

    notes.push(note);
  }

  const whiteCount = notes.filter((note) => !note.isBlack).length;
  notes.forEach((note) => {
    if (!note.isBlack) {
      return;
    }
    note.blackLeft = note.blackOffset / whiteCount;
    delete note.blackOffset;
  });
  return notes;
}

function refreshNoteRange() {
  state.notes = buildNoteRange();
  noteByLabelMap.clear();
  state.notes.forEach((note) => {
    noteByLabelMap.set(note.label, note);
  });
}

function renderInstrumentCards() {
  ui.instrumentGrid.innerHTML = "";

  INSTRUMENTS.forEach((instrument, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "instrument-card";
    button.setAttribute("role", "radio");
    button.dataset.instrument = instrument.id;
    button.setAttribute("aria-checked", instrument.id === state.instrumentId ? "true" : "false");
    button.tabIndex = instrument.id === state.instrumentId ? 0 : -1;
    button.innerHTML = `
      <span class="instrument-card__korean">${instrument.korean}</span>
      <strong class="instrument-card__english">${instrument.english}</strong>
      <span class="instrument-card__detail">${instrument.detail}</span>
    `;

    button.addEventListener("click", () => {
      selectInstrumentByIndex(index);
      if (state.audioReady) {
        playPreview();
      }
    });

    button.addEventListener("keydown", (event) => {
      if (event.code !== "ArrowRight" && event.code !== "ArrowDown" && event.code !== "ArrowLeft" && event.code !== "ArrowUp") {
        return;
      }
      event.preventDefault();
      const delta = event.code === "ArrowRight" || event.code === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + delta + INSTRUMENTS.length) % INSTRUMENTS.length;
      selectInstrumentByIndex(nextIndex);
      const nextButton = ui.instrumentGrid.querySelector(
        `[data-instrument="${INSTRUMENTS[nextIndex].id}"]`,
      );
      if (nextButton instanceof HTMLButtonElement) {
        nextButton.focus();
      }
    });

    ui.instrumentGrid.append(button);
  });
}

function selectInstrumentByIndex(index) {
  const instrument = INSTRUMENTS[index];
  if (!instrument) {
    return;
  }
  state.instrumentId = instrument.id;
  syncInstrumentState();
  savePreferences();
}

function pointerSourceId(pointerId) {
  return `pointer-${pointerId}`;
}

function getNoteFromPointer(clientX, clientY) {
  const element = document.elementFromPoint(clientX, clientY);
  if (!(element instanceof Element)) {
    return null;
  }
  const key = element.closest(".key");
  if (!(key instanceof HTMLElement)) {
    return null;
  }
  return noteByLabelMap.get(key.dataset.note || "") ?? null;
}

function handlePointerMove(event) {
  const sourceId = pointerSourceId(event.pointerId);
  if (!pressedSources.has(sourceId)) {
    return;
  }

  const hoveredNote = getNoteFromPointer(event.clientX, event.clientY);
  if (!hoveredNote) {
    return;
  }

  const currentNote = pressedSources.get(sourceId);
  if (!currentNote || currentNote.label === hoveredNote.label) {
    return;
  }

  startPlaying(sourceId, hoveredNote);
}

function handlePointerStop(event) {
  stopPlaying(pointerSourceId(event.pointerId));
}

function renderKeyboard() {
  const notes = state.notes;
  const whiteCount = notes.filter((note) => !note.isBlack).length;
  document.documentElement.style.setProperty("--white-count", String(whiteCount));
  ui.keyboard.innerHTML = "";
  keyElementMap.clear();

  notes.forEach((note) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = `key ${note.isBlack ? "key--black" : "key--white"}`;
    key.dataset.note = note.label;
    key.setAttribute("aria-label", `${note.label} key`);

    if (note.isBlack) {
      key.style.setProperty("--black-left", String(note.blackLeft));
    } else {
      key.style.setProperty("--white-index", String(note.whiteIndex));
    }

    key.innerHTML = `
      <span class="key__note">${note.label}</span>
      <span class="key__bind">${note.bind}</span>
    `;

    key.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const sourceId = pointerSourceId(event.pointerId);
      try {
        key.setPointerCapture(event.pointerId);
      } catch {
        // Some mobile browsers can reject capture when pointer release timing is tight.
      }
      activateAudioIfNeeded().then(() => {
        startPlaying(sourceId, note);
      });
    });

    key.addEventListener("pointermove", handlePointerMove);
    key.addEventListener("pointerup", handlePointerStop);
    key.addEventListener("pointercancel", handlePointerStop);
    key.addEventListener("lostpointercapture", handlePointerStop);

    ui.keyboard.append(key);
    keyElementMap.set(note.label, key);
  });

  const startLabel = notes[0].label;
  const endLabel = notes.at(-1).label;
  ui.octaveRange.textContent = `${startLabel} - ${endLabel}`;
}

function syncInstrumentState() {
  const instrument = getInstrument();
  document.documentElement.style.setProperty("--accent", instrument.accent);
  document.documentElement.style.setProperty("--accent-soft", `${instrument.accent}33`);
  ui.instrumentName.textContent = instrument.english;
  ui.instrumentDescription.textContent = instrument.detail;

  document.querySelectorAll(".instrument-card").forEach((button) => {
    const selected = button.dataset.instrument === instrument.id;
    button.setAttribute("aria-checked", selected ? "true" : "false");
    button.tabIndex = selected ? 0 : -1;
  });
}

function syncSustainState() {
  ui.sustainToggle.setAttribute("aria-pressed", state.sustainEnabled ? "true" : "false");
  ui.sustainToggle.textContent = state.sustainEnabled ? "Sustain ON" : "Sustain OFF";
  ui.sustainToggle.classList.toggle("is-on", state.sustainEnabled);
}

function syncRecorderState() {
  ui.recordToggle.textContent = state.recordingActive ? "Stop Recording" : "Record";
  ui.recordToggle.classList.toggle("is-on", state.recordingActive);
}

function syncLoopState() {
  const hasTake = state.takeEvents.length > 0;
  ui.loopToggle.disabled = !hasTake;
  ui.loopToggle.setAttribute("aria-pressed", state.loopEnabled ? "true" : "false");
  ui.loopToggle.textContent = state.loopEnabled ? "Loop ON" : "Loop OFF";
  ui.loopToggle.classList.toggle("is-on", state.loopEnabled);
}

function syncBpmState() {
  ui.bpmSlider.value = String(state.bpm);
  ui.bpmValue.textContent = `${state.bpm} BPM`;
}

function syncMetronomeState() {
  ui.metronomeToggle.setAttribute("aria-pressed", state.metronomeEnabled ? "true" : "false");
  ui.metronomeToggle.textContent = state.metronomeEnabled ? "Metronome ON" : "Metronome OFF";
  ui.metronomeToggle.classList.toggle("is-on", state.metronomeEnabled);
}

function updateTakeInfo() {
  if (!state.takeEvents.length) {
    ui.takeInfo.textContent = "테이크 없음";
    return;
  }
  const noteOnCount = state.takeEvents.filter((event) => event.type === "on").length;
  const seconds = (state.takeDurationMs / 1000).toFixed(2);
  ui.takeInfo.textContent = `${seconds}s · ${noteOnCount} notes`;
}

function updateMidiStatus(text) {
  ui.midiStatus.textContent = text;
}

function isRecordableSource(sourceId) {
  return (
    sourceId.startsWith("keyboard-")
    || sourceId.startsWith("pointer-")
    || sourceId.startsWith("midi-")
  );
}

function getNoteByMidi(midi) {
  const label = midiToLabel(midi);
  return noteByLabelMap.get(label) ?? {
    midi,
    label,
    bind: "",
    frequency: midiToFrequency(midi),
    isBlack: NOTE_NAMES[midi % 12].includes("#"),
  };
}

function recordNoteOn(sourceId, note, velocity = 1) {
  if (!state.recordingActive || !isRecordableSource(sourceId)) {
    return;
  }
  let voiceId = recordingSourceVoiceMap.get(sourceId);
  if (!voiceId) {
    voiceId = `v${nextRecordingVoiceId}`;
    nextRecordingVoiceId += 1;
    recordingSourceVoiceMap.set(sourceId, voiceId);
  }
  const at = performance.now() - state.takeStartedAtMs;
  state.takeEvents.push({
    type: "on",
    at,
    voiceId,
    midi: note.midi,
    velocity: Number.isFinite(velocity) ? velocity : 1,
  });
  state.takeDurationMs = Math.max(state.takeDurationMs, at);
  updateTakeInfo();
}

function recordNoteOff(sourceId) {
  if (!state.recordingActive || !isRecordableSource(sourceId)) {
    return;
  }
  const voiceId = recordingSourceVoiceMap.get(sourceId);
  if (!voiceId) {
    return;
  }
  const at = performance.now() - state.takeStartedAtMs;
  state.takeEvents.push({
    type: "off",
    at,
    voiceId,
  });
  state.takeDurationMs = Math.max(state.takeDurationMs, at);
  recordingSourceVoiceMap.delete(sourceId);
  updateTakeInfo();
}

function clearLoopTimers() {
  loopTimerIds.forEach((timerId) => window.clearTimeout(timerId));
  loopTimerIds.clear();
}

function stopLoopPlayback() {
  clearLoopTimers();
  loopCycleSerial += 1;
  state.loopActive = false;
  [...pressedSources.keys()].forEach((sourceId) => {
    if (sourceId.startsWith("loop-")) {
      forceStopSource(sourceId, { track: false });
    }
  });
  updateNowPlaying();
}

function scheduleLoopPlaybackCycle() {
  if (!state.loopEnabled || state.recordingActive || !state.takeEvents.length) {
    state.loopActive = false;
    return;
  }

  state.loopActive = true;
  const cycleId = ++loopCycleSerial;
  const playbackVoiceMap = new Map();
  const duration = Math.max(state.takeDurationMs, 180);

  state.takeEvents.forEach((event, index) => {
    const timerId = window.setTimeout(() => {
      if (!state.loopEnabled || cycleId !== loopCycleSerial) {
        return;
      }
      if (event.type === "on") {
        const note = getNoteByMidi(event.midi);
        const sourceId = `loop-${cycleId}-${event.voiceId}-${index}`;
        playbackVoiceMap.set(event.voiceId, sourceId);
        startPlaying(sourceId, note, { track: false, velocity: event.velocity ?? 1 });
      } else {
        const sourceId = playbackVoiceMap.get(event.voiceId);
        if (!sourceId) {
          return;
        }
        stopPlaying(sourceId, { force: true, track: false });
        playbackVoiceMap.delete(event.voiceId);
      }
    }, Math.max(0, event.at));
    loopTimerIds.add(timerId);
  });

  const cycleEndId = window.setTimeout(() => {
    playbackVoiceMap.forEach((sourceId) => {
      stopPlaying(sourceId, { force: true, track: false });
    });
    if (state.loopEnabled && !state.recordingActive) {
      scheduleLoopPlaybackCycle();
    } else {
      state.loopActive = false;
      updateNowPlaying();
    }
  }, duration + 40);
  loopTimerIds.add(cycleEndId);
  updateNowPlaying();
}

function setLoopEnabled(enabled) {
  if (enabled && !state.takeEvents.length) {
    ui.audioStatus.textContent = "루프할 테이크가 없습니다. 먼저 녹음해 주세요.";
    return;
  }
  if (enabled && state.recordingActive) {
    ui.audioStatus.textContent = "녹음 중에는 루프를 켤 수 없습니다.";
    return;
  }
  if (state.loopEnabled === enabled) {
    return;
  }
  state.loopEnabled = enabled;
  syncLoopState();

  if (enabled) {
    panicAllNotes("", { track: false });
    scheduleLoopPlaybackCycle();
  } else {
    stopLoopPlayback();
  }
  updateNowPlaying();
}

function toggleLoop() {
  setLoopEnabled(!state.loopEnabled);
}

function finalizeRecordingOpenVoices() {
  if (!state.recordingActive) {
    return;
  }
  const at = performance.now() - state.takeStartedAtMs;
  const uniqueVoiceIds = new Set(recordingSourceVoiceMap.values());
  uniqueVoiceIds.forEach((voiceId) => {
    state.takeEvents.push({
      type: "off",
      at,
      voiceId,
    });
  });
  state.takeDurationMs = Math.max(state.takeDurationMs, at);
  recordingSourceVoiceMap.clear();
}

function startRecording() {
  if (state.recordingActive) {
    return;
  }
  if (state.loopEnabled) {
    setLoopEnabled(false);
  }

  panicAllNotes("", { track: false });
  state.recordingActive = true;
  state.takeStartedAtMs = performance.now();
  state.takeDurationMs = 0;
  state.takeEvents = [];
  recordingSourceVoiceMap.clear();
  nextRecordingVoiceId = 1;
  syncRecorderState();
  syncLoopState();
  updateTakeInfo();
  ui.audioStatus.textContent = "녹음 시작";
}

function stopRecording() {
  if (!state.recordingActive) {
    return;
  }
  finalizeRecordingOpenVoices();
  state.recordingActive = false;
  state.takeDurationMs = Math.max(state.takeDurationMs, 120);
  state.takeEvents.sort((a, b) => a.at - b.at);
  syncRecorderState();
  syncLoopState();
  updateTakeInfo();
  ui.audioStatus.textContent = state.takeEvents.length
    ? "녹음 완료"
    : "녹음된 이벤트가 없습니다.";
}

function toggleRecording() {
  if (state.recordingActive) {
    stopRecording();
  } else {
    startRecording();
  }
}

function clearTake() {
  if (state.recordingActive) {
    stopRecording();
  }
  setLoopEnabled(false);
  state.takeEvents = [];
  state.takeDurationMs = 0;
  updateTakeInfo();
  syncLoopState();
  ui.audioStatus.textContent = "테이크를 삭제했습니다.";
}

function playMetronomeClick(accent = false) {
  if (!audioEngine.context || !audioEngine.masterGain) {
    return;
  }
  const now = audioEngine.context.currentTime;
  const oscillator = audioEngine.context.createOscillator();
  const gain = audioEngine.context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = accent ? 1480 : 980;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
  oscillator.connect(gain);
  gain.connect(audioEngine.masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.07);
}

function restartMetronomeTimer() {
  if (metronomeTimerId) {
    window.clearInterval(metronomeTimerId);
    metronomeTimerId = null;
  }
  if (!state.metronomeEnabled) {
    return;
  }
  const intervalMs = Math.round(60000 / state.bpm);
  metronomeBeat = 0;
  playMetronomeClick(true);
  metronomeBeat += 1;
  metronomeTimerId = window.setInterval(() => {
    const accent = metronomeBeat % 4 === 0;
    playMetronomeClick(accent);
    metronomeBeat += 1;
  }, intervalMs);
}

function setMetronomeEnabled(enabled) {
  if (state.metronomeEnabled === enabled) {
    return;
  }
  state.metronomeEnabled = enabled;
  syncMetronomeState();
  if (enabled) {
    activateAudioIfNeeded({ attemptLandscape: false }).then(() => {
      restartMetronomeTimer();
    });
  } else {
    restartMetronomeTimer();
  }
  updateNowPlaying();
}

function toggleMetronome() {
  setMetronomeEnabled(!state.metronomeEnabled);
}

function updateBpm({ persist = false } = {}) {
  const raw = Number(ui.bpmSlider.value);
  state.bpm = Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(raw)));
  syncBpmState();
  if (state.metronomeEnabled) {
    restartMetronomeTimer();
  }
  if (persist) {
    savePreferences();
  }
}

function handleMidiMessage(event) {
  const [status = 0, noteNumber = 0, velocityByte = 0] = event.data || [];
  const command = status & 0xf0;
  const velocity = Math.min(1, Math.max(0, velocityByte / 127));
  const sourceId = `midi-${noteNumber}`;

  if (command === 0x90 && velocity > 0) {
    const note = getNoteByMidi(noteNumber);
    activateAudioIfNeeded({ attemptLandscape: false }).then(() => {
      startPlaying(sourceId, note, { velocity });
    });
    return;
  }

  if (command === 0x80 || (command === 0x90 && velocityByte === 0)) {
    stopPlaying(sourceId);
  }
}

function bindMidiInputs() {
  midiInputHandlers.forEach((_, inputId) => {
    const existing = midiAccess?.inputs.get(inputId);
    if (existing) {
      existing.onmidimessage = null;
    }
  });
  midiInputHandlers.clear();

  if (!midiAccess) {
    updateMidiStatus("MIDI 미연결");
    return;
  }

  let inputCount = 0;
  midiAccess.inputs.forEach((input) => {
    input.onmidimessage = handleMidiMessage;
    midiInputHandlers.set(input.id, true);
    inputCount += 1;
  });
  if (inputCount > 0) {
    updateMidiStatus(`MIDI 입력 ${inputCount}개 연결`);
    ui.midiConnect.textContent = "MIDI 다시 검색";
  } else {
    updateMidiStatus("MIDI 장치를 찾지 못했습니다.");
    ui.midiConnect.textContent = "MIDI 다시 검색";
  }
}

async function connectMidi() {
  if (!state.midiSupported) {
    updateMidiStatus("이 브라우저는 Web MIDI를 지원하지 않습니다.");
    return;
  }

  try {
    if (!midiAccess) {
      midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      midiAccess.onstatechange = () => {
        bindMidiInputs();
      };
    }
    bindMidiInputs();
  } catch (error) {
    updateMidiStatus("MIDI 권한 요청이 거부되었거나 실패했습니다.");
    console.warn("MIDI connect failed:", error);
  }
}

function noteDisplayText() {
  if (!activeNotes.size) {
    return "Ready for the first chord";
  }

  return [...activeNotes.keys()].join("  ·  ");
}

function updateNowPlaying() {
  ui.activeNoteLabel.textContent = noteDisplayText();
  const flags = [];
  if (state.sustainEnabled) {
    flags.push("Sustain ON");
  }
  if (state.recordingActive) {
    flags.push("Recording");
  }
  if (state.loopEnabled) {
    flags.push(state.loopActive ? "Loop Playing" : "Loop Armed");
  }
  if (state.metronomeEnabled) {
    flags.push(`Metronome ${state.bpm} BPM`);
  }
  const statusSuffix = flags.length ? ` · ${flags.join(" · ")}` : "";

  if (activeNotes.size) {
    ui.activeNoteDetail.textContent = `${getInstrument().english} · ${activeNotes.size} note${activeNotes.size > 1 ? "s" : ""}${statusSuffix}`;
  } else if (state.sustainEnabled) {
    ui.activeNoteDetail.textContent = `Sustain ON · 음을 누르면 길게 유지됩니다.${statusSuffix.replace(" · Sustain ON", "")}`;
  } else {
    ui.activeNoteDetail.textContent = `A / W / S / E 또는 터치로 연주할 수 있습니다.${statusSuffix}`;
  }
}

function markKey(noteLabel, active) {
  const key = keyElementMap.get(noteLabel);
  if (key) {
    key.classList.toggle("is-active", active);
    if (active) {
      key.classList.remove("is-hit");
      void key.offsetWidth;
      key.classList.add("is-hit");
    }
  }
}

function noteReferencedElsewhere(noteLabel, excludedSourceId = null) {
  for (const [sourceId, note] of pressedSources.entries()) {
    if (sourceId === excludedSourceId) {
      continue;
    }
    if (note.label === noteLabel) {
      return true;
    }
  }
  return false;
}

function startPlaying(sourceId, note, { track = true, velocity = 1 } = {}) {
  if (!note) {
    return;
  }

  const shouldTrack = track && isRecordableSource(sourceId);
  const previous = pressedSources.get(sourceId);
  if (previous && previous.label !== note.label) {
    if (shouldTrack) {
      recordNoteOff(sourceId);
    }
    if (!noteReferencedElsewhere(previous.label, sourceId)) {
      activeNotes.delete(previous.label);
      markKey(previous.label, false);
    }
  }

  pendingSustainSources.delete(sourceId);
  pressedSources.set(sourceId, note);
  audioEngine.startVoice(sourceId, note, { velocity });
  activeNotes.set(note.label, note);
  markKey(note.label, true);
  if (shouldTrack) {
    recordNoteOn(sourceId, note, velocity);
  }
  updateNowPlaying();
}

function forceStopSource(sourceId, { track = true } = {}) {
  const note = pressedSources.get(sourceId);
  if (!note) {
    return;
  }
  if (track) {
    recordNoteOff(sourceId);
  }
  audioEngine.stopVoice(sourceId);
  pendingSustainSources.delete(sourceId);
  pressedSources.delete(sourceId);
  if (!noteReferencedElsewhere(note.label)) {
    activeNotes.delete(note.label);
    markKey(note.label, false);
  }
}

function stopPlaying(sourceId, { force = false, track = true } = {}) {
  const note = pressedSources.get(sourceId);
  if (!note) {
    return;
  }

  if (state.sustainEnabled && !force) {
    pendingSustainSources.add(sourceId);
    updateNowPlaying();
    return;
  }

  forceStopSource(sourceId, { track });
  updateNowPlaying();
}

function flushSustainSources({ track = true } = {}) {
  const targets = [...pendingSustainSources];
  targets.forEach((sourceId) => forceStopSource(sourceId, { track }));
  updateNowPlaying();
}

function panicAllNotes(statusMessage = "모든 음을 정지했습니다.", { track = false } = {}) {
  const sources = [...pressedSources.keys()];
  sources.forEach((sourceId) => {
    forceStopSource(sourceId, { track });
  });
  pendingSustainSources.clear();
  if (statusMessage) {
    ui.audioStatus.textContent = statusMessage;
  }
  updateNowPlaying();
}

function setSustainEnabled(enabled) {
  if (state.sustainEnabled === enabled) {
    return;
  }
  state.sustainEnabled = enabled;
  syncSustainState();
  if (!enabled) {
    flushSustainSources();
  } else {
    updateNowPlaying();
  }
  savePreferences();
}

function toggleSustain() {
  setSustainEnabled(!state.sustainEnabled);
}

async function activateAudioIfNeeded({ attemptLandscape = true } = {}) {
  await audioEngine.ensureReady();
  state.audioReady = true;
  ui.audioButton.textContent = "오디오 준비 완료";
  ui.audioStatus.textContent = `오디오 엔진 활성화 · 최대 ${MAX_POLYPHONY}음 동시 재생`;
  if (attemptLandscape) {
    await requestLandscapeMode();
  }
}

async function requestLandscapeMode({ force = false } = {}) {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (!isMobile) {
    return;
  }
  if (state.landscapeAttempted && !force) {
    return;
  }
  state.landscapeAttempted = true;

  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Fullscreen can fail on browsers that require specific gestures.
  }

  try {
    if (screen.orientation?.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch {
    ui.audioStatus.textContent = "브라우저 제한으로 자동 가로 잠금이 실패하면 직접 회전해 주세요.";
  }
}

function playPreview() {
  const previewNote = state.notes[5];
  if (!previewNote) {
    return;
  }
  const previewId = "preview";
  startPlaying(previewId, previewNote, { track: false });
  window.setTimeout(() => stopPlaying(previewId, { force: true }), 320);
}

function isTypingBlockedByInput() {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) {
    return false;
  }
  if (activeElement instanceof HTMLInputElement) {
    return true;
  }
  return activeElement.isContentEditable;
}

function handleKeyboardDown(event) {
  if (event.repeat) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    toggleSustain();
    return;
  }

  if (event.code === "Escape") {
    event.preventDefault();
    panicAllNotes("긴급 정지: 모든 음을 정지했습니다.");
    setLoopEnabled(false);
    if (state.recordingActive) {
      stopRecording();
    }
    return;
  }

  if (isTypingBlockedByInput()) {
    return;
  }

  if (event.code === "KeyR") {
    event.preventDefault();
    toggleRecording();
    return;
  }

  if (event.code === "KeyL") {
    event.preventDefault();
    toggleLoop();
    return;
  }

  if (event.code === "KeyM") {
    event.preventDefault();
    toggleMetronome();
    return;
  }

  const noteIndex = KEY_EVENT_MAP.get(event.code);
  if (noteIndex == null) {
    return;
  }

  const note = state.notes[noteIndex];
  if (!note) {
    return;
  }

  event.preventDefault();
  activateAudioIfNeeded().then(() => {
    startPlaying(`keyboard-${event.code}`, note);
  });
}

function handleKeyboardUp(event) {
  const noteIndex = KEY_EVENT_MAP.get(event.code);
  if (noteIndex == null) {
    return;
  }
  event.preventDefault();
  stopPlaying(`keyboard-${event.code}`);
}

function updateVolume({ persist = false } = {}) {
  const volume = Number(ui.volumeSlider.value) / 100;
  ui.volumeValue.textContent = `${ui.volumeSlider.value}%`;
  audioEngine.setVolume(volume);
  if (persist) {
    savePreferences();
  }
}

function shiftOctave(direction) {
  const nextOctave = Math.min(5, Math.max(2, state.baseOctave + direction));
  if (nextOctave === state.baseOctave) {
    return;
  }

  panicAllNotes("");
  state.baseOctave = nextOctave;
  refreshNoteRange();
  renderKeyboard();
  updateNowPlaying();
  savePreferences();
}

function syncOrientationState() {
  state.portraitMode =
    window.matchMedia("(max-width: 900px) and (orientation: portrait)").matches;
  ui.portraitOverlay.setAttribute("aria-hidden", state.portraitMode ? "false" : "true");
}

function wireEvents() {
  ui.audioButton.addEventListener("click", () => {
    activateAudioIfNeeded();
  });
  ui.landscapeButton.addEventListener("click", () => {
    requestLandscapeMode({ force: true });
  });
  ui.overlayLandscapeButton.addEventListener("click", () => {
    requestLandscapeMode({ force: true });
  });
  ui.volumeSlider.addEventListener("input", () => updateVolume());
  ui.volumeSlider.addEventListener("change", () => updateVolume({ persist: true }));
  ui.bpmSlider.addEventListener("input", () => updateBpm());
  ui.bpmSlider.addEventListener("change", () => updateBpm({ persist: true }));
  ui.octaveDown.addEventListener("click", () => shiftOctave(-1));
  ui.octaveUp.addEventListener("click", () => shiftOctave(1));
  ui.sustainToggle.addEventListener("click", toggleSustain);
  ui.panicButton.addEventListener("click", () => {
    panicAllNotes();
    setLoopEnabled(false);
  });
  ui.recordToggle.addEventListener("click", toggleRecording);
  ui.loopToggle.addEventListener("click", toggleLoop);
  ui.clearTake.addEventListener("click", clearTake);
  ui.metronomeToggle.addEventListener("click", toggleMetronome);
  ui.midiConnect.addEventListener("click", connectMidi);
  document.addEventListener("keydown", handleKeyboardDown);
  document.addEventListener("keyup", handleKeyboardUp);
  window.addEventListener("blur", () => {
    panicAllNotes("", { track: state.recordingActive });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      panicAllNotes("", { track: state.recordingActive });
    }
  });

  const orientationQuery = window.matchMedia("(max-width: 900px) and (orientation: portrait)");
  if (orientationQuery.addEventListener) {
    orientationQuery.addEventListener("change", syncOrientationState);
  } else {
    orientationQuery.addListener(syncOrientationState);
  }
}

function init() {
  loadPreferences();
  refreshNoteRange();
  renderInstrumentCards();
  renderKeyboard();
  syncInstrumentState();
  syncSustainState();
  syncRecorderState();
  syncLoopState();
  syncMetronomeState();
  syncBpmState();
  updateTakeInfo();
  ui.volumeSlider.value = String(Math.round(state.volume * 100));
  updateVolume();
  updateBpm();
  updateNowPlaying();
  syncOrientationState();
  if (state.midiSupported) {
    updateMidiStatus("MIDI 미연결");
    ui.midiConnect.textContent = "MIDI 연결";
  } else {
    updateMidiStatus("Web MIDI 미지원 브라우저");
    ui.midiConnect.disabled = true;
    ui.midiConnect.textContent = "MIDI 미지원";
  }
  wireEvents();
}

init();
