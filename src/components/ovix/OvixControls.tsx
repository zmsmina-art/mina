'use client';

import { Mic, MicOff, PhoneOff, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OvixControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  error: string | null;
  mode: 'dev' | 'prod' | 'assistant';
  onConnect: (mode: 'dev' | 'prod' | 'assistant') => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
  onModeChange: (mode: 'dev' | 'prod' | 'assistant') => void;
}

const MODES = [
  { value: 'assistant' as const, label: 'Assistant' },
  { value: 'dev' as const, label: 'Dev' },
  { value: 'prod' as const, label: 'Prod' },
];

export function OvixControls({
  isConnected,
  isMuted,
  error,
  mode,
  onConnect,
  onDisconnect,
  onToggleMute,
  onModeChange,
}: OvixControlsProps) {
  return (
    <div className="space-y-4">
      {/* Mode selector */}
      {!isConnected && (
        <div className="flex items-center justify-center gap-1 p-1 rounded glass-card">
          {MODES.map(m => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={cn(
                'px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all',
                mode === m.value
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        {!isConnected ? (
          <button
            onClick={() => onConnect(mode)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all text-sm font-mono uppercase tracking-wider"
          >
            <Wifi className="h-4 w-4" />
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={onToggleMute}
              className={cn(
                'p-3 rounded-full border transition-all',
                isMuted
                  ? 'border-status-red/30 text-status-red bg-status-red/10'
                  : 'border-border-default text-text-secondary hover:border-border-hover'
              )}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={onDisconnect}
              className="p-3 rounded-full border border-status-red/30 text-status-red bg-status-red/10 hover:bg-status-red/20 transition-all"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Connection status */}
      {isConnected && (
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            {mode} mode
          </span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded glass-card border-status-red/20">
          <WifiOff className="h-3 w-3 text-status-red" />
          <span className="text-xs text-status-red">{error}</span>
        </div>
      )}
    </div>
  );
}
