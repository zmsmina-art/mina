import { el } from '../utils/DOMHelpers.js';

export class LCDDisplay {
  constructor(state) {
    this.state = state;
    this.lines = [[], []];
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    const title = el('div', { className: 'panel__title' }, ['LCD Display (16x2)']);
    wrapper.appendChild(title);

    const lcd = el('div', { className: 'lcd' });
    for (let row = 0; row < 2; row++) {
      const line = el('div', { className: 'lcd__line' });
      for (let col = 0; col < 16; col++) {
        const ch = el('span', { className: 'lcd__char', textContent: ' ' });
        line.appendChild(ch);
        this.lines[row].push(ch);
      }
      lcd.appendChild(line);
    }
    wrapper.appendChild(lcd);
    return wrapper;
  }

  _bind() {
    const update = () => this._update();
    this.state.subscribe('engineTempC', update);
    this.state.subscribe('ambientTempC', update);
    this.state.subscribe('fanDutyPercent', update);
    this.state.subscribe('mode', update);
  }

  _update() {
    const eng = String(Math.round(this.state.get('engineTempC'))).padStart(3, ' ');
    const amb = String(Math.round(this.state.get('ambientTempC'))).padStart(3, ' ');
    const fan = String(this.state.get('fanDutyPercent')).padStart(3, ' ');
    const modeMap = { AUTO: 'AUT', MANUAL: 'MAN', SAFETY: 'SAF' };
    const mode = modeMap[this.state.get('mode')] || '???';

    const line1 = `ENG:${eng} AMB:${amb}`.padEnd(16, ' ');
    const line2 = `FAN:${fan}% MODE:${mode}`.padEnd(16, ' ');

    for (let i = 0; i < 16; i++) {
      this.lines[0][i].textContent = line1[i];
      this.lines[1][i].textContent = line2[i];
    }
  }
}
