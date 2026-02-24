import type { ReactNode } from 'react';
import CardGlow from '@/components/ui/card-glow';

interface CaseStudyCardProps {
  variant: 'hero' | 'supporting';
  children: ReactNode;
  className?: string;
}

export default function CaseStudyCard({ variant, children, className = '' }: CaseStudyCardProps) {
  const cardClass = variant === 'hero' ? 'feature-card' : 'case-card';
  return (
    <article className={`${cardClass} relative overflow-hidden ${className}`}>
      <CardGlow spread={16} proximity={48} />
      <div className="relative z-[1]">{children}</div>
    </article>
  );
}
