import confetti from 'canvas-confetti';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 8-bit Minecraft style XP orb sound
export function playXpOrbSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Classic Minecraft XP chime pitch bend
    const startFreq = 800 + Math.random() * 200;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Minecraft Level Up fanfare (retro chiptune arpeggio)
export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.001, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.3);
    });
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Minecraft wooden button / stone click
export function playBlockClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(80, now + 0.02);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {
    console.warn('Click pop error', e);
  }
}

// Minecraft Anvil / Crafting Ding
export function playCraftSuccess() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two bright metallic chimes
    [1046.5, 1567.98].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  } catch (e) {
    console.warn('Craft error', e);
  }
}

// Gentle "ooff" / try again sound
export function playGentleTryAgain() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Minecraft celebration confetti (emerald green, diamond blue, gold, redstone)
export function triggerCelebrationConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#4b8b29', '#55ff55', '#2ea6a6', '#5de5e5', '#df9e10', '#ff5555'],
    });
  } catch (e) {
    console.warn('Confetti error', e);
  }
}

// Clear English Web Speech synthesis
export function speakWord(text: string, slow: boolean = false): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = slow ? 0.65 : 0.85;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && !v.name.includes('Bad')
  );
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}
