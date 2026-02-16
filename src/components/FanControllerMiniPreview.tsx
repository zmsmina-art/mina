'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TouchEvent } from 'react';

const ENGINE_ADC_MAX = 1023;
const SAFETY_TRIGGER_C = 90;
const SAFETY_RELEASE_C = 85;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function tempToDuty(tempC: number) {
  if (tempC < 60) return 0;
  if (tempC < 70) return 25;
  if (tempC < 80) return 50;
  if (tempC < 90) return 75;
  return 100;
}

function adcToEngineTemp(rawADC: number) {
  return (rawADC / 1023) * 120;
}

function adcToVoltage(rawADC: number) {
  return (rawADC / 1023) * 5;
}

function dutyToRpm(duty: number) {
  if (duty <= 0) return 0;
  return Math.round(900 + duty * 39);
}

function getFanMode(duty: number) {
  if (duty === 0) return 'AUTO / OFF';
  return `AUTO / ${duty}%`;
}

export default function FanControllerMiniPreview() {
  const [engineTempRaw, setEngineTempRaw] = useState(614);
  const [safetyActive, setSafetyActive] = useState(false);
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const temperature = adcToEngineTemp(engineTempRaw);
  const voltage = adcToVoltage(engineTempRaw);

  useEffect(() => {
    setSafetyActive((isSafetyActive) => {
      if (temperature >= SAFETY_TRIGGER_C) return true;
      if (isSafetyActive && temperature >= SAFETY_RELEASE_C) return true;
      return false;
    });
  }, [temperature]);

  const onEngineTempRawChange = (rawValue: string) => {
    const nextRaw = Number(rawValue);
    if (Number.isNaN(nextRaw)) return;
    setEngineTempRaw(nextRaw);
  };

  const updateEngineTempFromTouch = (event: TouchEvent<HTMLInputElement>) => {
    const slider = sliderRef.current;
    const touch = event.touches[0];
    if (!slider || !touch) return;

    const bounds = slider.getBoundingClientRect();
    if (bounds.width <= 0) return;

    const ratio = clamp((touch.clientX - bounds.left) / bounds.width, 0, 1);
    setEngineTempRaw(Math.round(ratio * ENGINE_ADC_MAX));
    event.preventDefault();
  };

  const { duty, mode, rpm, speedState, sliderBackground } = useMemo(() => {
    const duty = safetyActive ? 100 : tempToDuty(temperature);
    const mode = safetyActive ? 'SAFETY' : getFanMode(duty);
    const rpm = dutyToRpm(duty);
    const speedState = safetyActive ? 'Safety Override Active' : duty === 0 ? 'Fan Standby' : 'Cooling Active';
    const adcFill = Number(((engineTempRaw / ENGINE_ADC_MAX) * 100).toFixed(2));
    const sliderBackground = `
      linear-gradient(
        90deg,
        rgba(134, 108, 191, 0.26) 0%,
        rgba(134, 108, 191, 0.26) 49.9%,
        rgba(28, 28, 28, 0.3) 50%,
        rgba(28, 28, 28, 0.3) 66.6%,
        rgba(255, 255, 255, 0.28) 66.7%,
        rgba(255, 255, 255, 0.28) 74.9%,
        rgba(183, 148, 255, 0.32) 75%,
        rgba(183, 148, 255, 0.32) 100%
      ),
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.88) 0%,
        rgba(255, 255, 255, 0.88) ${adcFill}%,
        rgba(255, 255, 255, 0.16) ${adcFill}%,
        rgba(255, 255, 255, 0.16) 100%
      )
    `;

    return { duty, mode, rpm, speedState, sliderBackground };
  }, [engineTempRaw, safetyActive, temperature]);

  return (
    <div className="mini-fan-sim mt-4">
      <div className="mini-fan-top">
        <label htmlFor="mini-engine-temp">Engine Temperature</label>
        <span>{temperature.toFixed(1)}C</span>
      </div>

      <input
        ref={sliderRef}
        id="mini-engine-temp"
        type="range"
        min={0}
        max={ENGINE_ADC_MAX}
        step={1}
        value={engineTempRaw}
        onInput={(event) => onEngineTempRawChange((event.target as HTMLInputElement).value)}
        onChange={(event) => onEngineTempRawChange((event.target as HTMLInputElement).value)}
        onTouchStart={updateEngineTempFromTouch}
        onTouchMove={updateEngineTempFromTouch}
        className="mini-fan-slider"
        style={{ background: sliderBackground }}
        aria-label="Engine temperature slider"
      />

      <div className="mini-fan-stats">
        <span>Mode: {mode}</span>
        <span>{duty}% PWM</span>
        <span>ADC: {engineTempRaw}</span>
        <span>{voltage.toFixed(2)}V</span>
      </div>

      <div className="mini-fan-stage">
        <div className="mini-fan-disc-wrap">
          <div
            className={`mini-fan-disc mini-fan-speed-disc ${duty === 0 ? 'mini-fan-disc--stopped' : ''} ${safetyActive ? 'mini-fan-disc--safety' : ''}`}
            aria-live="polite"
          >
            <p className="mini-fan-speed-kicker">Fan Speed</p>
            <p className="mini-fan-speed-value">
              {rpm.toLocaleString()}
              <span>RPM</span>
            </p>
            <div className="mini-fan-speed-track" aria-hidden="true">
              <span className="mini-fan-speed-fill" style={{ width: `${duty}%` }} />
            </div>
            <p className="mini-fan-speed-state">{speedState}</p>
          </div>
        </div>

        <a href="/fan-controller/index.html" className="mini-fan-open">
          Open Full Simulator
        </a>
      </div>
    </div>
  );
}
