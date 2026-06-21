import { motionDelay } from '@/lib/utils';

interface SectionHeadingProps {
  index: string;
  label: string;
}

/** Editorial numbered section eyebrow: `01 — Experience` with a hairline rule. */
export default function SectionHeading({ index, label }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-motion="sweep-left">
      <span className="section-heading-index">{index}</span>
      <span className="section-heading-label">{label}</span>
      <span className="section-heading-rule" aria-hidden="true" style={motionDelay(80)} />
    </div>
  );
}
