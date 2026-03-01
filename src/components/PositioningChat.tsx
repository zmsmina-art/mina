'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, MessageCircle, Send } from 'lucide-react';
import { track } from '@vercel/analytics/react';
import type { ChatContext, ChatMessage } from '@/lib/positioning-chat';
import { CHAT_MESSAGE_LIMIT } from '@/lib/positioning-chat';
import type { PositioningResult } from '@/lib/positioning-grader';

// ── Props ────────────────────────────────────────────────────────────

type PositioningChatProps = {
  result: PositioningResult;
  chatContext: ChatContext;
  bookHref: string;
};

// ── Starter Chips ───────────────────────────────────────────────────

function getStarterChips(result: PositioningResult): string[] {
  const weakest = [...result.dimensions].sort((a, b) => a.score - b.score)[0];
  return [
    `How do I improve my ${weakest.label.toLowerCase()} score?`,
    `Rewrite my headline with a different angle`,
    `What makes my positioning stand out?`,
  ];
}

// ── Component ────────────────────────────────────────────────────────

export default function PositioningChat({ result, chatContext, bookHref }: PositioningChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const limitReached = userMessageCount >= CHAT_MESSAGE_LIMIT;
  const remaining = CHAT_MESSAGE_LIMIT - userMessageCount;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || limitReached) return;

    setError('');
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsStreaming(true);

    try {
      track('positioning_chat_sent', { message_number: userMessageCount + 1 });
    } catch {
      // no-op
    }

    try {
      const res = await fetch('/api/positioning-grader/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: chatContext, messages: nextMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let assistantText = '';

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        // Update the last message (assistant) with accumulated text
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantText };
          return updated;
        });
      }

      if (!assistantText.trim()) {
        // Remove empty assistant message
        setMessages((prev) => prev.slice(0, -1));
        setError('No response received. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // Remove the empty assistant message if it was added
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, limitReached, chatContext, userMessageCount]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleChipClick = useCallback((chip: string) => {
    setInput(chip);
    inputRef.current?.focus();
  }, []);

  const starterChips = getStarterChips(result);
  const hasMessages = messages.length > 0;

  return (
    <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle size={16} className="text-[var(--accent-purple-soft)]" />
        <p className="command-label">Ask about your results</p>
      </div>

      {/* Messages Area */}
      {hasMessages && (
        <div
          ref={scrollRef}
          className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-purple)] text-white'
                    : 'bg-[rgba(255,255,255,0.06)] text-[var(--text-muted)]'
                }`}
              >
                {msg.content || (
                  <Loader2 size={14} className="animate-spin text-[var(--text-dim)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Starter Chips (only when no messages) */}
      {!hasMessages && (
        <div className="mb-4 flex flex-wrap gap-2">
          {starterChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--accent-purple-soft)] hover:text-[var(--text-primary)]"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mb-3 text-sm text-red-400">{error}</p>
      )}

      {/* Input or Limit CTA */}
      {limitReached ? (
        <div className="text-center">
          <p className="mb-3 text-sm text-[var(--text-dim)]">You&apos;ve used all {CHAT_MESSAGE_LIMIT} messages.</p>
          <Link href={bookHref} className="accent-btn inline-flex">
            Book a positioning call
            <ArrowUpRight size={15} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your positioning..."
            disabled={isStreaming}
            className="flex-1 rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex shrink-0 items-center justify-center rounded-xl bg-[var(--accent-purple)] px-3.5 py-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isStreaming ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="mt-3 text-center text-xs text-[var(--text-dim)]">
        Responses are AI-generated.{!limitReached && ` ${remaining} message${remaining === 1 ? '' : 's'} remaining.`}
      </p>
    </article>
  );
}
