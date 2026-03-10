export interface CaseStudyMetric {
  value: number;
  display: string;
  label: string;
}

export interface CaseStudyPhase {
  title: string;
  description: string;
  duration: string;
}

export interface CaseStudy {
  slug: string;
  tier: 'hero' | 'supporting';
  title: string;
  client: string;
  subtitle: string;
  problem: string;
  approach: string;
  result: string;
  metrics: CaseStudyMetric[];
  phases: CaseStudyPhase[];
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: 'growbyte-to-olunix',
    tier: 'hero',
    title: 'Repositioning GrowByte into Olunix',
    client: 'Olunix (formerly GrowByte)',
    subtitle: 'Full rebrand and repositioning for an AI-focused consultancy',
    problem:
      'GrowByte\u2019s broad agency framing attracted misaligned demand\u2014startups looking for generic social media management rather than strategic growth consulting. The brand identity lacked focus, diluting trust with ideal-fit clients.',
    approach:
      'Rebuilt the brand from the ground up: new name, visual identity, messaging architecture, and website. Repositioned around AI startup growth and founder-led trust. Created a content strategy centred on thought leadership and direct-response positioning.',
    result:
      'Higher-quality inbound conversations and stronger strategic fit from day one. Pipeline shifted from low-ticket service requests to retained advisory engagements with funded AI startups.',
    metrics: [
      { value: 3.2, display: '3.2x', label: 'Inbound quality improvement' },
      { value: 100, display: '100%', label: 'Brand identity overhaul' },
      { value: 68, display: '68%', label: 'Reduction in misaligned leads' },
    ],
    phases: [
      {
        title: 'Discovery & Audit',
        description: 'Interviewed stakeholders, audited existing funnels, mapped competitor positioning, and identified the gap between current perception and ideal client profile.',
        duration: '2 weeks',
      },
      {
        title: 'Strategy & Naming',
        description: 'Developed the new brand strategy, name (Olunix), and messaging hierarchy. Defined the core narrative: AI startups deserve a growth partner who speaks their language.',
        duration: '3 weeks',
      },
      {
        title: 'Design & Build',
        description: 'Created the visual identity system, designed and built the new website, crafted long-form content pillars, and established the editorial voice.',
        duration: '4 weeks',
      },
      {
        title: 'Launch & Optimise',
        description: 'Coordinated the public rebrand, redirected all existing assets, launched targeted outreach campaigns, and iterated on messaging based on early response data.',
        duration: '2 weeks',
      },
    ],
    tags: ['Branding', 'Positioning', 'Web Design', 'Content Strategy'],
  },
  {
    slug: 'xpomo-tiktok',
    tier: 'supporting',
    title: 'Scaling Xpomo to 5M+ Views on TikTok',
    client: 'Xpomo',
    subtitle: 'Short-form content engine for a consumer brand',
    problem:
      'Xpomo had strong product\u2013market fit but zero organic social presence. Previous agency attempts produced generic content that gained no traction.',
    approach:
      'Built a creator-led content engine: identified trending formats, scripted hooks optimised for watch-time, and produced a rapid-test cadence of 20+ videos per month.',
    result:
      'Surpassed 5 million organic views within 90 days. Multiple videos went viral, driving a measurable spike in direct site traffic and brand searches.',
    metrics: [
      { value: 5, display: '5M+', label: 'Organic views in 90 days' },
      { value: 12, display: '12x', label: 'Engagement rate vs. prior agency' },
    ],
    phases: [
      {
        title: 'Audit & Hook Research',
        description: 'Analysed top-performing content in the niche, reverse-engineered viral hooks, and defined the brand\u2019s on-camera persona.',
        duration: '1 week',
      },
      {
        title: 'Production Sprint',
        description: 'Produced and published 20+ short-form videos per month with rapid A/B testing of hooks, CTAs, and formats.',
        duration: '10 weeks',
      },
      {
        title: 'Scale & Repurpose',
        description: 'Doubled down on winning formats, repurposed top performers across Reels and Shorts, and built a self-sustaining content calendar.',
        duration: '2 weeks',
      },
    ],
    tags: ['TikTok', 'Short-Form Video', 'Content Production'],
  },
  {
    slug: 'wize-consulting',
    tier: 'supporting',
    title: 'Driving Qualified Leads for Wize Consulting',
    client: 'Wize Consulting',
    subtitle: 'Performance marketing for a B2B advisory firm',
    problem:
      'Wize Consulting relied entirely on referrals. When referral volume plateaued, revenue growth stalled with no predictable acquisition channel in place.',
    approach:
      'Launched a Google Ads campaign targeting high-intent keywords in their niche. Built dedicated landing pages with clear value propositions and integrated lead scoring to filter for qualified prospects.',
    result:
      'Generated a consistent pipeline of qualified leads within the first 30 days. Cost per qualified lead dropped significantly as campaigns matured over the following quarter.',
    metrics: [
      { value: 40, display: '40%', label: 'Lower cost per qualified lead' },
      { value: 3, display: '3x', label: 'Pipeline growth in 90 days' },
    ],
    phases: [
      {
        title: 'Keyword & Funnel Mapping',
        description: 'Researched high-intent keywords, mapped the buyer journey, and designed landing pages with clear conversion paths.',
        duration: '1 week',
      },
      {
        title: 'Campaign Build & Launch',
        description: 'Set up Google Ads campaigns with tight ad groups, wrote compelling ad copy, and established conversion tracking with lead scoring.',
        duration: '2 weeks',
      },
      {
        title: 'Optimisation',
        description: 'Reviewed search term reports weekly, pruned low-intent queries, adjusted bids, and refined landing page copy based on conversion data.',
        duration: '10 weeks',
      },
    ],
    tags: ['Google Ads', 'Lead Generation', 'Landing Pages'],
  },
];

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getHeroCaseStudy(): CaseStudy {
  return caseStudies.find((cs) => cs.tier === 'hero')!;
}

export function getSupportingCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.tier === 'supporting');
}
