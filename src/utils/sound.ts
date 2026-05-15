let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

// Synthesise a coin-rattle burst using filtered noise
function playNoiseBurst(ctx: AudioContext, startTime: number, duration: number, gain: number) {
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Bandpass around coin-clink frequencies (~3–6 kHz)
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 4500;
  bandpass.Q.value = 0.8;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(startTime);
  source.stop(startTime + duration);
}

export function playShakeSound() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // 5–6 quick coin bursts to mimic shaking three coins
    const bursts = [0, 0.04, 0.09, 0.15, 0.22, 0.28];
    const gains  = [0.6, 0.9, 0.7, 0.85, 0.5, 0.4];
    bursts.forEach((offset, i) =>
      playNoiseBurst(ctx, now + offset, 0.08, gains[i])
    );
  } catch {
    // Silently ignore — audio isn't critical
  }
}
