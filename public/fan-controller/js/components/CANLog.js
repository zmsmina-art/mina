import { el } from '../utils/DOMHelpers.js';

export class CANLog {
  constructor(state) {
    this.state = state;
    this.lastCount = 0;
    this.el = this._create();
    this._bind();
  }

  _create() {
    const wrapper = el('div', { className: 'panel panel--corner-marks' });
    wrapper.style.maxHeight = '280px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const title = el('div', { className: 'panel__title' }, ['CAN Bus Messages']);
    const info = el('span', {
      className: 'info-icon',
      textContent: 'i',
      'data-tooltip': 'CAN (Controller Area Network) is the standard automotive bus protocol.\nID: 11-bit message identifier. DLC: Data Length Code (0-8 bytes).\nTX (0x100): ECU sends temperature data to controller.\nRX (0x200): Controller responds with fan status and mode.',
      tabindex: '0',
      role: 'button',
      'aria-label': 'CAN bus info'
    });
    title.appendChild(info);
    wrapper.appendChild(title);

    // Header
    const header = el('div', {
      className: 'can-header',
    });
    header.style.cssText = 'display:grid;grid-template-columns:70px 28px 42px 28px 1fr 1fr;gap:4px;font-size:10px;color:var(--bp-text-secondary);padding:4px 0;border-bottom:1px solid var(--bp-border);margin-bottom:4px;flex-shrink:0;';
    header.innerHTML = '<span>TIME</span><span>DIR</span><span>ID</span><span>DLC</span><span>DATA</span><span>INFO</span>';
    wrapper.appendChild(header);

    this.scrollContainer = el('div');
    this.scrollContainer.style.cssText = 'overflow-y:auto;flex:1;';
    wrapper.appendChild(this.scrollContainer);

    return wrapper;
  }

  _bind() {
    this.state.subscribe('canMessages', (messages) => this._update(messages));
  }

  _update(messages) {
    if (messages.length <= this.lastCount) {
      this.scrollContainer.innerHTML = '';
      this.lastCount = 0;
    }

    const newMessages = messages.slice(this.lastCount);
    this.lastCount = messages.length;

    for (const msg of newMessages) {
      const row = el('div');
      const dirColor = msg.direction === 'TX' ? 'var(--bp-green)' : 'var(--bp-purple-light)';
      row.style.cssText = `display:grid;grid-template-columns:70px 28px 42px 28px 1fr 1fr;gap:4px;font-size:10px;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.1);`;

      const dataStr = msg.data.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

      row.innerHTML = `
        <span style="color:var(--bp-text-secondary)">${msg.timestamp}</span>
        <span style="color:${dirColor};font-weight:600">${msg.direction}</span>
        <span style="color:var(--bp-text-accent)">${msg.id}</span>
        <span>${msg.dlc}</span>
        <span style="color:var(--bp-text-secondary);font-size:9px">${dataStr}</span>
        <span style="color:var(--bp-text-secondary);font-size:9px">${msg.description}</span>
      `;

      this.scrollContainer.appendChild(row);
    }

    // Trim DOM if over 100 rows
    while (this.scrollContainer.children.length > 100) {
      this.scrollContainer.removeChild(this.scrollContainer.firstChild);
    }

    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }
}
