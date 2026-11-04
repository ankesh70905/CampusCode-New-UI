const storageKey = 'campuscode-theme';

function setTheme(theme, persist = true) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = resolvedTheme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolvedTheme === 'dark' ? '#0a171e' : '#f3f6f7');

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    toggle.setAttribute('aria-pressed', String(resolvedTheme === 'dark'));
    const label = toggle.querySelector('.theme-toggle__label');
    if (label) label.textContent = nextTheme === 'dark' ? 'Dark' : 'Light';
  });

  if (!persist) return;
  try {
    localStorage.setItem(storageKey, resolvedTheme);
  } catch (error) {
    console.error('Unable to save the CampusCode theme preference.', error);
  }
}

export function initializeTheme() {
  const initialTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  setTheme(initialTheme, false);

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}
