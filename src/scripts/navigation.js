function closeMenu(toggle, menu) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation menu');
  toggle.querySelector('span').textContent = '☰';
  menu.hidden = true;
}

export function initializeNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    toggle.querySelector('span').textContent = isOpen ? '☰' : '×';
    menu.hidden = isOpen;
  });

  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu(toggle, menu);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu(toggle, menu);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const control = event.target.closest('[data-scroll-to]');
    if (!control) return;
    const section = document.getElementById(control.dataset.scrollTo);
    if (!section) {
      console.error(`Navigation target "${control.dataset.scrollTo}" was not found.`);
      return;
    }
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    if (!menu.hidden) closeMenu(toggle, menu);
  });
}

export function initializeScrollProgress() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const progress = hero.querySelector('.hero__progress i');
  const progressBar = hero.querySelector('.hero__progress');
  let frame = 0;

  const update = () => {
    frame = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const amount = Math.min(1, Math.max(0, window.scrollY / max));
    const percent = Math.round(amount * 100);
    progress.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', String(percent));
  };

  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}
