export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Os dois modais oferecem "conversar sobre o projeto": fecham e levam o foco
// para o primeiro campo do formulário de contato.
export function scrollToContactForm() {
  const section = document.querySelector('#contato');
  if (!section) return;
  section.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
  section.querySelector('input')?.focus({ preventScroll: true });
}
