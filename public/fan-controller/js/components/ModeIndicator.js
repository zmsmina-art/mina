import { el } from '../utils/DOMHelpers.js';

const MODE_CONFIG = {
  AUTO: {
    css: 'badge--auto',
    label: 'AUTO',
    desc: 'Temperature-based automatic control',
  },
  MANUAL: {
    css: 'badge--manual',
    label: 'MANUAL',
    desc: 'User keypad control',
  },
  SAFETY: {
    css: 'badge--safety',
    label: 'SAFETY',
    desc: 'Overheat protection \u2014 fan locked at 100%',
  },
};

export class ModeIndicator {
  constructor(state) {
    this.state = state;
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel' });

    const row = el('div');
    row.style.cssText = 'display:flex;align-items:center;gap:12px;';

    const label = el('span', {
      className: 'panel__title',
      textContent: 'Operating Mode',
    });
    label.style.marginBottom = '0';
    row.appendChild(label);

    this.badge = el('span', { className: 'badge' });
    this.badge.setAttribute('tabindex', '0');
    this.badge.setAttribute('role', 'button');
    this.badge.setAttribute('aria-label', 'Operating mode info');
    this.badge.setAttribute('data-tooltip', 'The system has 3 modes:\n\u2022 AUTO: Fan speed set by temperature thresholds\n\u2022 MANUAL: User selects speed via keypad\n\u2022 SAFETY: Activates at \u226590\u00B0C, forces 100% fan, exits at <85\u00B0C (hysteresis)');
    row.appendChild(this.badge);

    wrapper.appendChild(row);

    this.descEl = el('div');
    this.descEl.style.cssText = 'font-size:11px;color:var(--bp-text-secondary);margin-top:6px;';
    wrapper.appendChild(this.descEl);

    return wrapper;
  }

  _bind() {
    this.state.subscribe('mode', (mode) => this._update(mode));
  }

  _update(mode) {
    const cfg = MODE_CONFIG[mode] || MODE_CONFIG.AUTO;
    this.badge.className = `badge ${cfg.css}`;
    this.badge.textContent = cfg.label;
    this.descEl.textContent = cfg.desc;
  }
}
