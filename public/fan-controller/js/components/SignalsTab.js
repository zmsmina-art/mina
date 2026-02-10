import { el } from '../utils/DOMHelpers.js';
import { TemperatureModel } from '../engine/TemperatureModel.js';

const tm = new TemperatureModel();

const PWM_LEVELS = [
  { duty: 0,   label: '0%',   temp: 'Below 60\u00B0C' },
  { duty: 25,  label: '25%',  temp: '60-69\u00B0C' },
  { duty: 50,  label: '50%',  temp: '70-79\u00B0C' },
  { duty: 75,  label: '75%',  temp: '80-89\u00B0C' },
  { duty: 100, label: '100%', temp: '\u226590\u00B0C' },
];

export class SignalsTab {
  constructor(state) {
    this.state = state;
    this.adcCanvas = null;
    this.adcCtx = null;
    this.pwmCanvases = [];
    this.localADC = 512;
    this.el = this._create();
    this._drawADC(this.localADC);
    this._drawAllPWM();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'signals' });

    // ADC Section
    const adcSection = el('div', { className: 'signals__section' });
    const adcTitle = el('div', { className: 'signals__section-title', textContent: 'Analog-to-Digital Conversion (ADC)' });
    adcSection.appendChild(adcTitle);

    const adcAnnotation = el('div', { className: 'signals__annotation' });
    adcAnnotation.innerHTML = `
      The HCS12 ATD module converts analog voltage from the temperature sensor potentiometer to a 10-bit digital value.<br><br>
      <span class="signals__formula">Resolution: 10-bit \u2192 2\u00B9\u2070 = 1024 levels</span><br>
      <span class="signals__formula">Step Size: 5.0V / 1024 = 4.88mV per step</span><br><br>
      <span class="signals__formula">V_in = (ADC_raw / 1023) \u00D7 5.0V</span><br>
      <span class="signals__formula">T_engine = (ADC_raw / 1023) \u00D7 120\u00B0C</span><br>
      <span class="signals__formula">T_ambient = (ADC_raw / 1023) \u00D7 70 - 20\u00B0C</span>
    `;
    adcSection.appendChild(adcAnnotation);

    // ADC slider
    const sliderRow = el('div', { className: 'signals__slider-row' });
    const sliderLabel = el('span', { textContent: 'ADC Input:', className: 'slider-group__label' });
    sliderLabel.style.minWidth = '80px';
    sliderRow.appendChild(sliderLabel);

    this.adcSlider = el('input', { type: 'range', min: '0', max: '1023', value: '512', step: '1' });
    this.adcSlider.addEventListener('input', () => {
      this.localADC = parseInt(this.adcSlider.value, 10);
      this._drawADC(this.localADC);
    });
    sliderRow.appendChild(this.adcSlider);

    this.adcValueLabel = el('span', { className: 'signals__slider-value' });
    sliderRow.appendChild(this.adcValueLabel);
    adcSection.appendChild(sliderRow);

    // ADC Canvas
    const adcWrap = el('div', { className: 'signals__canvas-wrap' });
    this.adcCanvas = el('canvas', { width: '750', height: '200' });
    this.adcCanvas.style.width = '100%';
    this.adcCanvas.style.maxWidth = '750px';
    this.adcCanvas.style.height = 'auto';
    this.adcCtx = this.adcCanvas.getContext('2d');
    adcWrap.appendChild(this.adcCanvas);
    adcSection.appendChild(adcWrap);

    wrapper.appendChild(adcSection);

    // PWM Section
    const pwmSection = el('div', { className: 'signals__section' });
    const pwmTitle = el('div', { className: 'signals__section-title', textContent: 'PWM Duty Cycle Comparison' });
    pwmSection.appendChild(pwmTitle);

    const pwmAnnotation = el('div', { className: 'signals__annotation' });
    pwmAnnotation.innerHTML = `
      Pulse Width Modulation controls the DC motor speed by varying the average voltage.<br><br>
      <span class="signals__formula">Average Voltage = Duty% \u00D7 V_supply</span><br>
      <span class="signals__formula">Motor Speed \u221D Average Voltage</span><br><br>
      The fan controller uses 5 discrete PWM levels mapped to engine temperature thresholds.
      The currently active level is highlighted.
    `;
    pwmSection.appendChild(pwmAnnotation);

    const row = el('div', { className: 'signals__pwm-row' });
    for (const level of PWM_LEVELS) {
      const cell = el('div', { className: 'signals__pwm-cell', 'data-duty': String(level.duty) });
      const canvas = el('canvas', { width: '140', height: '80' });
      canvas.style.width = '100%';
      canvas.style.height = '80px';
      cell.appendChild(canvas);

      const lbl = el('div', { className: 'signals__pwm-label' });
      lbl.innerHTML = `<strong>${level.label}</strong>`;
      cell.appendChild(lbl);

      const tempLbl = el('div', { className: 'signals__pwm-temp', textContent: level.temp });
      cell.appendChild(tempLbl);

      const avgLbl = el('div', { className: 'signals__pwm-temp' });
      avgLbl.textContent = `V_avg = ${(level.duty / 100 * 5).toFixed(1)}V`;
      cell.appendChild(avgLbl);

      row.appendChild(cell);
      this.pwmCanvases.push({ canvas, ctx: canvas.getContext('2d'), duty: level.duty, cell });
    }
    pwmSection.appendChild(row);
    wrapper.appendChild(pwmSection);

    return wrapper;
  }

  _bind() {
    this.state.subscribe('fanDutyPercent', (duty) => {
      for (const item of this.pwmCanvases) {
        item.cell.classList.toggle('signals__pwm-cell--active', item.duty === duty);
      }
    });
  }

  _drawADC(adcValue) {
    const ctx = this.adcCtx;
    const W = 750, H = 200;
    ctx.clearRect(0, 0, W, H);

    const voltage = tm.adcToVoltage(adcValue);
    const tempC = tm.adcToEngineTemp(adcValue);

    this.adcValueLabel.textContent = `${adcValue}`;

    // Section widths
    const s1 = 250;  // Analog
    const s2 = 250;  // Sampling
    const s3 = 250;  // Digital output

    const margin = 20;
    const graphTop = 30;
    const graphBot = H - 30;
    const graphH = graphBot - graphTop;

    // Section labels
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillStyle = '#a78bfa';
    ctx.textAlign = 'center';
    ctx.fillText('Analog Input', s1 / 2, 16);
    ctx.fillText('ADC Sampling', s1 + s2 / 2, 16);
    ctx.fillText('Digital Output', s1 + s2 + s3 / 2, 16);

    // Section dividers
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(s1, graphTop); ctx.lineTo(s1, graphBot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s1 + s2, graphTop); ctx.lineTo(s1 + s2, graphBot); ctx.stroke();
    ctx.setLineDash([]);

    // --- Section 1: Analog waveform ---
    const normV = voltage / 5.0;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = margin; x < s1 - margin; x++) {
      const t = (x - margin) / (s1 - 2 * margin);
      const v = 0.5 + 0.45 * Math.sin(t * Math.PI * 3);
      const y = graphBot - v * graphH;
      if (x === margin) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current value marker
    const markerX = margin + normV * (s1 - 2 * margin);
    const markerY = graphBot - normV * graphH;
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(markerX, graphTop); ctx.lineTo(markerX, graphBot); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#a78bfa';
    ctx.beginPath(); ctx.arc(markerX, markerY, 5, 0, Math.PI * 2); ctx.fill();

    ctx.font = '10px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage.toFixed(2)}V`, markerX, graphBot + 16);

    // Y-axis labels
    ctx.fillStyle = 'rgba(240, 240, 245, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('5.0V', margin - 4, graphTop + 4);
    ctx.fillText('0.0V', margin - 4, graphBot + 4);

    // --- Section 2: Staircase (quantized) ---
    const steps = 16;
    const stepW = (s2 - 2 * margin) / steps;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < steps; i++) {
      const sx = s1 + margin + i * stepW;
      const t = i / steps;
      const v = 0.5 + 0.45 * Math.sin(t * Math.PI * 3);
      const quantized = Math.round(v * 16) / 16;
      const y = graphBot - quantized * graphH;
      if (i === 0) ctx.moveTo(sx, y);
      else ctx.lineTo(sx, y);
      ctx.lineTo(sx + stepW, y);
    }
    ctx.stroke();

    // Highlight current quantization level
    const currentLevel = Math.round(normV * 1023);
    const quantY = graphBot - normV * graphH;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(s1 + s2 / 2, quantY, 4, 0, Math.PI * 2);
    ctx.fill();

    // --- Section 3: Digital output ---
    const cx3 = s1 + s2 + s3 / 2;
    ctx.textAlign = 'center';

    // Binary
    ctx.fillStyle = '#a78bfa';
    ctx.font = '12px "Fira Code", monospace';
    const binary = adcValue.toString(2).padStart(10, '0');
    ctx.fillText(`0b${binary}`, cx3, graphTop + 30);

    // Decimal
    ctx.fillStyle = '#f0f0f5';
    ctx.font = '20px "Fira Code", monospace';
    ctx.fillText(`${adcValue}`, cx3, graphTop + 65);
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillStyle = 'rgba(240, 240, 245, 0.5)';
    ctx.fillText('(decimal)', cx3, graphTop + 80);

    // Voltage
    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px "Fira Code", monospace';
    ctx.fillText(`${voltage.toFixed(3)}V`, cx3, graphTop + 110);

    // Temperature
    ctx.fillStyle = '#f87171';
    ctx.font = '16px "Fira Code", monospace';
    ctx.fillText(`${tempC.toFixed(1)}\u00B0C`, cx3, graphTop + 140);
    ctx.font = '9px "Fira Code", monospace';
    ctx.fillStyle = 'rgba(240, 240, 245, 0.4)';
    ctx.fillText('(engine temp)', cx3, graphTop + 154);
  }

  _drawAllPWM() {
    for (const item of this.pwmCanvases) {
      this._drawPWM(item.ctx, item.canvas.width, item.canvas.height, item.duty);
    }
  }

  _drawPWM(ctx, W, H, dutyPercent) {
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y <= H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const yHigh = 12;
    const yLow = H - 12;
    const periods = 3;
    const periodW = W / periods;
    const highW = (dutyPercent / 100) * periodW;

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
  }
}
