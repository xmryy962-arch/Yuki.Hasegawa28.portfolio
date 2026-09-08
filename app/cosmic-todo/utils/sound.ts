// Web Audio API を活用した宇宙サウンドジェネレーター

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosmic_sound_muted');
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmic_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // タスク完了時：星が生まれる透明感あふれるコズミック・チャイム音
  public playTaskComplete() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 輝くようなアルペジオ（E5, G#5, B5, E6, G#6）
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // 周波数をわずかに上昇させて星屑が舞い上がる感覚を演出
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + idx * 0.08 + 0.35);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch {
      // Audio not supported or blocked
    }
  }

  // レベルアップ時：宇宙進化の壮大なコズミックファンファーレ
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 豊かな和音展開（宇宙の覚醒をイメージしたアンビエントコード）
      const chords = [
        { freqs: [440, 554.37, 659.25, 880], delay: 0.0, dur: 0.5 },
        { freqs: [493.88, 622.25, 739.99, 987.77], delay: 0.35, dur: 0.5 },
        { freqs: [523.25, 659.25, 783.99, 1046.5, 1318.51], delay: 0.7, dur: 1.6 }
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + chord.delay);

          gain.gain.setValueAtTime(0, now + chord.delay);
          gain.gain.linearRampToValueAtTime(0.08, now + chord.delay + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.delay + chord.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + chord.delay);
          osc.stop(now + chord.delay + chord.dur + 0.1);
        });
      });
    } catch {
      // Audio not supported
    }
  }

  // 星や惑星をクリックしたときの繊細なタッチ音
  public playStarClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.15); // A6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio not supported
    }
  }
}

export const soundManager = new SoundManager();
