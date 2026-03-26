'use client';

import { useCallback, useRef, useState } from 'react';
import { OVIX_TOOLS } from '@/lib/ovix-tools';
import { buildSystemPrompt } from '@/lib/ovix-system-prompt';

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SessionState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  isMuted: boolean;
  error: string | null;
  transcript: TranscriptEntry[];
  inputLevel: number;
  outputLevel: number;
}

const SAMPLE_RATE = 24000;

export function useRealtimeSession() {
  const [state, setState] = useState<SessionState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    isThinking: false,
    isMuted: false,
    error: null,
    transcript: [],
    inputLevel: 0,
    outputLevel: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<Float32Array<ArrayBuffer>[]>([]);
  const isPlayingRef = useRef(false);
  const sessionStartRef = useRef<number>(0);
  const currentResponseTextRef = useRef('');
  const currentUserTextRef = useRef('');
  const pendingFunctionCallsRef = useRef<Map<string, { name: string; arguments: string }>>(new Map());

  const update = useCallback((partial: Partial<SessionState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTranscript = useCallback((role: 'user' | 'assistant', content: string) => {
    if (!content.trim()) return;
    setState(prev => ({
      ...prev,
      transcript: [...prev.transcript, { role, content, timestamp: new Date().toISOString() }],
    }));
  }, []);

  // Audio playback
  const playAudioChunk = useCallback((pcmData: Float32Array<ArrayBuffer>) => {
    playbackQueueRef.current.push(pcmData);
    if (!isPlayingRef.current) drainPlaybackQueue();
  }, []);

  function drainPlaybackQueue() {
    const ctx = audioContextRef.current;
    if (!ctx || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      update({ isSpeaking: false });
      return;
    }

    isPlayingRef.current = true;
    update({ isSpeaking: true });

    const chunk = playbackQueueRef.current.shift()!;
    const buffer = ctx.createBuffer(1, chunk.length, SAMPLE_RATE);
    buffer.copyToChannel(chunk, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => drainPlaybackQueue();
    source.start();

    // Track output level
    let sum = 0;
    for (let i = 0; i < chunk.length; i++) sum += chunk[i] * chunk[i];
    const rms = Math.sqrt(sum / chunk.length);
    update({ outputLevel: Math.min(1, rms * 5) });
  }

  // Decode base64 PCM16 to Float32
  function decodeAudio(base64: string): Float32Array<ArrayBuffer> {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const int16 = new Int16Array(buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
    return float32;
  }

  // Handle tool calls
  async function handleFunctionCall(callId: string, name: string, args: string) {
    update({ isThinking: true });
    try {
      const parsedArgs = JSON.parse(args || '{}');
      const res = await fetch(`/api/brief/ovix/tool/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedArgs),
      });
      const data = await res.json();

      const ws = wsRef.current;
      if (ws?.readyState === WebSocket.OPEN) {
        // Send function result
        ws.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: JSON.stringify(data.result ?? data),
          },
        }));
        // Trigger response
        ws.send(JSON.stringify({ type: 'response.create' }));
      }
    } catch (e) {
      console.error('Tool call error:', e);
      const ws = wsRef.current;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: JSON.stringify({ error: `Failed to execute ${name}` }),
          },
        }));
        ws.send(JSON.stringify({ type: 'response.create' }));
      }
    }
    update({ isThinking: false });
  }

  // Handle WebSocket messages
  function handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'session.created':
      case 'session.updated':
        break;

      case 'input_audio_buffer.speech_started':
        update({ isListening: true });
        // Interrupt if Ovix is speaking
        playbackQueueRef.current = [];
        isPlayingRef.current = false;
        update({ isSpeaking: false });
        currentUserTextRef.current = '';
        break;

      case 'input_audio_buffer.speech_stopped':
        update({ isListening: false });
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          currentUserTextRef.current = data.transcript;
          addTranscript('user', data.transcript);
        }
        break;

      case 'response.audio.delta':
        if (data.delta) {
          const pcm = decodeAudio(data.delta);
          playAudioChunk(pcm);
        }
        break;

      case 'response.audio_transcript.delta':
        if (data.delta) {
          currentResponseTextRef.current += data.delta;
        }
        break;

      case 'response.audio_transcript.done':
        if (currentResponseTextRef.current) {
          addTranscript('assistant', currentResponseTextRef.current);
          currentResponseTextRef.current = '';
        }
        break;

      case 'response.function_call_arguments.delta':
        if (data.call_id) {
          const existing = pendingFunctionCallsRef.current.get(data.call_id);
          if (existing) {
            existing.arguments += data.delta ?? '';
          } else {
            pendingFunctionCallsRef.current.set(data.call_id, {
              name: data.name ?? '',
              arguments: data.delta ?? '',
            });
          }
        }
        break;

      case 'response.function_call_arguments.done':
        if (data.call_id) {
          const call = pendingFunctionCallsRef.current.get(data.call_id);
          const name = data.name ?? call?.name ?? '';
          const args = data.arguments ?? call?.arguments ?? '{}';
          pendingFunctionCallsRef.current.delete(data.call_id);
          handleFunctionCall(data.call_id, name, args);
        }
        break;

      case 'response.done':
        update({ isThinking: false });
        break;

      case 'error':
        console.error('Realtime API error:', data.error);
        update({ error: data.error?.message ?? 'Unknown error' });
        break;
    }
  }

  // Connect to Azure Realtime
  const connect = useCallback(async (mode: 'dev' | 'prod' | 'assistant' = 'assistant') => {
    update({ error: null });

    try {
      // 1. Get ephemeral token
      const tokenRes = await fetch('/api/brief/ovix/token', { method: 'POST' });
      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.detail || err.error || 'Failed to get token');
      }
      const { token, wssUrl } = await tokenRes.json();

      // 2. Get dashboard context
      const contextRes = await fetch('/api/brief/ovix/context');
      const context = contextRes.ok ? await contextRes.json() : {};

      // 3. Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // 4. Create audio context
      const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioContextRef.current = audioCtx;

      // 5. Connect WebSocket — Azure uses api-key as query param
      const wsUrlWithKey = `${wssUrl}&api-key=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrlWithKey);
      wsRef.current = ws;

      ws.onopen = () => {
        sessionStartRef.current = Date.now();
        update({ isConnected: true });

        // Configure session
        const systemPrompt = buildSystemPrompt(mode, context);
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            instructions: systemPrompt,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 700,
            },
            tools: OVIX_TOOLS,
          },
        }));

        // Start capturing audio
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (state.isMuted) return;
          const input = e.inputBuffer.getChannelData(0);

          // Track input level
          let sum = 0;
          for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
          const rms = Math.sqrt(sum / input.length);
          update({ inputLevel: Math.min(1, rms * 5) });

          // Convert to PCM16 and send
          const pcm16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          // Base64 encode
          const bytes = new Uint8Array(pcm16.buffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          const base64 = btoa(binary);

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: base64,
            }));
          }
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
      };

      ws.onmessage = handleMessage;

      ws.onerror = () => {
        update({ error: 'WebSocket connection error' });
      };

      ws.onclose = () => {
        update({ isConnected: false, isListening: false, isSpeaking: false });
      };

    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      update({ error: msg, isConnected: false });
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(async () => {
    // Save conversation
    if (state.transcript.length > 0) {
      const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      try {
        await fetch('/api/brief/ovix/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: state.transcript,
            durationSeconds: duration,
          }),
        });
      } catch (e) {
        console.error('Failed to save conversation:', e);
      }
    }

    // Cleanup
    processorRef.current?.disconnect();
    processorRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
    pendingFunctionCallsRef.current.clear();

    update({
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      isThinking: false,
      inputLevel: 0,
      outputLevel: 0,
    });
  }, [state.transcript]);

  const mute = useCallback(() => update({ isMuted: true }), []);
  const unmute = useCallback(() => update({ isMuted: false }), []);
  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    mute,
    unmute,
    toggleMute,
  };
}
