export function initMobileMenu() {
  const toggleButton = document.getElementById('mobile-menu-button');
  const menuContainer = document.getElementById('mobile-nav');

  if (!toggleButton || !menuContainer) {
    return;
  }

  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menuContainer.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('click', (e) => {
    if (menuContainer.classList.contains('is-open') && !menuContainer.contains(e.target)) {
      menuContainer.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}
