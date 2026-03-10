// ── Types ────────────────────────────────────────────────────────────

export type PersonaConfig = {
  slug: string;
  displayName: string;
  heroHeading: string;
  heroSubheading: string;
  placeholders: {
    startupName: string;
    targetAudience: string;
    headline: string;
    oneLiner: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

// ── Persona Data ─────────────────────────────────────────────────────

const PERSONAS: PersonaConfig[] = [
  {
    slug: 'for-saas-founders',
    displayName: 'SaaS Founders',
    heroHeading: 'Grade your SaaS startup\u2019s positioning in seconds.',
    heroSubheading:
      'Paste your homepage headline and get a scored assessment across clarity, specificity, differentiation, brevity, and value clarity \u2014 built for SaaS founders.',
    placeholders: {
      startupName: 'e.g. Acme SaaS',
      targetAudience: 'e.g. Mid-market revenue teams',
      headline: 'e.g. Close deals 3x faster with AI-powered proposals',
      oneLiner:
        'e.g. We help B2B sales teams generate personalized proposals in seconds, cutting deal cycles from weeks to days.',
    },
    seo: {
      title: 'SaaS Positioning Grader \u2014 Grade Your Startup Headline Free | Mina Mankarious',
      description:
        'Free tool for SaaS founders: paste your homepage headline and get an instant positioning score across clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'SaaS positioning tool',
        'SaaS headline grader',
        'startup positioning grader',
        'SaaS messaging',
        'SaaS homepage headline',
        'B2B SaaS positioning',
      ],
    },
  },
  {
    slug: 'for-devtools',
    displayName: 'DevTool Founders',
    heroHeading: 'Is your devtool\u2019s positioning cutting through?',
    heroSubheading:
      'Developer tools live or die by clarity. Grade your headline across five positioning dimensions and find out if developers actually get what you do.',
    placeholders: {
      startupName: 'e.g. Raycast',
      targetAudience: 'e.g. Full-stack developers',
      headline: 'e.g. Your extendable, blazingly fast launcher',
      oneLiner:
        'e.g. A keyboard-first productivity tool that lets developers control their tools from one place.',
    },
    seo: {
      title: 'DevTool Positioning Grader \u2014 Grade Your Developer Tool Headline | Mina Mankarious',
      description:
        'Free positioning grader for developer tools. Paste your headline and get scored on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'devtool positioning',
        'developer tool headline grader',
        'devtool messaging',
        'developer tool positioning',
        'devtool marketing',
        'developer tool landing page',
      ],
    },
  },
  {
    slug: 'for-ai-startups',
    displayName: 'AI Startups',
    heroHeading: 'Your AI startup sounds like every other AI startup.',
    heroSubheading:
      'Everyone says \u201cAI-powered.\u201d Grade your headline to see if buyers can tell what makes you different \u2014 in 5 seconds flat.',
    placeholders: {
      startupName: 'e.g. NeuralSense',
      targetAudience: 'e.g. Enterprise data teams',
      headline: 'e.g. AI-powered analytics for modern teams',
      oneLiner:
        'e.g. We use LLMs to turn unstructured support tickets into actionable product insights.',
    },
    seo: {
      title: 'AI Startup Positioning Grader \u2014 Stand Out From Every Other AI Company | Mina Mankarious',
      description:
        'Your AI startup headline sounds generic. Paste it here for a free scored assessment across clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'AI startup positioning',
        'AI startup headline grader',
        'AI company positioning',
        'AI startup messaging',
        'AI startup differentiation',
        'AI-powered positioning tool',
      ],
    },
  },
  {
    slug: 'for-fintech',
    displayName: 'Fintech Founders',
    heroHeading: 'Grade your fintech\u2019s positioning before your next round.',
    heroSubheading:
      'Investors and buyers scan your headline in seconds. Score yours across five positioning dimensions and tighten your messaging before it costs you.',
    placeholders: {
      startupName: 'e.g. Plaid',
      targetAudience: 'e.g. Neobanks and fintech apps',
      headline: 'e.g. The easiest way to connect bank accounts',
      oneLiner:
        'e.g. We provide a single API for apps to connect to users\u2019 bank accounts for payments and data.',
    },
    seo: {
      title: 'Fintech Positioning Grader \u2014 Score Your Fintech Headline Free | Mina Mankarious',
      description:
        'Free positioning grader for fintech startups. Paste your headline and get an instant scored assessment on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'fintech positioning',
        'fintech headline grader',
        'fintech startup messaging',
        'fintech marketing',
        'fintech landing page',
        'financial technology positioning',
      ],
    },
  },
  {
    slug: 'for-healthtech',
    displayName: 'Healthtech Founders',
    heroHeading: 'Grade your healthtech\u2019s positioning.',
    heroSubheading:
      'Healthcare buyers are skeptical by default. Score your headline across clarity, specificity, differentiation, brevity, and value clarity to earn their trust faster.',
    placeholders: {
      startupName: 'e.g. MedBridge',
      targetAudience: 'e.g. Hospital administrators',
      headline: 'e.g. Reducing readmissions with predictive patient monitoring',
      oneLiner:
        'e.g. We help hospitals cut readmission rates by 30% with real-time patient risk scoring powered by EMR data.',
    },
    seo: {
      title: 'Healthtech Positioning Grader \u2014 Score Your Healthcare Startup Headline | Mina Mankarious',
      description:
        'Free positioning grader for healthtech startups. Paste your headline and get scored on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'healthtech positioning',
        'healthtech headline grader',
        'healthcare startup messaging',
        'healthtech marketing',
        'health tech startup positioning',
        'digital health positioning',
      ],
    },
  },
  {
    slug: 'for-b2b-marketers',
    displayName: 'B2B Marketers',
    heroHeading: 'Grade your B2B positioning before the next campaign.',
    heroSubheading:
      'Bad positioning kills campaigns before they start. Score your headline across five evidence-based dimensions and fix it before you spend another dollar.',
    placeholders: {
      startupName: 'e.g. Drift',
      targetAudience: 'e.g. B2B marketing teams',
      headline: 'e.g. Revenue acceleration for the modern marketer',
      oneLiner:
        'e.g. We help B2B marketing teams turn website visitors into qualified pipeline with conversational AI.',
    },
    seo: {
      title: 'B2B Positioning Grader \u2014 Score Your Marketing Headline Free | Mina Mankarious',
      description:
        'Free positioning grader for B2B marketers. Paste your headline and get an instant scored assessment on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'B2B positioning tool',
        'B2B headline grader',
        'B2B marketing positioning',
        'B2B messaging',
        'B2B copywriting grader',
        'B2B campaign messaging',
      ],
    },
  },
  {
    slug: 'for-marketplace-startups',
    displayName: 'Marketplace Founders',
    heroHeading: 'Grade your marketplace\u2019s positioning for both sides.',
    heroSubheading:
      'Marketplaces have to convince two audiences at once. Score your headline to see if both sides of your market understand what you do.',
    placeholders: {
      startupName: 'e.g. Faire',
      targetAudience: 'e.g. Independent retailers and wholesale brands',
      headline: 'e.g. The online wholesale marketplace for independent retailers',
      oneLiner:
        'e.g. We connect independent retailers with unique brands, offering free returns, net-60 terms, and low order minimums.',
    },
    seo: {
      title: 'Marketplace Positioning Grader \u2014 Score Your Marketplace Headline | Mina Mankarious',
      description:
        'Free positioning grader for marketplace startups. Paste your headline and get scored on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'marketplace positioning',
        'marketplace headline grader',
        'two-sided marketplace messaging',
        'marketplace startup positioning',
        'marketplace marketing',
        'marketplace landing page',
      ],
    },
  },
  {
    slug: 'for-cybersecurity',
    displayName: 'Cybersecurity Founders',
    heroHeading: '\u201cEnterprise-grade\u201d isn\u2019t a differentiator.',
    heroSubheading:
      'Every cybersecurity company claims enterprise-grade, next-gen, AI-driven protection. Grade your headline to see if buyers can actually tell what you do differently.',
    placeholders: {
      startupName: 'e.g. Wiz',
      targetAudience: 'e.g. Cloud security teams',
      headline: 'e.g. Secure everything you build and run in the cloud',
      oneLiner:
        'e.g. We give security teams full-stack visibility across cloud environments in minutes, not months.',
    },
    seo: {
      title: 'Cybersecurity Positioning Grader \u2014 Grade Your Security Startup Headline | Mina Mankarious',
      description:
        'Free positioning grader for cybersecurity startups. Paste your headline and get an instant scored assessment. Stop hiding behind "enterprise-grade."',
      keywords: [
        'cybersecurity positioning',
        'cybersecurity headline grader',
        'security startup messaging',
        'cybersecurity marketing',
        'infosec positioning',
        'cybersecurity startup differentiation',
      ],
    },
  },
  {
    slug: 'for-ecommerce',
    displayName: 'E-Commerce Founders',
    heroHeading: 'Grade your e-commerce brand\u2019s positioning.',
    heroSubheading:
      'In a market where everyone competes on price, positioning is your edge. Score your headline across five dimensions and find out if your brand stands out.',
    placeholders: {
      startupName: 'e.g. Glossier',
      targetAudience: 'e.g. Millennial skincare enthusiasts',
      headline: 'e.g. Skin first. Makeup second.',
      oneLiner:
        'e.g. Beauty products inspired by real life, developed with and for our community.',
    },
    seo: {
      title: 'E-Commerce Positioning Grader \u2014 Score Your Brand Headline Free | Mina Mankarious',
      description:
        'Free positioning grader for e-commerce brands. Paste your headline and get scored on clarity, specificity, differentiation, brevity, and value clarity.',
      keywords: [
        'ecommerce positioning',
        'e-commerce headline grader',
        'DTC positioning tool',
        'ecommerce brand messaging',
        'ecommerce marketing',
        'online store positioning',
      ],
    },
  },
  {
    slug: 'for-agency-owners',
    displayName: 'Agency Owners',
    heroHeading: 'Stop competing on price.',
    heroSubheading:
      'If your agency sounds like every other agency, you\u2019ll always compete on price. Grade your headline to see where your positioning breaks down \u2014 and how to fix it.',
    placeholders: {
      startupName: 'e.g. Column Five',
      targetAudience: 'e.g. Series B+ SaaS companies',
      headline: 'e.g. The content agency for ambitious B2B brands',
      oneLiner:
        'e.g. We help B2B SaaS companies build content engines that generate pipeline, not just pageviews.',
    },
    seo: {
      title: 'Agency Positioning Grader \u2014 Grade Your Agency Headline Free | Mina Mankarious',
      description:
        'Free positioning grader for agency owners. Paste your headline and get an instant scored assessment. Stop competing on price \u2014 start competing on positioning.',
      keywords: [
        'agency positioning',
        'agency headline grader',
        'marketing agency positioning',
        'agency differentiation',
        'agency messaging',
        'agency branding tool',
      ],
    },
  },
];

// ── Getters ──────────────────────────────────────────────────────────

export function getPersonaBySlug(slug: string): PersonaConfig | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}

export function getAllPersonaSlugs(): string[] {
  return PERSONAS.map((p) => p.slug);
}

export function getAllPersonas(): PersonaConfig[] {
  return PERSONAS;
}
