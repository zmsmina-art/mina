'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, TouchEvent } from 'react';

const FAN_BLADE_ANGLES = [0, 72, 144, 216, 288];
const ENGINE_ADC_MAX = 1023;

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

function getFanMode(duty: number) {
  if (duty === 0) return 'AUTO / OFF';
  return `AUTO / ${duty}%`;
}

export default function FanControllerMiniPreview() {
  const [engineTempRaw, setEngineTempRaw] = useState(614);
  const [safetyActive, setSafetyActive] = useState(false);
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const bladesGroupRef = useRef<SVGGElement | null>(null);
  const bladeAngleRef = useRef(0);

  const temperature = adcToEngineTemp(engineTempRaw);
  const voltage = adcToVoltage(engineTempRaw);

  useEffect(() => {
    setSafetyActive((isSafetyActive) => {
      if (temperature >= 90) return true;
      if (isSafetyActive && temperature >= 85) return true;
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

  const { duty, mode, spinDuration, sliderBackground } = useMemo(() => {
    const duty = safetyActive ? 100 : tempToDuty(temperature);
    const mode = safetyActive ? 'SAFETY' : getFanMode(duty);
    const spinDuration = duty === 0 ? 2.5 : Number((2.5 - (duty / 100) * 2.25).toFixed(2));
    const adcFill = Number(((engineTempRaw / ENGINE_ADC_MAX) * 100).toFixed(2));
    const sliderBackground = `
      linear-gradient(
        90deg,
        rgba(74, 222, 128, 0.28) 0%,
        rgba(74, 222, 128, 0.28) 49.9%,
        rgba(96, 165, 250, 0.28) 50%,
        rgba(96, 165, 250, 0.28) 66.6%,
        rgba(251, 191, 36, 0.28) 66.7%,
        rgba(251, 191, 36, 0.28) 74.9%,
        rgba(248, 113, 113, 0.32) 75%,
        rgba(248, 113, 113, 0.32) 100%
      ),
      linear-gradient(
        90deg,
        rgba(167, 139, 250, 0.86) 0%,
        rgba(167, 139, 250, 0.86) ${adcFill}%,
        rgba(139, 92, 246, 0.12) ${adcFill}%,
        rgba(139, 92, 246, 0.12) 100%
      )
    `;

    return { duty, mode, spinDuration, sliderBackground };
  }, [engineTempRaw, safetyActive, temperature]);

  const fanStyle = {
    ['--fan-spin-duration' as string]: `${spinDuration}s`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const group = bladesGroupRef.current;
    if (!group) return;

    const mobileLike = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
    if (!mobileLike) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let lastTime = performance.now();

    if (duty === 0) {
      group.setAttribute('transform', `rotate(${bladeAngleRef.current} 100 100)`);
      return;
    }

    const baseSpeed = prefersReducedMotion ? 75 : 130;
    const speedDegPerSecond = baseSpeed + duty * (prefersReducedMotion ? 3.2 : 5.2);

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      bladeAngleRef.current = (bladeAngleRef.current + speedDegPerSecond * deltaSeconds) % 360;
      group.setAttribute('transform', `rotate(${bladeAngleRef.current} 100 100)`);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [duty]);

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
        <div
          className={`mini-fan-disc ${duty === 0 ? 'mini-fan-disc--stopped' : ''} ${safetyActive ? 'mini-fan-disc--safety' : ''}`}
          style={fanStyle}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="mini-fan-svg">
            <circle cx="100" cy="100" r="95" className="mini-fan-housing" />
            <g ref={bladesGroupRef} className="mini-fan-blades-group">
              <circle cx="100" cy="100" r="12" className="mini-fan-hub" />
              <circle cx="160" cy="100" r="3.2" className="mini-fan-rotor-dot" />
              {FAN_BLADE_ANGLES.map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const tipX = 100 + 75 * Math.cos(rad);
                const tipY = 100 + 75 * Math.sin(rad);
                const startX = 100 + 15 * Math.cos(rad);
                const startY = 100 + 15 * Math.sin(rad);
                const cpL = rad - 0.4;
                const cpR = rad + 0.4;

                return (
                  <path
                    key={angle}
                    className="mini-fan-blade"
                    d={`M ${startX},${startY} Q ${100 + 55 * Math.cos(cpL)},${100 + 55 * Math.sin(cpL)} ${tipX},${tipY} Q ${100 + 55 * Math.cos(cpR)},${100 + 55 * Math.sin(cpR)} ${startX},${startY}`}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <a href="/fan-controller/index.html" className="mini-fan-open">
          Open Full Simulator
        </a>
      </div>
    </div>
  );
}
