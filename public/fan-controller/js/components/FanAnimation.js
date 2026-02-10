import { el, svgEl } from '../utils/DOMHelpers.js';

export class FanAnimation {
  constructor(state) {
    this.state = state;
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    const title = el('div', { className: 'panel__title' }, ['Cooling Fan']);
    wrapper.appendChild(title);

    const container = el('div', { className: 'fan-container' });
    const svg = this._createFanSVG();
    container.appendChild(svg);
    wrapper.appendChild(container);

    this.speedLabel = el('div', { className: 'fan-speed-label' });
    wrapper.appendChild(this.speedLabel);

    return wrapper;
  }

  _createFanSVG() {
    const svg = svgEl('svg', { viewBox: '0 0 200 200', width: '180', height: '180' });

    const housing = svgEl('circle', {
      cx: '100', cy: '100', r: '95',
      fill: 'none', stroke: 'var(--bp-border)', 'stroke-width': '1.5'
    });
    svg.appendChild(housing);

    const g = svgEl('g', { class: 'fan-blades' });
    this.bladesGroup = g;

    const hub = svgEl('circle', {
      cx: '100', cy: '100', r: '12',
      fill: 'none', stroke: 'var(--bp-purple-light)', 'stroke-width': '2'
    });
    g.appendChild(hub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * 72) * Math.PI / 180;
      const cx = 100, cy = 100;

      const tipX = cx + 75 * Math.cos(angle);
      const tipY = cy + 75 * Math.sin(angle);
      const startX = cx + 15 * Math.cos(angle);
      const startY = cy + 15 * Math.sin(angle);

      const cpL = angle - 0.4;
      const cpR = angle + 0.4;
      const cpLx = cx + 55 * Math.cos(cpL);
      const cpLy = cy + 55 * Math.sin(cpL);
      const cpRx = cx + 55 * Math.cos(cpR);
      const cpRy = cy + 55 * Math.sin(cpR);

      const d = `M ${startX},${startY} Q ${cpLx},${cpLy} ${tipX},${tipY} Q ${cpRx},${cpRy} ${startX},${startY}`;

      const blade = svgEl('path', {
        d,
        fill: 'none',
        stroke: 'var(--bp-purple-light)',
        'stroke-width': '1.5'
      });
      g.appendChild(blade);
    }

    svg.appendChild(g);
    return svg;
  }

  _bind() {
    this.state.subscribe('fanDutyPercent', (duty) => this._updateSpeed(duty));
  }

  _updateSpeed(duty) {
    if (duty === 0) {
      this.bladesGroup.style.animationPlayState = 'paused';
    } else {
      this.bladesGroup.style.animationPlayState = 'running';
      const duration = 2.5 - (duty / 100) * 2.25;
      this.bladesGroup.style.animationDuration = `${duration}s`;
    }
    this.speedLabel.innerHTML = `Speed: <span>${duty}%</span>`;
  }
}
