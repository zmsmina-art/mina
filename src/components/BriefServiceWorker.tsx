'use client';

import { useEffect } from 'react';

export function BriefServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/brief/sw.js', { scope: '/brief' });
    }
  }, []);
  return null;
}
