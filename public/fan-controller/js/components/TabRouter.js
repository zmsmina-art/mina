import { el } from '../utils/DOMHelpers.js';

export class TabRouter {
  constructor(tabs) {
    this.tabs = tabs;
    this.activeTab = null;
    this.tabBar = null;
    this.contentContainer = null;
  }

  mount(container) {
    this.tabBar = el('div', { className: 'tab-bar' });
    this.contentContainer = el('div');

    for (const tab of this.tabs) {
      const btn = el('button', {
        className: 'tab-bar__btn',
        textContent: tab.label,
      });
      btn.addEventListener('click', () => this._activate(tab.id));
      tab.btn = btn;
      this.tabBar.appendChild(btn);

      const content = el('div', { className: 'tab-content', id: `tab-${tab.id}` });
      if (tab.component && tab.component.el) {
        content.appendChild(tab.component.el);
      }
      tab.contentEl = content;
      this.contentContainer.appendChild(content);
    }

    container.appendChild(this.tabBar);
    container.appendChild(this.contentContainer);

    if (this.tabs.length > 0) {
      this._activate(this.tabs[0].id);
    }
  }

  _activate(tabId) {
    for (const tab of this.tabs) {
      const isActive = tab.id === tabId;
      tab.btn.classList.toggle('tab-bar__btn--active', isActive);
      tab.contentEl.classList.toggle('tab-content--active', isActive);
    }
    this.activeTab = tabId;
  }
}
