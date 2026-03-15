'use client';

import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';
import type { StripeSnapshot, PosthogSnapshot, GithubSnapshot, VercelSnapshot, GscSnapshot, AgentReport } from '@/lib/school-events';

function StatusDot({ status }: { status: 'green' | 'yellow' | 'red' }) {
  const colors = { green: T.statusGreen, yellow: T.statusYellow, red: T.statusRed };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status], display: 'inline-block', flexShrink: 0 }} />;
}

function LV({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ ...mono, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textMuted }}>{label}</span>
      <span style={{ fontSize: '14px', color: color ?? T.textPrimary }}>{value}</span>
    </div>
  );
}

function ServiceCard({ title, status, children }: { title: string; status: 'green' | 'yellow' | 'red'; children: React.ReactNode }) {
  return (
    <div style={glassCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <StatusDot status={status} />
        <h3 style={{ ...mono, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textPrimary }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{children}</div>
    </div>
  );
}

function vercelStatus(state: string): 'green' | 'yellow' | 'red' {
  if (state === 'READY') return 'green';
  if (state === 'ERROR') return 'red';
  return 'yellow';
}

interface Props {
  stripe: StripeSnapshot | null;
  posthog: PosthogSnapshot | null;
  github: GithubSnapshot | null;
  vercel: VercelSnapshot | null;
  gsc: GscSnapshot | null;
  summary: AgentReport | null;
}

export default function HealthClient({ stripe, posthog, github, vercel, gsc, summary }: Props) {
  const services: { name: string; status: 'green' | 'yellow' | 'red' }[] = [];
  if (vercel?.projects) {
    for (const [name, proj] of Object.entries(vercel.projects)) {
      services.push({ name, status: vercelStatus(proj.state) });
    }
  }
  if (stripe) services.push({ name: 'Stripe', status: stripe.failedCharges24h > 0 ? 'red' : 'green' });
  if (posthog) services.push({ name: 'PostHog', status: posthog.errors.length > 0 ? 'yellow' : 'green' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Surveillance</div>
        <h2 style={heading}>Asset Status</h2>
      </div>

      {services.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {services.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StatusDot status={s.status} />
              <span style={{ ...mono, fontSize: '11px', color: T.textSecondary }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div style={{ ...glassCard, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: 1, background: `linear-gradient(90deg, transparent, ${T.goldDim}, transparent)` }} />
          <h3 style={{ ...sectionLabel, marginBottom: '8px' }}>Field Report</h3>
          <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7, whiteSpace: 'pre-line', fontStyle: 'italic' }}>{summary.content}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {stripe && (
          <ServiceCard title="Revenue (Stripe)" status={stripe.failedCharges24h > 0 ? 'red' : 'green'}>
            <LV label="Active agents" value={stripe.activeSubscribers} />
            {stripe.newSubs24h > 0 && <LV label="Recruited" value={`+${stripe.newSubs24h}`} color={T.statusGreen} />}
            {stripe.churned24h > 0 && <LV label="Defected" value={stripe.churned24h} color={T.statusRed} />}
            {stripe.failedCharges24h > 0 && <LV label="Failed txns" value={stripe.failedCharges24h} color={T.statusRed} />}
          </ServiceCard>
        )}

        {vercel?.projects && Object.entries(vercel.projects).map(([name, proj]) => (
          <ServiceCard key={name} title={`Deploy — ${name}`} status={vercelStatus(proj.state)}>
            <LV label="Status" value={proj.state} />
            <LV label="Last deploy" value={`${proj.age_hours}h ago`} />
            {proj.error && <p style={{ fontSize: '14px', color: T.statusRed }}>{proj.error}</p>}
          </ServiceCard>
        ))}

        {posthog && (
          <ServiceCard title="Traffic (PostHog)" status={posthog.errors.length > 0 ? 'yellow' : 'green'}>
            <LV label="Pageviews" value={posthog.pageviews.toLocaleString()} />
            <LV label="Unique visitors" value={posthog.uniqueVisitors.toLocaleString()} />
            {posthog.errors.length > 0 && <LV label="Anomalies" value={`${posthog.errors.length} type(s)`} color={T.statusYellow} />}
          </ServiceCard>
        )}

        {github && (
          <ServiceCard title="GitHub" status={github.notifications > 0 ? 'yellow' : 'green'}>
            <LV label="Notifications" value={github.notifications} />
            {github.repos && Object.entries(github.repos).map(([repo, data]) => (
              <div key={repo} style={{ ...glassCard, padding: '10px', borderRadius: '4px' }}>
                <span style={{ ...mono, fontSize: '12px', color: T.textSecondary }}>{repo}</span>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                  <LV label="Commits" value={data.commits_24h} />
                  <LV label="PRs" value={data.open_prs} />
                </div>
              </div>
            ))}
          </ServiceCard>
        )}

        {gsc && (
          <ServiceCard title="Search Console" status="green">
            <LV label="Clicks" value={gsc.clicks} />
            <LV label="Impressions" value={gsc.impressions.toLocaleString()} />
            <LV label="CTR" value={`${gsc.ctr.toFixed(1)}%`} />
            <LV label="Avg position" value={gsc.position.toFixed(1)} />
          </ServiceCard>
        )}
      </div>

      {!stripe && !vercel && !posthog && !github && !gsc && (
        <div style={glassCard}>
          <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
            No intelligence gathered yet, sir. The surveillance operatives have not reported in.
          </p>
        </div>
      )}
    </div>
  );
}
