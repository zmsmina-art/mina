'use client';

import { useEffect, useState } from 'react';

export type MotionMode = 'desktop' | 'mobile' | 'reduced';

type MotionDurations = {
  enter: number;
  stagger: number;
};

type MotionDistances = {
  enterY: number;
  proseY: number;
};

type MotionSpring = {
  stiffness: number;
  damping: number;
  mass: number;
};

export type MotionProfile = {
  mode: MotionMode;
  reduced: boolean;
  durations: MotionDurations;
  distances: MotionDistances;
  spring: MotionSpring;
};

const DESKTOP_PROFILE: MotionProfile = {
  mode: 'desktop',
  reduced: false,
  durations: {
    enter: 0.42,
    stagger: 0.06,
  },
  distances: {
    enterY: 20,
    proseY: 8,
  },
  spring: {
    stiffness: 420,
    damping: 34,
    mass: 0.7,
  },
};

const MOBILE_PROFILE: MotionProfile = {
  mode: 'mobile',
  reduced: false,
  durations: {
    enter: 0.24,
    stagger: 0.03,
  },
  distances: {
    enterY: 10,
    proseY: 4,
  },
  spring: {
    stiffness: 520,
    damping: 42,
    mass: 0.65,
  },
};

const REDUCED_PROFILE: MotionProfile = {
  mode: 'reduced',
  reduced: true,
  durations: {
    enter: 0,
    stagger: 0,
  },
  distances: {
    enterY: 0,
    proseY: 0,
  },
  spring: {
    stiffness: 0,
    damping: 0,
    mass: 0,
  },
};

function resolveMotionProfile(): MotionProfile {
  if (typeof window === 'undefined') {
    return DESKTOP_PROFILE;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return REDUCED_PROFILE;
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  return isMobile ? MOBILE_PROFILE : DESKTOP_PROFILE;
}

function subscribeMediaQuery(query: MediaQueryList, onChange: () => void) {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }

  query.addListener(onChange);
  return () => query.removeListener(onChange);
}

export default function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>(() => resolveMotionProfile());

  useEffect(() => {
    const viewportQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncProfile = () => {
      setProfile(resolveMotionProfile());
    };

    syncProfile();

    const unsubscribeViewport = subscribeMediaQuery(viewportQuery, syncProfile);
    const unsubscribeReducedMotion = subscribeMediaQuery(reducedMotionQuery, syncProfile);

    return () => {
      unsubscribeViewport();
      unsubscribeReducedMotion();
    };
  }, []);

  return profile;
}
