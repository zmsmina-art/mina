'use client';

import { useEffect, useState } from 'react';
import { Clock, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';

interface Conversation {
  id: string;
  mode: string;
  summary: string | null;
  transcript: { role: string; content: string; timestamp: string }[];
  durationSeconds: number | null;
  tags: string[];
  createdAt: string;
}

export function OvixHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brief/ovix/conversations')
      .then(r => r.json())
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-4">
        <span className="section-label text-[10px]">Recent Conversations</span>
        <p className="text-xs text-text-muted mt-2">Loading...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="glass-card p-4">
        <span className="section-label text-[10px]">Recent Conversations</span>
        <p className="text-xs text-text-muted mt-2">No conversations yet. Start one above.</p>
      </div>
    );
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffH = (now.getTime() - d.getTime()) / 3600000;
    if (diffH < 1) return `${Math.floor(diffH * 60)}m ago`;
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="space-y-2">
      <span className="section-label text-[10px]">Recent Conversations</span>

      {conversations.map(conv => {
        const isExpanded = expandedId === conv.id;
        return (
          <div key={conv.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : conv.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-text-muted shrink-0" />
              ) : (
                <ChevronRight className="h-3 w-3 text-text-muted shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">
                  {conv.summary || `${conv.mode} session`}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-mono uppercase text-gold-dim">
                    {conv.mode}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDuration(conv.durationSeconds)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <MessageSquare className="h-2.5 w-2.5" />
                    {conv.transcript.length}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-text-muted shrink-0">{formatDate(conv.createdAt)}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-border-default px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
                {conv.transcript.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="shrink-0 text-[9px] font-mono uppercase tracking-wider mt-0.5" style={{
                      color: entry.role === 'user' ? 'var(--text-muted)' : 'var(--gold-dim)',
                    }}>
                      {entry.role === 'user' ? 'You' : 'Ovix'}
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
