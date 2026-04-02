'use client';

import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';
import type { Idea } from '@/lib/school-events';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  idea: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  exploring: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  building: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  shipped: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  olunix: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  solnix: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  school: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  personal: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
  'business-idea': { bg: 'rgba(244,63,94,0.15)', text: '#fb7185' },
};

export default function IdeasClient({ ideas }: { ideas: Idea[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Ideas</div>
        <h2 style={heading}>Idea Vault</h2>
      </div>

      {ideas.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
            No ideas saved yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {ideas.map((idea) => {
            const sc = STATUS_COLORS[idea.status] ?? STATUS_COLORS.idea;
            return (
              <div key={idea.id} style={glassCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', color: T.textPrimary, fontWeight: 500 }}>{idea.title}</h3>
                  <span style={{ ...mono, fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', background: sc.bg, color: sc.text, textTransform: 'uppercase' }}>
                    {idea.status}
                  </span>
                </div>
                {idea.body && (
                  <p style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.5, marginBottom: '8px' }}>{idea.body}</p>
                )}
                {idea.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {idea.tags.map((tag) => {
                      const tc = TAG_COLORS[tag] ?? { bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' };
                      return (
                        <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', background: tc.bg, color: tc.text }}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
