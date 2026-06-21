'use client';

/**
 * MmSignature — the animated cursive "mm" monogram.
 * Layered cursive glyphs: faint overlapping echo outlines for depth, a base
 * mark that writes itself on (left-to-right reveal), and a slow light glint
 * that sweeps across the ink. Decorative only — the page heading carries the
 * accessible name.
 */
export default function MmSignature() {
  return (
    <div className="mm-sig" aria-hidden="true">
      <span className="mm-glyph mm-echo mm-echo--a">mm.</span>
      <span className="mm-glyph mm-echo mm-echo--b">mm.</span>
      <span className="mm-glyph mm-ink">mm.</span>
    </div>
  );
}
