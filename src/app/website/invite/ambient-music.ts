import { signal } from '@angular/core';

/**
 * Original, copyright-free background music generated live with the Web Audio API:
 * a slow, warm chord pad with a soft bell melody and a gentle reverb.
 * Nothing is downloaded. Browsers only allow audio after a tap, so call
 * `start()` from a click (e.g. "Open invitation").
 */
export class AmbientMusic {
  readonly playing = signal(false);

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextBar = 0;
  private bar = 0;

  /** C major – A minor – F major – G major, voiced softly. */
  private readonly chords = [
    [261.63, 329.63, 392.0, 523.25],
    [220.0, 261.63, 329.63, 440.0],
    [174.61, 261.63, 349.23, 440.0],
    [196.0, 246.94, 392.0, 493.88],
  ];
  /** Bell melody (pentatonic) – one phrase per chord, 8 steps each, 0 = rest. */
  private readonly melody = [
    [784, 0, 659, 0, 587, 659, 0, 0],
    [659, 0, 523, 0, 587, 0, 523, 0],
    [698, 0, 659, 587, 0, 523, 0, 0],
    [587, 0, 659, 0, 784, 0, 0, 0],
  ];
  private readonly barSeconds = 6.4;

  start(): void {
    if (this.playing()) return;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 2.5);

    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this.impulse(this.ctx, 3.2);
    const wet = this.ctx.createGain();
    wet.gain.value = 0.55;
    this.reverb.connect(wet).connect(this.master);
    this.master.connect(this.ctx.destination);

    this.nextBar = this.ctx.currentTime + 0.1;
    this.bar = 0;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 400);
    this.playing.set(true);
  }

  stop(): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    setTimeout(() => void ctx.close(), 1000);
    this.ctx = null;
    this.master = null;
    this.playing.set(false);
  }

  toggle(): void {
    if (this.playing()) this.stop();
    else this.start();
  }

  /** Queue the bars that start within the next couple of seconds. */
  private schedule(): void {
    if (!this.ctx) return;
    while (this.nextBar < this.ctx.currentTime + 2) {
      const index = this.bar % this.chords.length;
      this.pad(this.chords[index], this.nextBar);
      this.bells(this.melody[index], this.nextBar);
      this.nextBar += this.barSeconds;
      this.bar++;
    }
  }

  private pad(freqs: number[], at: number): void {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.05, at + 2);
    gain.gain.linearRampToValueAtTime(0.04, at + this.barSeconds - 1);
    gain.gain.linearRampToValueAtTime(0, at + this.barSeconds + 1.5);
    filter.connect(gain);
    gain.connect(this.master!);
    gain.connect(this.reverb!);
    for (const f of freqs) {
      for (const detune of [-6, 6]) {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f / 2;
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(at);
        osc.stop(at + this.barSeconds + 1.6);
      }
    }
  }

  private bells(notes: number[], at: number): void {
    const ctx = this.ctx!;
    const step = this.barSeconds / notes.length;
    notes.forEach((freq, i) => {
      if (!freq) return;
      const t = at + i * step;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      gain.connect(this.master!);
      gain.connect(this.reverb!);
      // A sine plus a quiet octave partial gives a soft "music box" bell.
      for (const [mult, level] of [[1, 1], [2, 0.25]] as const) {
        const osc = ctx.createOscillator();
        const partial = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq * mult;
        partial.gain.value = level;
        osc.connect(partial).connect(gain);
        osc.start(t);
        osc.stop(t + 2.3);
      }
    });
  }

  /** Synthetic hall reverb: decaying stereo noise. */
  private impulse(ctx: AudioContext, seconds: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    }
    return buffer;
  }
}
