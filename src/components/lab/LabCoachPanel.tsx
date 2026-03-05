'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Loader2,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import type { CoachMessage } from '@/lib/lab/types';

type Props = {
  workspaceId: string;
  initialHistory: CoachMessage[];
};

const STARTER_PROMPTS = [
  'What should I work on first?',
  'How can I improve my clarity score?',
  'Is my positioning differentiated enough?',
  'What module should I do next?',
];

export default function LabCoachPanel({ workspaceId, initialHistory }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>(initialHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: CoachMessage = {
        role: 'user',
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/lab/${workspaceId}/coach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to get response');
          setLoading(false);
          return;
        }

        const assistantMsg: CoachMessage = {
          role: 'assistant',
          content: data.reply,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, loading]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  return (
    <>
      {/* Floating toggle button (mobile + desktop) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          background: 'var(--accent-ruby)',
          color: '#fff',
          boxShadow: '0 4px 24px rgba(122, 64, 242, 0.4)',
        }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'var(--bg-elev-1)',
              border: '1px solid var(--stroke-soft)',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid var(--stroke-soft)' }}
            >
              <Brain className="w-4 h-4" style={{ color: 'var(--accent-ruby)' }} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
              >
                AI Coach
              </span>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-dim)' }}>
                by Mina
              </span>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ minHeight: 200 }}
            >
              {messages.length === 0 && !loading && (
                <div className="space-y-2">
                  <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
                    Ask me anything about your positioning:
                  </p>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="block w-full text-left text-sm px-3 py-2 rounded-lg transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(122, 64, 242, 0.08)',
                        color: 'var(--accent-ruby-soft)',
                        border: '1px solid rgba(122, 64, 242, 0.15)',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'rgba(122, 64, 242, 0.15)'
                          : 'rgba(255,255,255,0.06)',
                      color: 'var(--text-primary)',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                      borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : undefined,
                    }}
                  >
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      style={{ color: 'var(--accent-ruby)' }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-center" style={{ color: '#ef4444' }}>
                  {error}
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 shrink-0"
              style={{ borderTop: '1px solid var(--stroke-soft)' }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about your positioning..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-elev-2)',
                  border: '1px solid var(--stroke-soft)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: input.trim() ? 'var(--accent-ruby)' : 'rgba(255,255,255,0.06)',
                  color: input.trim() ? '#fff' : 'var(--text-dim)',
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
