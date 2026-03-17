let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function beep(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playCriticalAlert() {
  beep(880, 0.15, "square", 0.25);
  setTimeout(() => beep(660, 0.15, "square", 0.25), 180);
  setTimeout(() => beep(880, 0.3, "square", 0.25), 360);
}

export function playWarningAlert() {
  beep(660, 0.2, "sine", 0.2);
  setTimeout(() => beep(550, 0.25, "sine", 0.2), 280);
}

export function playDispatchAlert() {
  beep(440, 0.1, "sine", 0.18);
  setTimeout(() => beep(550, 0.1, "sine", 0.18), 130);
  setTimeout(() => beep(660, 0.2, "sine", 0.18), 260);
}

export function playPanicAlert() {
  for (let i = 0; i < 4; i++) {
    setTimeout(() => beep(1200, 0.12, "sawtooth", 0.2), i * 200);
    setTimeout(() => beep(800, 0.12, "sawtooth", 0.2), i * 200 + 120);
  }
}
