const revealSelectors = [
  '.about__copy',
  '.orbit-art',
  '.experience__heading',
  '.section-heading',
  '.step-card',
  '.arena-row',
  '.mission h2',
  '.community__top',
  '.cta h2',
  '.site-footer__main',
  '.auth-card-wrap',
];

export function initializeMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(revealSelectors.join(','));
  if (!targets.length || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('motion-ready', 'app-ready');
  const sequenceCounters = new Map();
  targets.forEach((element) => {
    element.dataset.reveal = '';
    const sequence = element.matches('.step-card, .arena-row');
    if (sequence) {
      const key = element.matches('.step-card') ? 'steps' : 'arena';
      const index = sequenceCounters.get(key) || 0;
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
      sequenceCounters.set(key, index + 1);
    }
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
  );

  targets.forEach((element) => observer.observe(element));
}
