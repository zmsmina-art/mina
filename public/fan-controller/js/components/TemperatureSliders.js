import { el } from '../utils/DOMHelpers.js';
import { TemperatureModel } from '../engine/TemperatureModel.js';

const tm = new TemperatureModel();

export class TemperatureSliders {
  constructor(state) {
    this.state = state;
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    const title = el('div', { className: 'panel__title' }, ['Temperature Sensors (ADC)']);
    wrapper.appendChild(title);

    const info = el('span', {
      className: 'info-icon',
      textContent: 'i',
      'data-tooltip': 'ADC: 10-bit resolution (0-1023). Voltage range: 0-5V.\nPotentiometers simulate temperature sensors connected to ATD Channels 0 and 1 on the HCS12 microcontroller.',
      tabindex: '0',
      role: 'button',
      'aria-label': 'ADC sensor info'
    });
    wrapper.querySelector('.panel__title').appendChild(info);

    this.engineSlider = this._createSlider(wrapper, 'Engine Temperature', 'engineTempRaw', (raw) => {
      const v = tm.adcToVoltage(raw).toFixed(2);
      const t = tm.adcToEngineTemp(raw).toFixed(1);
      return { adc: raw, voltage: `${v}V`, temp: `${t}\u00B0C` };
    });

    this.ambientSlider = this._createSlider(wrapper, 'Ambient Temperature', 'ambientTempRaw', (raw) => {
      const v = tm.adcToVoltage(raw).toFixed(2);
      const t = tm.adcToAmbientTemp(raw).toFixed(1);
      return { adc: raw, voltage: `${v}V`, temp: `${t}\u00B0C` };
    });

    return wrapper;
  }

  _createSlider(parent, label, stateKey, formatFn) {
    const group = el('div', { className: 'slider-group' });
    group.style.marginTop = '12px';

    const lbl = el('div', { className: 'slider-group__label', textContent: label });
    group.appendChild(lbl);

    const input = el('input', { type: 'range', min: '0', max: '1023', value: '0', step: '1', 'aria-label': label });
    input.addEventListener('input', () => {
      this.state.set(stateKey, parseInt(input.value, 10));
    });
    group.appendChild(input);

    const readouts = el('div', { className: 'slider-group__readouts' });
    const adcSpan = el('span', { className: 'slider-group__readout' });
    const voltSpan = el('span', { className: 'slider-group__readout' });
    const tempSpan = el('span', { className: 'slider-group__readout' });
    readouts.appendChild(adcSpan);
    readouts.appendChild(voltSpan);
    readouts.appendChild(tempSpan);
    group.appendChild(readouts);

    parent.appendChild(group);

    return { input, adcSpan, voltSpan, tempSpan, formatFn, stateKey };
  }

  _bind() {
    this.state.subscribe('engineTempRaw', (val) => this._updateSlider(this.engineSlider, val));
    this.state.subscribe('ambientTempRaw', (val) => this._updateSlider(this.ambientSlider, val));
  }

  _updateSlider(slider, value) {
    slider.input.value = value;
    const fmt = slider.formatFn(value);
    slider.adcSpan.innerHTML = `ADC: <span>${fmt.adc}</span>`;
    slider.voltSpan.innerHTML = `Voltage: <span>${fmt.voltage}</span>`;
    slider.tempSpan.innerHTML = `Temp: <span>${fmt.temp}</span>`;
  }
}
