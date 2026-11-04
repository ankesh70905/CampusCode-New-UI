export function initializeExperience() {
  const playButton = document.querySelector('.experience-play');
  const frame = document.querySelector('.experience-frame');
  if (!playButton || !frame) return;

  const setPlaying = (playing) => {
    frame.classList.toggle('is-playing', playing);
    playButton.setAttribute('aria-pressed', String(playing));
    playButton.setAttribute(
      'aria-label',
      `${playing ? 'Pause' : 'Play'} motion preview`,
    );
    playButton.querySelector('.experience-play__icon').textContent = playing ? 'Ⅱ' : '▶';
    playButton.querySelector('.experience-play__label').textContent = playing
      ? 'PAUSE PREVIEW'
      : 'PLAY PREVIEW';
  };

  playButton.addEventListener('click', () => {
    setPlaying(playButton.getAttribute('aria-pressed') !== 'true');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0.15 },
    );
    observer.observe(frame);
  }
}
