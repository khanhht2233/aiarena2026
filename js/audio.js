/**
 * VIỆT PHỤC REMIX - SYNTHETIC SOUND ENGINE (WEB AUDIO API)
 * Tạo âm thanh Đàn Tranh ngũ cung thanh tao và hiệu ứng click thời trang
 * 100% tự sinh bằng Oscillator, không cần tải bất kỳ file mp3 nào từ bên ngoài!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    // Ngũ cung truyền thống: Hò, Xự, Xang, Xê, Cống (C, D, F, G, A)
    this.pentatonicScales = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Tiếng gảy Đàn Tranh nhẹ nhàng khi chọn trang phục / đổi preset
  playPluck(noteIndex = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const idx = noteIndex !== null ? noteIndex % this.pentatonicScales.length : Math.floor(Math.random() * this.pentatonicScales.length);
      const freq = this.pentatonicScales[idx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Tạo chút họa âm gảy dây đàn
      osc.frequency.exponentialRampToValueAtTime(freq * 1.002, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.85);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Tiếng click nút bấm hiện đại
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Tiếng chuông khánh may mắn khi điểm văn hóa đạt tối đa
  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.2);
        } catch (e) {}
      }, idx * 120);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

if (typeof window !== "undefined") {
  window.soundEngine = new SoundEngine();
}
