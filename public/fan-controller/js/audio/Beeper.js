export class Beeper {
  constructor() {
    this.ctx = null;
  }

  play() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.12;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.stop(this.ctx.currentTime + 0.1);
  }
}
