'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, TouchEvent } from 'react';

const FAN_BLADE_ANGLES = [0, 72, 144, 216, 288];
const ENGINE_ADC_MAX = 1023;
const MOBILE_SPIN_QUERY = '(max-width: 767px), (hover: none) and (pointer: coarse)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

function subscribeMediaQuery(query: MediaQueryList, handler: () => void) {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }

  query.addListener(handler);
  return () => query.removeListener(handler);
}

function applyBladeRotation(group: SVGGElement, angleDeg: number) {
  const normalizedAngle = ((angleDeg % 360) + 360) % 360;
  const roundedAngle = Number(normalizedAngle.toFixed(3));
  group.style.transform = `translate(100px, 100px) rotate(${roundedAngle}deg) translate(-100px, -100px)`;
  group.setAttribute('transform', `rotate(${roundedAngle} 100 100)`);
}

function clearBladeRotation(group: SVGGElement) {
  group.style.removeProperty('transform');
  group.style.removeProperty('transform-origin');
  group.style.removeProperty('transform-box');
  group.removeAttribute('transform');
}

export default function FanControllerMiniPreview() {
  const [engineTempRaw, setEngineTempRaw] = useState(614);
  const [safetyActive, setSafetyActive] = useState(false);
  const [useJsSpin, setUseJsSpin] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const simRef = useRef<HTMLDivElement | null>(null);
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
        rgba(212, 175, 55, 0.86) 0%,
        rgba(212, 175, 55, 0.86) ${adcFill}%,
        rgba(212, 175, 55, 0.14) ${adcFill}%,
        rgba(212, 175, 55, 0.14) 100%
      )
    `;

    return { duty, mode, spinDuration, sliderBackground };
  }, [engineTempRaw, safetyActive, temperature]);

  const fanStyle = {
    ['--fan-spin-duration' as string]: `${spinDuration}s`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarseInputQuery = window.matchMedia(MOBILE_SPIN_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const syncProfile = () => {
      setUseJsSpin(coarseInputQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    syncProfile();

    const unsubscribeCoarse = subscribeMediaQuery(coarseInputQuery, syncProfile);
    const unsubscribeReduced = subscribeMediaQuery(reducedMotionQuery, syncProfile);

    return () => {
      unsubscribeCoarse();
      unsubscribeReduced();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const node = simRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInViewport(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const group = bladesGroupRef.current;
    if (!group) return;

    if (!useJsSpin) {
      clearBladeRotation(group);
      return;
    }

    group.style.transformOrigin = '0 0';
    group.style.transformBox = 'view-box';

    if (prefersReducedMotion || duty === 0 || !isInViewport) {
      applyBladeRotation(group, bladeAngleRef.current);
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    const speedDegPerSecond = 150 + duty * 4.8;

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      bladeAngleRef.current = (bladeAngleRef.current + speedDegPerSecond * deltaSeconds) % 360;
      applyBladeRotation(group, bladeAngleRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [duty, isInViewport, prefersReducedMotion, useJsSpin]);

  return (
    <div ref={simRef} className="mini-fan-sim mt-4">
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
            className={`mini-fan-disc ${duty === 0 ? 'mini-fan-disc--stopped' : ''} ${safetyActive ? 'mini-fan-disc--safety' : ''}`}
            style={fanStyle}
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" className="mini-fan-svg">
              <circle cx="100" cy="100" r="95" className="mini-fan-housing" />
              <g
                ref={bladesGroupRef}
                className={`mini-fan-blades-group ${useJsSpin ? 'mini-fan-blades-group--js' : ''}`}
              >
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
              <circle cx="100" cy="100" r="12" className="mini-fan-hub" />
            </svg>
          </div>
        </div>

        <a href="/fan-controller/index.html" className="mini-fan-open">
          Open Full Simulator
        </a>
      </div>
    </div>
  );
}
