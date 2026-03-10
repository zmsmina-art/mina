import { el } from '../utils/DOMHelpers.js';
import { LCDDisplay } from './LCDDisplay.js';
import { FanAnimation } from './FanAnimation.js';
import { Keypad } from './Keypad.js';
import { TemperatureSliders } from './TemperatureSliders.js';
import { PWMWaveform } from './PWMWaveform.js';
import { CANLog } from './CANLog.js';
import { ModeIndicator } from './ModeIndicator.js';
import { ScenarioPanel } from './ScenarioPanel.js';

export class SimulatorTab {
  constructor(state, engine, scenarioRunner) {
    this.state = state;
    this.lcd = new LCDDisplay(state);
    this.fan = new FanAnimation(state);
    this.keypad = new Keypad(state, engine.modeController);
    this.sliders = new TemperatureSliders(state);
    this.pwm = new PWMWaveform(state);
    this.canLog = new CANLog(state);
    this.modeIndicator = new ModeIndicator(state);
    this.scenarioPanel = new ScenarioPanel(state, scenarioRunner);

    this.el = this._create();
  }

  _create() {
    const wrapper = el('div', { className: 'simulator' });

    wrapper.appendChild(this.scenarioPanel.el);

    const grid = el('div', { className: 'simulator__grid' });

    const left = el('div', { className: 'simulator__left' });
    left.appendChild(this.lcd.el);
    left.appendChild(this.modeIndicator.el);
    left.appendChild(this.sliders.el);
    left.appendChild(this.keypad.el);

    const right = el('div', { className: 'simulator__right' });
    right.appendChild(this.fan.el);
    right.appendChild(this.pwm.el);
    right.appendChild(this.canLog.el);

    grid.appendChild(left);
    grid.appendChild(right);
    wrapper.appendChild(grid);

    return wrapper;
  }
}
