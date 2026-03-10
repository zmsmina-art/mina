import { TemperatureModel } from './TemperatureModel.js';
import { EventBus } from '../utils/EventBus.js';
import { easeInOut } from '../utils/MathUtils.js';

const tm = new TemperatureModel();

const SCENARIOS = {
  coldStart() {
    return [
      { startTime: 0, duration: 300, property: 'ambientTempRaw', from: tm.ambientTempToADC(25), to: tm.ambientTempToADC(25) },
      { startTime: 0, duration: 300, property: 'engineTempRaw', from: tm.engineTempToADC(20), to: tm.engineTempToADC(20) },
      { startTime: 300, duration: 10000, property: 'engineTempRaw', from: tm.engineTempToADC(20), to: tm.engineTempToADC(75) },
    ];
  },

  highway() {
    return [
      { startTime: 0, duration: 300, property: 'ambientTempRaw', from: tm.ambientTempToADC(30), to: tm.ambientTempToADC(30) },
      { startTime: 0, duration: 3000, property: 'engineTempRaw', from: tm.engineTempToADC(60), to: tm.engineTempToADC(75) },
      { startTime: 3000, duration: 2000, property: 'engineTempRaw', from: tm.engineTempToADC(75), to: tm.engineTempToADC(78) },
      { startTime: 5000, duration: 2000, property: 'engineTempRaw', from: tm.engineTempToADC(78), to: tm.engineTempToADC(73) },
      { startTime: 7000, duration: 2000, property: 'engineTempRaw', from: tm.engineTempToADC(73), to: tm.engineTempToADC(76) },
    ];
  },

  overheat() {
    return [
      { startTime: 0, duration: 300, property: 'ambientTempRaw', from: tm.ambientTempToADC(35), to: tm.ambientTempToADC(35) },
      { startTime: 0, duration: 300, property: 'engineTempRaw', from: tm.engineTempToADC(70), to: tm.engineTempToADC(70) },
      { startTime: 300, duration: 4000, property: 'engineTempRaw', from: tm.engineTempToADC(70), to: tm.engineTempToADC(95) },
      { startTime: 4300, duration: 3000, property: 'engineTempRaw', from: tm.engineTempToADC(95), to: tm.engineTempToADC(95) },
      { startTime: 7300, duration: 5000, property: 'engineTempRaw', from: tm.engineTempToADC(95), to: tm.engineTempToADC(80) },
    ];
  },

  manualOverride() {
    return [
      { startTime: 0, duration: 300, property: 'ambientTempRaw', from: tm.ambientTempToADC(25), to: tm.ambientTempToADC(25) },
      { startTime: 0, duration: 500, property: 'engineTempRaw', from: tm.engineTempToADC(65), to: tm.engineTempToADC(65) },
      { startTime: 1500, duration: 0, property: '_keypress', value: 'MANUAL' },
      { startTime: 2500, duration: 0, property: '_keypress', value: 'FAN_75' },
      { startTime: 5000, duration: 0, property: '_keypress', value: 'FAN_25' },
      { startTime: 7000, duration: 0, property: '_keypress', value: 'AUTO' },
    ];
  },
};

export class ScenarioRunner {
  constructor(state) {
    this.state = state;
    this.timeline = [];
    this.running = false;
    this.startTime = 0;
    this._frameId = null;
    this._firedKeys = new Set();
  }

  getScenarioNames() {
    return Object.keys(SCENARIOS);
  }

  run(name) {
    this.stop();
    const builder = SCENARIOS[name];
    if (!builder) return;
    this.timeline = builder();
    this.running = true;
    this.startTime = performance.now();
    this._firedKeys = new Set();
    this.state.set('scenarioRunning', true);
    this.state.set('scenarioName', name);
    this._tick();
  }

  stop() {
    this.running = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
    this.state.set('scenarioRunning', false);
    this.state.set('scenarioName', null);
  }

  _tick() {
    if (!this.running) return;
    const elapsed = performance.now() - this.startTime;
    let allComplete = true;

    for (let i = 0; i < this.timeline.length; i++) {
      const step = this.timeline[i];

      if (step.property === '_keypress') {
        if (elapsed >= step.startTime && !this._firedKeys.has(i)) {
          this._firedKeys.add(i);
          EventBus.emit('keypress', { key: step.value });
        }
        if (!this._firedKeys.has(i)) allComplete = false;
        continue;
      }

      if (elapsed < step.startTime) {
        allComplete = false;
        continue;
      }

      const stepElapsed = elapsed - step.startTime;
      if (stepElapsed >= step.duration) {
        this.state.set(step.property, step.to);
      } else {
        allComplete = false;
        const t = stepElapsed / step.duration;
        const eased = easeInOut(t);
        const value = step.from + (step.to - step.from) * eased;
        this.state.set(step.property, Math.round(value));
      }
    }

    if (allComplete) {
      this.stop();
    } else {
      this._frameId = requestAnimationFrame(() => this._tick());
    }
  }
}
