import { el } from '../utils/DOMHelpers.js';

const SCENARIO_META = {
  coldStart: { label: 'Cold Start', desc: 'Engine warms from 20\u00B0C to 75\u00B0C' },
  highway: { label: 'Highway', desc: 'Stable cruising around 75\u00B0C' },
  overheat: { label: 'Overheat', desc: 'Temp climbs past 90\u00B0C, triggers SAFETY' },
  manualOverride: { label: 'Manual Override', desc: 'Switches to MANUAL and adjusts speeds' },
};

export class ScenarioPanel {
  constructor(state, scenarioRunner) {
    this.state = state;
    this.runner = scenarioRunner;
    this.buttons = {};
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'simulator__scenarios' });

    const label = el('span', { className: 'simulator__scenarios-label', textContent: 'Scenarios:' });
    wrapper.appendChild(label);

    for (const [key, meta] of Object.entries(SCENARIO_META)) {
      const btn = el('button', {
        className: 'btn',
        textContent: meta.label,
        'data-tooltip': meta.desc,
      });
      btn.addEventListener('click', () => this._toggle(key));
      this.buttons[key] = btn;
      wrapper.appendChild(btn);
    }

    this.stopBtn = el('button', {
      className: 'btn btn--danger',
      textContent: 'Stop',
    });
    this.stopBtn.style.display = 'none';
    this.stopBtn.addEventListener('click', () => this.runner.stop());
    wrapper.appendChild(this.stopBtn);

    return wrapper;
  }

  _toggle(name) {
    if (this.state.get('scenarioRunning') && this.state.get('scenarioName') === name) {
      this.runner.stop();
    } else {
      this.runner.run(name);
    }
  }

  _bind() {
    this.state.subscribe('scenarioRunning', () => this._updateUI());
    this.state.subscribe('scenarioName', () => this._updateUI());
  }

  _updateUI() {
    const running = this.state.get('scenarioRunning');
    const activeName = this.state.get('scenarioName');

    for (const [key, btn] of Object.entries(this.buttons)) {
      if (running && key === activeName) {
        btn.classList.add('btn--active');
      } else {
        btn.classList.remove('btn--active');
      }
      btn.disabled = running && key !== activeName;
    }

    this.stopBtn.style.display = running ? 'inline-block' : 'none';
  }
}
