let pending = 0;

// Inclinação máxima do card sob o cursor. Bem pequena de propósito: a ideia é
// dar peso físico ao card, não fazê-lo girar.
const MAX_TILT = 2.6;

/**
 * Guarda, no próprio card, onde o cursor está:
 *   `--spot-x` / `--spot-y` → posição em px, usada pelo brilho e pela borda;
 *   `--card-rx` / `--card-ry` → rotação em graus do hover 3D.
 *
 * Escreve direto no DOM porque seria um render do React por pixel de mouse. O
 * trabalho é adiado para o próximo quadro: pointermove dispara bem mais que 60
 * vezes por segundo e ler a posição do card força recálculo de layout.
 */
export function trackSpotlight(event) {
  const card = event.currentTarget;
  const { clientX, clientY } = event;
  if (pending) cancelAnimationFrame(pending);
  pending = requestAnimationFrame(() => {
    pending = 0;
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    card.style.setProperty('--spot-x', `${x}px`);
    card.style.setProperty('--spot-y', `${y}px`);
    card.style.setProperty('--card-ry', `${((x / rect.width) * 2 - 1) * MAX_TILT}deg`);
    card.style.setProperty('--card-rx', `${((y / rect.height) * 2 - 1) * -MAX_TILT}deg`);
  });
}

/** Devolve o card à posição reta quando o cursor sai. */
export function resetSpotlight(event) {
  const card = event.currentTarget;
  if (pending) {
    cancelAnimationFrame(pending);
    pending = 0;
  }
  card.style.removeProperty('--card-rx');
  card.style.removeProperty('--card-ry');
}
