import { TemperatureModel } from './TemperatureModel.js';

const tempModel = new TemperatureModel();

export class ModeController {
  evaluate(state) {
    const temp = state.get('engineTempC');
    const mode = state.get('mode');

    if (temp >= 90 && mode !== 'SAFETY') {
      state.set('previousMode', mode);
      state.set('mode', 'SAFETY');
      state.set('fanDutyPercent', 100);
      state.set('safetyActive', true);
      return;
    }

    if (mode === 'SAFETY' && temp < 85) {
      state.set('mode', state.get('previousMode'));
      state.set('safetyActive', false);
    }

    if (state.get('mode') === 'SAFETY') {
      state.set('fanDutyPercent', 100);
      return;
    }

    if (state.get('mode') === 'AUTO') {
      state.set('fanDutyPercent', tempModel.tempToDuty(temp));
    }

    if (state.get('mode') === 'MANUAL') {
      state.set('fanDutyPercent', state.get('manualFanSetting'));
    }
  }

  handleKeypress(key, state) {
    if (state.get('mode') === 'SAFETY') return false;

    switch (key) {
      case 'AUTO':
        state.set('mode', 'AUTO');
        return true;
      case 'MANUAL':
        state.set('mode', 'MANUAL');
        return true;
      case 'FAN_0':
        if (state.get('mode') === 'MANUAL') { state.set('manualFanSetting', 0); return true; }
        return false;
      case 'FAN_25':
        if (state.get('mode') === 'MANUAL') { state.set('manualFanSetting', 25); return true; }
        return false;
      case 'FAN_50':
        if (state.get('mode') === 'MANUAL') { state.set('manualFanSetting', 50); return true; }
        return false;
      case 'FAN_75':
        if (state.get('mode') === 'MANUAL') { state.set('manualFanSetting', 75); return true; }
        return false;
      case 'FAN_100':
        if (state.get('mode') === 'MANUAL') { state.set('manualFanSetting', 100); return true; }
        return false;
      case 'RESET':
        state.reset();
        return true;
      default:
        return false;
    }
  }
}
