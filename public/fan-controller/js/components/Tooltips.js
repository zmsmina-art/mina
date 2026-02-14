import { el } from '../utils/DOMHelpers.js';

export class Tooltips {
  constructor() {
    this.tooltip = el('div', { className: 'tooltip', role: 'tooltip', id: 'fc-tooltip' });
    document.body.appendChild(this.tooltip);
    this._bindGlobal();
  }

  _bindGlobal() {
    document.addEventListener('mouseenter', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (!target) return;
      this._show(target);
    }, true);

    document.addEventListener('mouseleave', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (!target) return;
      this._hide();
    }, true);

    document.addEventListener('focusin', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (!target) return;
      this._show(target);
    });

    document.addEventListener('focusout', () => {
      this._hide();
    });
  }

  _show(target) {
    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    this.tooltip.textContent = text;
    this.tooltip.classList.add('tooltip--visible');
    target.setAttribute('aria-describedby', 'fc-tooltip');

    const rect = target.getBoundingClientRect();
    const tipRect = this.tooltip.getBoundingClientRect();

    let top = rect.bottom + 8;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;

    if (left < 8) left = 8;
    if (left + tipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tipRect.width - 8;
    }
    if (top + tipRect.height > window.innerHeight - 8) {
      top = rect.top - tipRect.height - 8;
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  _hide() {
    this.tooltip.classList.remove('tooltip--visible');
  }
}
