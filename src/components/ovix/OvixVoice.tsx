'use client';

import { useState } from 'react';
import { useRealtimeSession } from './useRealtimeSession';
import { OvixOrb } from './OvixOrb';
import { OvixTranscript } from './OvixTranscript';
import { OvixControls } from './OvixControls';
import { OvixHistory } from './OvixHistory';

export function OvixVoice() {
  const session = useRealtimeSession();
  const [mode, setMode] = useState<'dev' | 'prod' | 'assistant'>('assistant');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="section-label mb-1">Voice</div>
        <h2 className="font-display text-xl font-medium tracking-tight text-text-primary">
          Ovix
        </h2>
        <div className="w-8 h-px bg-gold-dim mt-3" />
      </div>

      {/* Orb + Controls — centered */}
      <div className="flex flex-col items-center py-8 sm:py-12">
        <OvixOrb
          isConnected={session.isConnected}
          isListening={session.isListening}
          isSpeaking={session.isSpeaking}
          isThinking={session.isThinking}
          inputLevel={session.inputLevel}
          outputLevel={session.outputLevel}
        />

        <div className="mt-8 w-full max-w-xs">
          <OvixControls
            isConnected={session.isConnected}
            isMuted={session.isMuted}
            error={session.error}
            mode={mode}
            onConnect={session.connect}
            onDisconnect={session.disconnect}
            onToggleMute={session.toggleMute}
            onModeChange={setMode}
          />
        </div>
      </div>

      {/* Transcript */}
      <OvixTranscript transcript={session.transcript} />

      {/* History — only show when not connected */}
      {!session.isConnected && <OvixHistory />}
    </div>
  );
}
