'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TranscriptEntry } from './useRealtimeSession';

interface OvixTranscriptProps {
  transcript: TranscriptEntry[];
}

export function OvixTranscript({ transcript }: OvixTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  if (transcript.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="section-label text-[10px]">Transcript</span>
        {collapsed ? <ChevronDown className="h-3 w-3 text-text-muted" /> : <ChevronUp className="h-3 w-3 text-text-muted" />}
      </button>

      {!collapsed && (
        <div className="max-h-64 overflow-y-auto px-4 pb-4 space-y-3">
          {transcript.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider mt-0.5" style={{
                color: entry.role === 'user' ? 'var(--text-muted)' : 'var(--gold-dim)',
              }}>
                {entry.role === 'user' ? 'You' : 'Ovix'}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
