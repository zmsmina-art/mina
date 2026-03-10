'use client';

import { useState } from 'react';
import { Linkedin, Check, Link as LinkIcon } from 'lucide-react';

interface ArticleShareButtonsProps {
  slug: string;
  title: string;
}

export default function ArticleShareButtons({ slug, title }: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://minamankarious.com/articles/${slug}`;
  const text = `${title} by Mina Mankarious`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail on unsupported contexts; keep UX stable.
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-dim)]">Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        <Linkedin size={14} />
      </a>
      <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        {copied ? <Check size={14} /> : <LinkIcon size={14} />}
      </button>
    </div>
  );
}
