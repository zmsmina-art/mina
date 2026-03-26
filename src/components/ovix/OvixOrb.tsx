'use client';

interface OvixOrbProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  inputLevel: number;
  outputLevel: number;
}

export function OvixOrb({ isConnected, isListening, isSpeaking, isThinking, inputLevel, outputLevel }: OvixOrbProps) {
  const level = isSpeaking ? outputLevel : isListening ? inputLevel : 0;
  const scale = 1 + level * 0.15;
  const glowIntensity = level * 40;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Orb */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-150"
          style={{
            transform: `scale(${1 + level * 0.25})`,
            boxShadow: isConnected
              ? `0 0 ${20 + glowIntensity}px ${5 + glowIntensity * 0.3}px rgba(201, 168, 76, ${0.1 + level * 0.2})`
              : 'none',
          }}
        />

        {/* Main orb */}
        <div
          className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border transition-all duration-150"
          style={{
            transform: `scale(${scale})`,
            borderColor: isConnected
              ? `rgba(201, 168, 76, ${0.3 + level * 0.5})`
              : 'rgba(255, 255, 255, 0.05)',
            background: isConnected
              ? `radial-gradient(circle at 40% 35%, rgba(201, 168, 76, ${0.08 + level * 0.12}), rgba(10, 10, 12, 0.9))`
              : 'radial-gradient(circle at 40% 35%, rgba(255, 255, 255, 0.02), rgba(10, 10, 12, 0.9))',
            boxShadow: isConnected
              ? `inset 0 0 30px rgba(201, 168, 76, ${0.05 + level * 0.1}), 0 0 ${10 + glowIntensity * 0.5}px rgba(201, 168, 76, ${0.05 + level * 0.15})`
              : 'inset 0 0 20px rgba(255, 255, 255, 0.01)',
          }}
        >
          {/* Inner pulse rings when speaking */}
          {isSpeaking && (
            <>
              <div className="absolute inset-4 rounded-full border border-gold/20 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-8 rounded-full border border-gold/10 animate-ping" style={{ animationDuration: '2s' }} />
            </>
          )}

          {/* Thinking spinner */}
          {isThinking && (
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-gold/50 animate-spin" />
          )}

          {/* Ovix eyes — pill shapes */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-5">
            <div
              className="w-3 h-6 sm:w-3.5 sm:h-7 rounded-full transition-all duration-200"
              style={{
                backgroundColor: isConnected ? `rgba(201, 168, 76, ${0.6 + level * 0.4})` : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isConnected ? `0 0 ${6 + level * 8}px rgba(201, 168, 76, ${0.3 + level * 0.3})` : 'none',
              }}
            />
            <div
              className="w-3 h-6 sm:w-3.5 sm:h-7 rounded-full transition-all duration-200"
              style={{
                backgroundColor: isConnected ? `rgba(201, 168, 76, ${0.6 + level * 0.4})` : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isConnected ? `0 0 ${6 + level * 8}px rgba(201, 168, 76, ${0.3 + level * 0.3})` : 'none',
              }}
            />
          </div>

          {/* Smile — small arc below eyes */}
          <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2">
            <div
              className="w-4 h-2 rounded-b-full transition-all duration-200"
              style={{
                borderBottom: `1.5px solid rgba(201, 168, 76, ${isConnected ? 0.4 + level * 0.3 : 0.08})`,
                borderLeft: `1.5px solid rgba(201, 168, 76, ${isConnected ? 0.2 + level * 0.2 : 0.04})`,
                borderRight: `1.5px solid rgba(201, 168, 76, ${isConnected ? 0.2 + level * 0.2 : 0.04})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="section-label text-[10px]">
          {!isConnected && 'offline'}
          {isConnected && isThinking && 'thinking...'}
          {isConnected && isSpeaking && 'speaking'}
          {isConnected && isListening && 'listening'}
          {isConnected && !isListening && !isSpeaking && !isThinking && 'ready'}
        </p>
      </div>
    </div>
  );
}
