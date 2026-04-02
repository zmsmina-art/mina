'use client';

/**
 * Lightweight CSS-only smoke background for mobile devices.
 * Approximates the desktop WebGL SmokeBackground using animated radial gradients.
 * Only rendered on screens < md (768px) via Tailwind.
 */
export default function MobileSmokeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 md:hidden"
      style={{ opacity: 0.5 }}
    >
      <div className="mobile-smoke-layer mobile-smoke-a" />
      <div className="mobile-smoke-layer mobile-smoke-b" />
      <div className="mobile-smoke-layer mobile-smoke-c" />
    </div>
  );
}
