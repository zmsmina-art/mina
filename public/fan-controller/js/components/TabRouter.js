import { el } from '../utils/DOMHelpers.js';

export class TabRouter {
  constructor(tabs) {
    this.tabs = tabs;
    this.activeTab = null;
    this.tabBar = null;
    this.contentContainer = null;
  }

  mount(container) {
    this.tabBar = el('div', {
      className: 'tab-bar',
      role: 'tablist',
      'aria-label': 'Simulator sections',
    });
    this.contentContainer = el('div');

    for (const tab of this.tabs) {
      const tabId = `tab-btn-${tab.id}`;
      const panelId = `tab-${tab.id}`;

      const btn = el('button', {
        className: 'tab-bar__btn',
        textContent: tab.label,
        type: 'button',
        id: tabId,
        role: 'tab',
        'aria-controls': panelId,
        'aria-selected': 'false',
        tabindex: '-1',
      });

      btn.addEventListener('click', () => this._activate(tab.id));
      tab.btn = btn;
      this.tabBar.appendChild(btn);

      const content = el('div', {
        className: 'tab-content',
        id: panelId,
        role: 'tabpanel',
        'aria-labelledby': tabId,
        tabindex: '0',
      });

      if (tab.component && tab.component.el) {
        content.appendChild(tab.component.el);
      }

      tab.contentEl = content;
      this.contentContainer.appendChild(content);
    }

    this.tabBar.addEventListener('keydown', (event) => this._handleKeydown(event));

    container.appendChild(this.tabBar);
    container.appendChild(this.contentContainer);

    if (this.tabs.length > 0) {
      this._activate(this.tabs[0].id);
    }
  }

  _handleKeydown(event) {
    const currentIndex = this.tabs.findIndex((tab) => tab.id === this.activeTab);
    if (currentIndex === -1) return;

    let nextIndex = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % this.tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = this.tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = this.tabs[nextIndex];
      this._activate(nextTab.id);
      nextTab.btn.focus();
    }
  }

  _activate(tabId) {
    for (const tab of this.tabs) {
      const isActive = tab.id === tabId;
      tab.btn.classList.toggle('tab-bar__btn--active', isActive);
      tab.btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.btn.tabIndex = isActive ? 0 : -1;
      tab.contentEl.classList.toggle('tab-content--active', isActive);
      tab.contentEl.hidden = !isActive;
    }
    this.activeTab = tabId;
  }
}
