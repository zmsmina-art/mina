'use client';

import { useEffect, useState } from 'react';

/** Live local-time status chip for the hero. */
export default function NowChip() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Toronto',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000 * 20);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="now-chip">
      <span className="now-chip-dot" aria-hidden="true" />
      Toronto
      {time && (
        <>
          <span className="now-chip-sep" aria-hidden="true">·</span>
          <span className="now-chip-time" suppressHydrationWarning>{time}</span>
        </>
      )}
    </span>
  );
}
