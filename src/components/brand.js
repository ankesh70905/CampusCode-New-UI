export function brandMarkup({ link = true } = {}) {
  const contents = `
    <span class="brand__slashes" aria-hidden="true">
      <i></i><i></i><i></i>
    </span>
    <span class="brand__copy">
      <strong>CAMPUSCODE</strong>
      <small>HACKATHON ARENA</small>
    </span>
  `;

  return link
    ? `<a class="brand" href="${import.meta.env.BASE_URL}" aria-label="CampusCode home">${contents}</a>`
    : `<div class="brand" aria-label="CampusCode">${contents}</div>`;
}
