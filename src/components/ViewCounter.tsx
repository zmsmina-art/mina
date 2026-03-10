'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setViews(data.views);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (views === null) {
    return (
      <span className="flex items-center gap-1.5">
        <Eye size={14} />
        <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <Eye size={14} />
      {views.toLocaleString()} {views === 1 ? 'reader' : 'readers'}
    </span>
  );
}
