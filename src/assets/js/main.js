import { initMobileMenu } from './components/mobileMenu.js';
import { initTabs } from './components/tabs.js';

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (!animatedElements.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.animateDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTabs();
  initScrollAnimations();
  const moduleHeaders = document.querySelectorAll(".module-header");
  moduleHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("open");
    });
  });
});
