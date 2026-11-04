const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function createCode() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export function captchaMarkup() {
  return `
    <div class="form-field captcha-field">
      <div class="form-field__label-row">
        <label class="form-label" for="captcha-answer">CAPTCHA</label>
        <span class="form-hint">LOCAL DEMO ONLY</span>
      </div>
      <div class="captcha-challenge">
        <output class="captcha-code" aria-label="CAPTCHA code"></output>
        <button class="captcha-refresh" type="button" aria-label="Generate a new CAPTCHA">↻ NEW</button>
      </div>
      <input id="captcha-answer" name="captcha" type="text" placeholder="Enter the code above" autocomplete="off" required>
    </div>
  `;
}

export function refreshCaptcha(container) {
  const output = container.querySelector('.captcha-code');
  const form = container.closest('form');
  const input = form?.querySelector('[name="captcha"]');
  if (!output) return;

  const code = createCode();
  const escapedCode = escapeXml(code);
  output.innerHTML = `
    <svg viewBox="0 0 220 54" role="img" aria-label="CAPTCHA challenge">
      <rect x="1" y="1" width="218" height="52" rx="8" fill="var(--color-surface-soft)" stroke="var(--color-border)"/>
      <path d="M12 43 204 10M8 16l194 26M30 50 181 4" stroke="var(--color-primary)" stroke-opacity=".42" stroke-width="2"/>
      <text x="110" y="37" text-anchor="middle" fill="var(--color-text)" font-family="Inter, sans-serif" font-size="29" font-weight="600" letter-spacing="7">${escapedCode}</text>
    </svg>
  `;
  if (input) {
    input.dataset.expected = code;
    input.value = '';
  }
}
