import { el } from '../utils/DOMHelpers.js';
import { EventBus } from '../utils/EventBus.js';

const KEY_LAYOUT = [
  { label: '1', fn: 'AUTO',    desc: 'AUTO mode' },
  { label: '2', fn: 'MANUAL',  desc: 'MANUAL mode' },
  { label: '3', fn: null,      desc: '' },
  { label: 'A', fn: null,      desc: '' },
  { label: '4', fn: 'FAN_0',   desc: 'Fan OFF' },
  { label: '5', fn: 'FAN_25',  desc: 'Fan 25%' },
  { label: '6', fn: 'FAN_50',  desc: 'Fan 50%' },
  { label: 'B', fn: null,      desc: '' },
  { label: '7', fn: 'FAN_75',  desc: 'Fan 75%' },
  { label: '8', fn: 'FAN_100', desc: 'Fan 100%' },
  { label: '9', fn: null,      desc: '' },
  { label: 'C', fn: null,      desc: '' },
  { label: '*', fn: null,      desc: '' },
  { label: '0', fn: null,      desc: '' },
  { label: '#', fn: 'RESET',   desc: 'Reset' },
  { label: 'D', fn: null,      desc: '' },
];

const TOOLTIPS = {
  'AUTO': 'Key 1: Switch to AUTO mode.\nFan speed is calculated automatically from engine temperature using preset thresholds.',
  'MANUAL': 'Key 2: Switch to MANUAL mode.\nUse keys 4-8 to set fan speed directly.',
  'FAN_0':   'Key 4: Fan OFF (0% duty cycle).\nOnly works in MANUAL mode.',
  'FAN_25':  'Key 5: Fan 25% speed.\nEquivalent to engine temp 60-69\u00B0C in AUTO mode.',
  'FAN_50':  'Key 6: Fan 50% speed.\nEquivalent to engine temp 70-79\u00B0C in AUTO mode.',
  'FAN_75':  'Key 7: Fan 75% speed.\nEquivalent to engine temp 80-89\u00B0C in AUTO mode.',
  'FAN_100': 'Key 8: Fan 100% speed.\nEquivalent to engine temp \u226590\u00B0C in AUTO mode.',
  'RESET':   'Key #: Reset system to defaults.\nSets AUTO mode, fan off, temperatures to 0.',
};

export class Keypad {
  constructor(state, modeController) {
    this.state = state;
    this.modeCtrl = modeController;
    this.buttons = [];
    this.el = this._create();
    this._bind();

    EventBus.on('keypress', (data) => this._handleKeyEvent(data.key));
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    const title = el('div', { className: 'panel__title' }, ['4x4 Keypad']);
    wrapper.appendChild(title);

    const grid = el('div', { className: 'keypad' });

    for (const key of KEY_LAYOUT) {
      const btn = el('button', {
        className: `keypad__key ${key.fn ? '' : 'keypad__key--inactive'}`,
      });

      if (key.fn && TOOLTIPS[key.fn]) {
        btn.setAttribute('data-tooltip', TOOLTIPS[key.fn]);
      }

      const num = el('span', { className: 'keypad__key-num', textContent: key.label });
      btn.appendChild(num);

      if (key.desc) {
        const lbl = el('span', { className: 'keypad__key-label', textContent: key.desc });
        btn.appendChild(lbl);
      }

      if (key.fn) {
        btn.addEventListener('click', () => {
          EventBus.emit('keypress', { key: key.fn });
        });
      }

      this.buttons.push({ el: btn, fn: key.fn });
      grid.appendChild(btn);
    }

    wrapper.appendChild(grid);
    return wrapper;
  }

  _handleKeyEvent(keyFn) {
    this.modeCtrl.handleKeypress(keyFn, this.state);

    for (const btn of this.buttons) {
      if (btn.fn === keyFn) {
        btn.el.classList.add('keypad__key--flash');
        setTimeout(() => btn.el.classList.remove('keypad__key--flash'), 150);
        break;
      }
    }
  }

  _bind() {
    this.state.subscribe('mode', () => this._updateDisabledState());
    this.state.subscribe('safetyActive', () => this._updateDisabledState());
  }

  _updateDisabledState() {
    const isSafety = this.state.get('mode') === 'SAFETY';
    for (const btn of this.buttons) {
      if (!btn.fn) continue;
      const isSpeedKey = btn.fn.startsWith('FAN_');
      const isModeKey = btn.fn === 'MANUAL';
      if (isSafety && (isSpeedKey || isModeKey)) {
        btn.el.classList.add('keypad__key--disabled');
      } else {
        btn.el.classList.remove('keypad__key--disabled');
      }
    }
  }
}
