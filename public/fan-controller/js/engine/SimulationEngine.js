import { TemperatureModel } from './TemperatureModel.js';
import { ModeController } from './ModeController.js';
import { CANBus } from './CANBus.js';

export class SimulationEngine {
  constructor(state) {
    this.state = state;
    this.tempModel = new TemperatureModel();
    this.modeCtrl = new ModeController();
    this.canBus = new CANBus();
    this.lastCANTime = 0;
    this.CAN_INTERVAL = 500;
    this.running = false;
    this._frameId = null;
  }

  get modeController() {
    return this.modeCtrl;
  }

  start() {
    this.running = true;
    this._lastTimestamp = performance.now();
    this._tick(this._lastTimestamp);
  }

  stop() {
    this.running = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
  }

  _tick(timestamp) {
    if (!this.running) return;

    this.state.set('engineTempC',
      this.tempModel.adcToEngineTemp(this.state.get('engineTempRaw')));
    this.state.set('ambientTempC',
      this.tempModel.adcToAmbientTemp(this.state.get('ambientTempRaw')));

    this.modeCtrl.evaluate(this.state);

    if (timestamp - this.lastCANTime >= this.CAN_INTERVAL) {
      const messages = this.canBus.generatePair(this.state, timestamp);
      const log = [...this.state.get('canMessages'), ...messages].slice(-100);
      this.state.set('canMessages', log);
      this.lastCANTime = timestamp;
    }

    this._frameId = requestAnimationFrame((ts) => this._tick(ts));
  }
}
