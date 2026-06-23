/**
 * A section seam that reads as a "rung" on the page spine: a content-width
 * hairline that draws across when scrolled into view, with a calligraphic
 * flourish riding its centre. Its left end lines up with the spine's node tick,
 * so it belongs to the same linework. Decorative; reveal driven by `data-motion`.
 */
export default function ScriptDivider() {
  return (
    <div className="script-divider page-gutter" data-motion="fade" aria-hidden="true">
      <div className="script-divider-inner">
        <span className="script-divider-rule" />
        <svg
          className="script-divider-svg"
          viewBox="0 0 260 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            className="script-divider-path"
            d="M6 22 C 44 4, 78 38, 112 21 C 132 11, 130 30, 150 21 C 188 4, 222 36, 254 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle className="script-divider-dot" cx="6" cy="22" r="1.8" fill="currentColor" />
          <circle className="script-divider-dot" cx="254" cy="18" r="1.8" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
