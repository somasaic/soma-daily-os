/**
 * Synthesizes a friendly 4-beep alarm notification sound using standard browser Web Audio API.
 * This is 100% offline friendly and requires no static asset files.
 */
export function playAlarm() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const beep = (freq, start, dur) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      
      o.frequency.value = freq;
      o.type = 'sine';
      
      // Control volume envelopes
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + start + 0.02);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.05);
    };
    
    // Play a friendly arpeggio (A5 -> C#6 -> A5 -> E6)
    beep(880, 0, 0.18);      // A5
    beep(1100, 0.22, 0.18);   // C#6
    beep(880, 0.44, 0.18);    // A5
    beep(1320, 0.66, 0.35);   // E6
  } catch (e) {
    console.warn("Failed to play timer audio alarm:", e);
  }
}
