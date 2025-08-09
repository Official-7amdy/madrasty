export function initTabs() {
  const containers = document.querySelectorAll('[data-tabs]');
  containers.forEach((container) => {
    const tabs = Array.from(container.querySelectorAll('.tabs__tab'));
    const panels = Array.from(container.querySelectorAll('.tabs__panel'));
    if (tabs.length === 0 || panels.length === 0) return;

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t, i) => t.setAttribute('aria-selected', i === index ? 'true' : 'false'));
        panels.forEach((p, i) => (i === index ? p.removeAttribute('hidden') : p.setAttribute('hidden', '')));
      });
    });
  });
}

