// Simple Synthesized Piano Engine (Optimized for reliability and click-free audio)
class PianoEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.activeNodes = new Map(); // Keep track of active note oscillators
    this.volume = 0.7;
  }

  async init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      alert("이 브라우저는 Web Audio API를 지원하지 않습니다.");
      return;
    }
    this.ctx = new AudioCtx({ latencyHint: "interactive" });
    
    // Compressor to prevent distortion on polyphonic chords
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -16;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.08;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  setVolume(volumePercent) {
    this.volume = volumePercent / 100;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01);
    }
  }

  async startNote(noteName, frequency) {
    await this.init();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    // Stop existing voice if already playing to avoid overlap
    this.stopNote(noteName);

    const now = this.ctx.currentTime;

    // Create dual oscillators for a richer harmonic tone (Grand Piano style)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Fundamental tone (Triangle wave has a soft, wood-like attack)
    osc1.type = "triangle";
    osc1.frequency.value = frequency;

    // Harmonic helper (Sine wave at double frequency / +1 octave for clarity)
    osc2.type = "sine";
    osc2.frequency.value = frequency * 2;
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = 0.25; // Quiet background overtone

    // ADSR Envelope to prevent clicks
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1.0, now + 0.006); // Quick, punchy attack
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.25); // Gentle decay

    // Connect nodes
    osc1.connect(gainNode);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    this.activeNodes.set(noteName, {
      oscillators: [osc1, osc2],
      gainNode: gainNode
    });
  }

  stopNote(noteName) {
    if (!this.activeNodes.has(noteName) || !this.ctx) return;

    const voice = this.activeNodes.get(noteName);
    this.activeNodes.delete(noteName);

    const now = this.ctx.currentTime;
    // Release phase
    try {
      voice.gainNode.gain.cancelScheduledValues(now);
      voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
      voice.gainNode.gain.setTargetAtTime(0, now, 0.12); // Smooth fade out

      // Stop oscillators after fade out completes to avoid clips
      setTimeout(() => {
        try {
          voice.oscillators.forEach(osc => osc.stop());
        } catch (e) {}
      }, 800);
    } catch (e) {}
  }
}

const piano = new PianoEngine();

// Scale definitions: C4 to C5 (including accidentals)
const KEYBOARD_CONFIG = [
  { note: "C4", freq: 261.63, type: "white", key: "A" },
  { note: "C#4", freq: 277.18, type: "black", key: "W" },
  { note: "D4", freq: 293.66, type: "white", key: "S" },
  { note: "D#4", freq: 311.13, type: "black", key: "E" },
  { note: "E4", freq: 329.63, type: "white", key: "D" },
  { note: "F4", freq: 349.23, type: "white", key: "F" },
  { note: "F#4", freq: 369.99, type: "black", key: "T" },
  { note: "G4", freq: 392.00, type: "white", key: "G" },
  { note: "G#4", freq: 415.30, type: "black", key: "Y" },
  { note: "A4", freq: 440.00, type: "white", key: "H" },
  { note: "A#4", freq: 466.16, type: "black", key: "U" },
  { note: "B4", freq: 493.88, type: "white", key: "J" },
  { note: "C5", freq: 523.25, type: "white", key: "K" },
  { note: "C#5", freq: 554.37, type: "black", key: "O" },
  { note: "D5", freq: 587.33, type: "white", key: "L" },
  { note: "D#5", freq: 622.25, type: "black", key: "P" },
  { note: "E5", freq: 659.25, type: "white", key: ";" },
  { note: "F5", freq: 698.46, type: "white", key: "'" }
];

// Generate visual keyboard elements
const keyboardContainer = document.getElementById("keyboard");
const activeKeysMap = new Map();

function buildKeyboard() {
  keyboardContainer.innerHTML = "";
  
  // To handle overlay offsets, black keys are appended relative to parent white keys
  // and positioned absolutely.
  KEYBOARD_CONFIG.forEach(cfg => {
    const keyEl = document.createElement("div");
    keyEl.className = `key ${cfg.type}`;
    keyEl.dataset.note = cfg.note;
    
    const labelEl = document.createElement("div");
    labelEl.className = "key-label";
    labelEl.innerText = cfg.key;
    keyEl.appendChild(labelEl);
    
    // Bind touch/mouse events
    keyEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      triggerNoteStart(cfg.note, cfg.freq);
    });
    keyEl.addEventListener("mouseup", () => triggerNoteEnd(cfg.note));
    keyEl.addEventListener("mouseleave", () => triggerNoteEnd(cfg.note));

    keyEl.addEventListener("touchstart", (e) => {
      e.preventDefault();
      triggerNoteStart(cfg.note, cfg.freq);
    });
    keyEl.addEventListener("touchend", (e) => {
      e.preventDefault();
      triggerNoteEnd(cfg.note);
    });

    keyboardContainer.appendChild(keyEl);
    activeKeysMap.set(cfg.note, keyEl);
  });
}

function triggerNoteStart(noteName, frequency) {
  piano.startNote(noteName, frequency);
  const keyEl = activeKeysMap.get(noteName);
  if (keyEl) keyEl.classList.add("active");
  
  // Keep start button in active visual state once user triggers sound
  const startBtn = document.getElementById("start-btn");
  if (startBtn && !startBtn.classList.contains("active")) {
    startBtn.classList.add("active");
    startBtn.innerText = "소리 활성화됨";
  }
}

function triggerNoteEnd(noteName) {
  piano.stopNote(noteName);
  const keyEl = activeKeysMap.get(noteName);
  if (keyEl) keyEl.classList.remove("active");
}

// Bind Keyboard Listeners
const keyToNoteMap = new Map(KEYBOARD_CONFIG.map(cfg => [cfg.key.toUpperCase(), cfg]));

window.addEventListener("keydown", (e) => {
  if (e.repeat) return; // Prevent repeat triggers
  const keyUpper = e.key.toUpperCase();
  const matched = keyToNoteMap.get(keyUpper) || (e.key === ";" ? keyToNoteMap.get(";") : null) || (e.key === "'" ? keyToNoteMap.get("'") : null);
  if (matched) {
    triggerNoteStart(matched.note, matched.freq);
  }
});

window.addEventListener("keyup", (e) => {
  const keyUpper = e.key.toUpperCase();
  const matched = keyToNoteMap.get(keyUpper) || (e.key === ";" ? keyToNoteMap.get(";") : null) || (e.key === "'" ? keyToNoteMap.get("'") : null);
  if (matched) {
    triggerNoteEnd(matched.note);
  }
});

// UI Event Binding
document.getElementById("start-btn").addEventListener("click", async () => {
  await piano.init();
  if (piano.ctx && piano.ctx.state === "suspended") {
    await piano.ctx.resume();
  }
  const btn = document.getElementById("start-btn");
  btn.classList.add("active");
  btn.innerText = "소리 활성화됨";
});

const volumeSlider = document.getElementById("volume-control");
const volumeDisplay = document.getElementById("volume-display");
volumeSlider.addEventListener("input", (e) => {
  const val = e.target.value;
  volumeDisplay.innerText = `${val}%`;
  piano.setVolume(val);
});

// Initialize keyboard layouts
buildKeyboard();
