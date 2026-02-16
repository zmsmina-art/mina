import { el, svgEl } from '../utils/DOMHelpers.js';

const BLOCKS = [
  {
    id: 'ecu', x: 30, y: 40, w: 200, h: 120,
    title: 'CAN Bus ECU Simulator',
    lines: ['Transmits engine', 'temperature data', 'Receives fan status'],
    info: {
      title: 'CAN Bus ECU Simulator',
      body: 'Simulates an Engine Control Unit that sends engine temperature readings over the CAN bus to the fan controller.\n\nConnection: CAN_H / CAN_L differential pair\nProtocol: CAN 2.0A (11-bit identifier)\nTX Message ID: 0x100 (temperature data)\nRX Message ID: 0x200 (fan status ACK)\nData Rate: 2 Hz polling'
    }
  },
  {
    id: 'hcs12', x: 370, y: 20, w: 240, h: 160,
    title: 'HCS12 Microcontroller',
    lines: ['EVALH1 Trainer Board', '', 'Modules: MSCAN, ATD,', 'PWM, Timer, GPIO, IRQ'],
    info: {
      title: 'HCS12 Microcontroller (EVALH1 Board)',
      body: 'The central processing unit running the fan control algorithm.\n\nModules Used:\n• MSCAN: CAN bus communication\n• ATD: 10-bit ADC for temperature sensors\n• PWM: Motor speed control output\n• Timer: PWM signal generation\n• GPIO: LCD, LEDs, buzzer control\n• IRQ: Keypad interrupt handler (vector 6)'
    }
  },
  {
    id: 'roboteurs', x: 30, y: 260, w: 200, h: 140,
    title: 'Roboteurs I/O Board',
    lines: ['DC Motor (fan)', 'Pot 1: Engine Temp', 'Pot 2: Ambient Temp', 'Motor Driver IC'],
    info: {
      title: 'Roboteurs I/O Trainer Board',
      body: 'Provides analog input and motor output interfaces.\n\nComponents:\n• DC Motor: Simulates radiator cooling fan\n• Potentiometer 1: Engine temp sensor (ADC Ch0, 0-120°C)\n• Potentiometer 2: Ambient temp sensor (ADC Ch1, -20 to 50°C)\n• Motor Driver: H-bridge for PWM-controlled variable speed'
    }
  },
  {
    id: 'lcd', x: 400, y: 280, w: 100, h: 70,
    title: 'LCD 16x2',
    lines: ['GPIO (4-bit)'],
    info: {
      title: '16x2 LCD Display',
      body: 'Character LCD on the EVALH1 board.\n\nInterface: 4-bit parallel via Port H\nLine 1: ENG:XXX AMB:XXX\nLine 2: FAN:XXX% MODE:AAA\n\nDisplays real-time temperature readings, fan speed percentage, and current operating mode.'
    }
  },
  {
    id: 'keypad', x: 530, y: 280, w: 100, h: 70,
    title: 'Keypad 4x4',
    lines: ['GPIO + IRQ'],
    info: {
      title: '4x4 Matrix Keypad',
      body: 'User input for mode selection and manual fan speed control.\n\nInterface: Port S (rows scan, columns read)\nInterrupt: Vector 6 (keypress detection)\n\nKey Functions:\n• Key 1: AUTO mode\n• Key 2: MANUAL mode\n• Keys 4-8: Fan speed (0%-100%)\n• Key #: System reset'
    }
  },
];

const CONNECTIONS = [
  { from: 'ecu', to: 'hcs12', label: 'CAN Bus', color: '#b089ff', bidir: true },
  { from: 'roboteurs', to: 'hcs12', label: 'PWM / ADC', color: '#ffffff', bidir: true },
  { from: 'hcs12', to: 'lcd', label: 'GPIO', color: '#ddd3ff', bidir: false },
  { from: 'hcs12', to: 'keypad', label: 'IRQ + GPIO', color: '#7a40f2', bidir: false },
];

export class ArchitectureTab {
  constructor() {
    this.infoPanel = null;
    this.infoPanelTitle = null;
    this.infoPanelBody = null;
    this.el = this._create();
  }

  _create() {
    const wrapper = el('div', { className: 'architecture' });

    const intro = el('div', {
      className: 'signals__annotation',
      textContent: 'Click or press Enter on any component block to view detailed information about its role, connections, and configuration in the system.',
    });
    wrapper.appendChild(intro);

    const diagContainer = el('div', { className: 'architecture__diagram' });

    const svg = svgEl('svg', { viewBox: '0 0 680 420', class: 'arch-diagram' });
    svg.style.width = '100%';
    svg.style.height = 'auto';

    for (const conn of CONNECTIONS) {
      this._drawConnection(svg, conn);
    }

    for (const block of BLOCKS) {
      this._drawBlock(svg, block);
    }

    diagContainer.appendChild(svg);

    this.infoPanel = el('div', {
      className: 'arch-info-panel',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-live': 'polite',
    });

    const closeBtn = el('button', {
      className: 'arch-info-panel__close',
      type: 'button',
      textContent: '×',
      'aria-label': 'Close details',
    });
    closeBtn.addEventListener('click', () => {
      this.infoPanel.classList.remove('arch-info-panel--visible');
    });

    this.infoPanelTitle = el('div', { className: 'arch-info-panel__title' });
    this.infoPanelBody = el('div', { className: 'arch-info-panel__body' });

    this.infoPanel.appendChild(closeBtn);
    this.infoPanel.appendChild(this.infoPanelTitle);
    this.infoPanel.appendChild(this.infoPanelBody);
    diagContainer.appendChild(this.infoPanel);

    wrapper.appendChild(diagContainer);

    const legend = el('div', { className: 'arch-legend' });
    for (const conn of CONNECTIONS) {
      const item = el('div', { className: 'arch-legend__item' });
      const dot = el('span', { className: 'arch-legend__dot' });
      dot.style.background = conn.color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(conn.label));
      legend.appendChild(item);
    }
    wrapper.appendChild(legend);

    return wrapper;
  }

  _getBlockCenter(block) {
    return { x: block.x + block.w / 2, y: block.y + block.h / 2 };
  }

  _findBlock(id) {
    return BLOCKS.find((b) => b.id === id);
  }

  _drawConnection(svg, conn) {
    const fromBlock = this._findBlock(conn.from);
    const toBlock = this._findBlock(conn.to);
    const fc = this._getBlockCenter(fromBlock);
    const tc = this._getBlockCenter(toBlock);

    const { x: x1, y: y1 } = this._edgePoint(fromBlock, tc);
    const { x: x2, y: y2 } = this._edgePoint(toBlock, fc);

    const pathId = `path-${conn.from}-${conn.to}`;
    const path = svgEl('path', {
      id: pathId,
      d: `M ${x1},${y1} L ${x2},${y2}`,
      class: 'arch-connection',
      stroke: conn.color,
      'stroke-opacity': '0.4',
    });
    svg.appendChild(path);

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const label = svgEl('text', {
      x: String(mx),
      y: String(my - 8),
      class: 'arch-connection-label',
      'text-anchor': 'middle',
      fill: conn.color,
    });
    label.textContent = conn.label;
    svg.appendChild(label);

    this._addFlowDot(svg, pathId, conn.color, 0);
    this._addFlowDot(svg, pathId, conn.color, 0.5);
    if (conn.bidir) {
      const revPathId = `path-${conn.to}-${conn.from}`;
      const revPath = svgEl('path', {
        id: revPathId,
        d: `M ${x2},${y2} L ${x1},${y1}`,
        stroke: 'none',
        fill: 'none',
      });
      svg.appendChild(revPath);
      this._addFlowDot(svg, revPathId, conn.color, 0.25);
    }
  }

  _edgePoint(block, target) {
    const cx = block.x + block.w / 2;
    const cy = block.y + block.h / 2;
    const dx = target.x - cx;
    const dy = target.y - cy;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx / block.w > absDy / block.h) {
      const signX = dx > 0 ? 1 : -1;
      return { x: cx + signX * block.w / 2, y: cy + dy * (block.w / 2) / absDx };
    }

    const signY = dy > 0 ? 1 : -1;
    return { x: cx + dx * (block.h / 2) / absDy, y: cy + signY * block.h / 2 };
  }

  _addFlowDot(svg, pathId, color, delayRatio) {
    const pathEl = svg.querySelector(`#${pathId}`);
    if (!pathEl) return;

    const dot = svgEl('circle', {
      r: '3',
      fill: color,
      opacity: '0.8',
    });

    const anim = svgEl('animateMotion', {
      dur: '3s',
      repeatCount: 'indefinite',
      begin: `${-delayRatio * 3}s`,
    });
    const mpath = svgEl('mpath', {});
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    mpath.setAttribute('href', `#${pathId}`);
    anim.appendChild(mpath);
    dot.appendChild(anim);
    svg.appendChild(dot);
  }

  _drawBlock(svg, block) {
    const g = svgEl('g', { class: 'arch-block', 'data-block-id': block.id });
    g.style.cursor = 'pointer';
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', `${block.title} component details`);

    const rect = svgEl('rect', {
      x: String(block.x),
      y: String(block.y),
      width: String(block.w),
      height: String(block.h),
      rx: '6',
      fill: 'rgba(8, 8, 8, 0.92)',
      stroke: 'var(--bp-border)',
      'stroke-width': '1.5',
    });
    g.appendChild(rect);

    const titleText = svgEl('text', {
      x: String(block.x + block.w / 2),
      y: String(block.y + 22),
      'text-anchor': 'middle',
      class: 'arch-block__title',
    });
    titleText.textContent = block.title;
    g.appendChild(titleText);

    block.lines.forEach((line, i) => {
      if (!line) return;
      const t = svgEl('text', {
        x: String(block.x + block.w / 2),
        y: String(block.y + 42 + i * 18),
        'text-anchor': 'middle',
      });
      t.textContent = line;
      t.setAttribute('fill', 'var(--bp-text-secondary)');
      t.setAttribute('font-family', "'Fira Code', monospace");
      t.setAttribute('font-size', '10');
      g.appendChild(t);
    });

    const showPanel = () => {
      this.infoPanelTitle.textContent = block.info.title;
      this.infoPanelBody.textContent = block.info.body;
      this.infoPanel.classList.add('arch-info-panel--visible');
    };

    g.addEventListener('click', showPanel);
    g.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPanel();
      }
    });

    svg.appendChild(g);
  }
}
