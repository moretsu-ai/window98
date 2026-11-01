// Authentic Web Audio synthesizer for Windows 98 system sounds and Easter eggs

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Windows 98 Startup Chord
  public playStartup() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // F# major chord with ambient shimmer
      const freqs = [185.0, 277.18, 369.99, 466.16, 554.37, 739.99, 1108.73];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i < 2 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.3 + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + 3.6);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Windows 98 Click Sound
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Windows 98 Error Ding / Chord
  public playError() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  // Easter Egg 01: Peep-peep baby chick chirping song
  public playChickSong(): () => void {
    if (this.isMuted) return () => {};
    let isStopped = false;
    let timerId: any = null;

    try {
      // Try playing audio file if available
      const audio = new Audio('/audio/chick-song.wav');
      audio.volume = 0.5;
      audio.play().catch(() => {});

      // Also synthesize authentic chirps
      const ctx = this.getContext();
      let step = 0;
      const chirpNotes = [880, 1100, 1320, 1100, 1760];

      const chirp = () => {
        if (isStopped) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = chirpNotes[step % chirpNotes.length];
        step++;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);

        if (!isStopped) {
          timerId = setTimeout(chirp, 200 + Math.random() * 150);
        }
      };

      chirp();

      return () => {
        isStopped = true;
        if (timerId) clearTimeout(timerId);
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {}
      };
    } catch (e) {
      return () => {};
    }
  }

  // Easter Egg 02: Dissonant Cyber Virus Alarm / Screaming glitch
  public playVirusAlarm(): () => void {
    if (this.isMuted) return () => {};
    let isStopped = false;
    let osc1: OscillatorNode | null = null;
    let osc2: OscillatorNode | null = null;

    try {
      const audio = new Audio('/audio/fake-virus.wav');
      audio.volume = 0.6;
      audio.play().catch(() => {});

      const ctx = this.getContext();
      const now = ctx.currentTime;

      osc1 = ctx.createOscillator();
      osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(320, now);
      osc2.frequency.setValueAtTime(330, now); // beating dissonance

      // Pitch sweep up and down
      osc1.frequency.linearRampToValueAtTime(700, now + 1.5);
      osc2.frequency.linearRampToValueAtTime(710, now + 1.5);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 4.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      return () => {
        isStopped = true;
        try {
          audio.pause();
          audio.currentTime = 0;
          if (osc1) osc1.stop();
          if (osc2) osc2.stop();
        } catch (e) {}
      };
    } catch (e) {
      return () => {};
    }
  }

  // Minesweeper Explosion
  public playExplosion() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // White noise explosion
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
