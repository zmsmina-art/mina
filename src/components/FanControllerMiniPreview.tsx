'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

function getFanMode(duty: number, temperature: number) {
  if (duty === 0) {
    return 'OFF';
  }
  if (temperature >= 112) {
    return 'CRITICAL';
  }
  if (duty < 45) {
    return 'LOW';
  }
  if (duty < 75) {
    return 'MED';
  }
  return 'HIGH';
}

export default function FanControllerMiniPreview() {
  const [temperature, setTemperature] = useState(92);

  const { duty, rpm, mode, spinDuration, sliderBackground } = useMemo(() => {
    const dutyRaw = Math.round(((temperature - 82) / 30) * 100);
    const duty = Math.max(0, Math.min(100, dutyRaw));
    const rpm = Math.round(duty * 38);
    const mode = getFanMode(duty, temperature);
    const spinDuration = duty === 0 ? 2.4 : Number((2 - (duty / 100) * 1.55).toFixed(2));
    const sliderBackground = `linear-gradient(90deg, rgba(139, 92, 246, 0.75) 0%, rgba(139, 92, 246, 0.75) ${duty}%, rgba(139, 92, 246, 0.14) ${duty}%, rgba(139, 92, 246, 0.14) 100%)`;

    return { duty, rpm, mode, spinDuration, sliderBackground };
  }, [temperature]);

  const fanStyle = {
    ['--fan-spin-duration' as string]: `${spinDuration}s`,
  } as CSSProperties;

  return (
    <div className="mini-fan-sim mt-4">
      <div className="mini-fan-top">
        <label htmlFor="mini-engine-temp">Engine Temperature</label>
        <span>{temperature}C</span>
      </div>

      <input
        id="mini-engine-temp"
        type="range"
        min={70}
        max={120}
        step={1}
        value={temperature}
        onChange={(event) => setTemperature(Number(event.target.value))}
        className="mini-fan-slider"
        style={{ background: sliderBackground }}
        aria-label="Engine temperature slider"
      />

      <div className="mini-fan-stats">
        <span>Mode: {mode}</span>
        <span>{duty}% PWM</span>
        <span>{rpm} RPM</span>
      </div>

      <div className="mini-fan-stage">
        <div
          className={`mini-fan-disc ${duty === 0 ? 'mini-fan-disc--stopped' : ''}`}
          style={fanStyle}
          aria-hidden="true"
        >
          <span className="mini-fan-blade mini-fan-blade--1" />
          <span className="mini-fan-blade mini-fan-blade--2" />
          <span className="mini-fan-blade mini-fan-blade--3" />
          <span className="mini-fan-blade mini-fan-blade--4" />
          <span className="mini-fan-hub" />
        </div>

        <a href="/fan-controller/index.html" className="mini-fan-open">
          Open Full Simulator
        </a>
      </div>
    </div>
  );
}
