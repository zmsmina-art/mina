const state = {
  engineTempRaw: 0,
  ambientTempRaw: 0,
  engineTempC: 0,
  ambientTempC: -20,

  mode: 'AUTO',
  previousMode: 'AUTO',
  fanDutyPercent: 0,
  manualFanSetting: 0,

  safetyActive: false,

  scenarioRunning: false,
  scenarioName: null,

  canMessages: [],
};

const listeners = new Map();

export const SimulationState = {
  get(key) {
    return state[key];
  },

  set(key, value) {
    if (state[key] === value) return;
    state[key] = value;
    const fns = listeners.get(key);
    if (fns) {
      for (const fn of fns) {
        fn(value, key);
      }
    }
  },

  subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, []);
    }
    listeners.get(key).push(callback);
    callback(state[key], key);
  },

  snapshot() {
    return { ...state };
  },

  reset() {
    this.set('engineTempRaw', 0);
    this.set('ambientTempRaw', 0);
    this.set('mode', 'AUTO');
    this.set('previousMode', 'AUTO');
    this.set('fanDutyPercent', 0);
    this.set('manualFanSetting', 0);
    this.set('safetyActive', false);
    this.set('scenarioRunning', false);
    this.set('scenarioName', null);
    this.set('canMessages', []);
  }
};
