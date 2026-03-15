export const T = {
  bg: '#0A0A0C',
  elevated: 'rgba(255,255,255,0.025)',
  surface: 'rgba(255,255,255,0.015)',
  gold: '#C9A84C',
  goldDim: '#8A7233',
  goldBright: '#E8C65A',
  ice: '#7EB8DA',
  textPrimary: '#E8E4DC',
  textSecondary: 'rgba(232,228,220,0.55)',
  textMuted: 'rgba(232,228,220,0.30)',
  borderDefault: 'rgba(255,255,255,0.05)',
  borderGold: 'rgba(201,168,76,0.12)',
  statusGreen: '#4ADE80',
  statusYellow: '#FACC15',
  statusRed: '#F87171',
} as const;

export const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: T.goldDim,
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
  marginBottom: '12px',
};

export const glassCard: React.CSSProperties = {
  background: T.elevated,
  border: `1px solid ${T.borderDefault}`,
  borderRadius: '4px',
  padding: '20px',
};

export const mono: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
};

export const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 500,
  fontFamily: "var(--font-playfair-display), 'Playfair Display', Georgia, serif",
  color: T.textPrimary,
  letterSpacing: '-0.01em',
};
