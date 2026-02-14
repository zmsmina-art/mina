import { el } from '../utils/DOMHelpers.js';

export class PWMWaveform {
  constructor(state) {
    this.state = state;
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    const title = el('div', { className: 'panel__title' }, ['PWM Output Waveform']);
    const info = el('span', {
      className: 'info-icon',
      textContent: 'i',
      'data-tooltip': 'Pulse Width Modulation controls motor speed by rapidly switching power on/off.\nThe duty cycle (% of time HIGH) determines the average voltage delivered to the motor.\nHigher duty cycle = faster fan speed.',
      tabindex: '0',
      role: 'button',
      'aria-label': 'PWM info'
    });
    title.appendChild(info);
    wrapper.appendChild(title);

    this.canvas = el('canvas', { width: '400', height: '120' });
    this.canvas.className = 'pwm-canvas';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '120px';
    wrapper.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    return wrapper;
  }

  _bind() {
    this.state.subscribe('fanDutyPercent', (duty) => this._draw(duty));
  }

  _draw(dutyPercent) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y <= H; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let x = 0; x <= W; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    const yHigh = 20;
    const yLow = H - 30;
    const periods = 4;
    const periodW = W / periods;
    const highW = (dutyPercent / 100) * periodW;

    // V_avg dashed line
    const vAvgY = yLow - (dutyPercent / 100) * (yLow - yHigh);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, vAvgY);
    ctx.lineTo(W, vAvgY);
    ctx.stroke();
    ctx.setLineDash([]);

    // V_avg label
    ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillText(`V_avg = ${(dutyPercent / 100 * 5).toFixed(1)}V`, W - 95, vAvgY - 4);

    // Waveform
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, yLow);

    for (let i = 0; i < periods; i++) {
      const xStart = i * periodW;
      if (dutyPercent === 0) {
        ctx.lineTo(xStart + periodW, yLow);
      } else if (dutyPercent === 100) {
        if (i === 0) ctx.lineTo(xStart, yHigh);
        ctx.lineTo(xStart + periodW, yHigh);
      } else {
        ctx.lineTo(xStart, yHigh);
        ctx.lineTo(xStart + highW, yHigh);
        ctx.lineTo(xStart + highW, yLow);
        ctx.lineTo(xStart + periodW, yLow);
      }
    }
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(240, 240, 245, 0.5)';
    ctx.font = '9px "Fira Code", monospace';
    ctx.fillText('HIGH (5V)', 4, yHigh - 4);
    ctx.fillText('LOW  (0V)', 4, yLow + 12);

    // Duty label
    ctx.fillStyle = '#a78bfa';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText(`Duty Cycle: ${dutyPercent}%`, W / 2 - 60, H - 4);
  }
}
