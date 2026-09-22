import { useCallback, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Abre um <dialog> nativo animando-o a partir do card que o originou (FLIP) e o
 * devolve ao mesmo lugar ao fechar. É a mesma técnica usada nos dois modais do
 * protótipo original, agora num só lugar.
 *
 * @param {object}   options
 * @param {?object}  options.active     `{ item, card, trigger }` ou null quando fechado.
 * @param {Function} options.onClose    Chamado no fim da animação de saída (limpa o `active`).
 * @param {string}   options.htmlClass  Classe aplicada no <html> para travar o scroll.
 * @param {number}   [options.openDuration]
 */
export function useFlipDialog({ active, onClose, htmlClass, openDuration = 360 }) {
  const dialogRef = useRef(null);
  const animationRef = useRef(null);
  const closingRef = useRef(false);
  const card = active?.card ?? null;
  const trigger = active?.trigger ?? null;

  const originTransform = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !card) return 'none';
    const from = card.getBoundingClientRect();
    const to = dialog.getBoundingClientRect();
    if (!to.width || !to.height) return 'none';
    return (
      `translate(${from.left + from.width / 2 - to.left - to.width / 2}px,` +
      `${from.top + from.height / 2 - to.top - to.height / 2}px) ` +
      `scale(${from.width / to.width},${from.height / to.height})`
    );
  }, [card]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog || dialog.open) return;
    closingRef.current = false;
    document.documentElement.classList.add(htmlClass);
    dialog.showModal();
    dialog.scrollTop = 0;
    if (!prefersReducedMotion() && typeof dialog.animate === 'function') {
      animationRef.current = dialog.animate(
        [
          { transform: originTransform(), opacity: 0 },
          { transform: 'none', opacity: 1 }
        ],
        { duration: openDuration, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
  }, [active, htmlClass, openDuration, originTransform]);

  // Segurança: se o componente sair do ar com o modal aberto, o scroll volta.
  useEffect(() => () => document.documentElement.classList.remove(htmlClass), [htmlClass]);

  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    animationRef.current?.cancel();
    animationRef.current = null;
    if (dialog?.open) dialog.close();
    document.documentElement.classList.remove(htmlClass);
    // aria-expanded é renderizado pelo card; aqui só devolvemos o foco.
    trigger?.focus({ preventScroll: true });
    closingRef.current = false;
    onClose();
  }, [htmlClass, onClose, trigger]);

  const requestClose = useCallback(
    (immediate = false) => {
      const dialog = dialogRef.current;
      if (!dialog?.open || closingRef.current) return;
      closingRef.current = true;
      animationRef.current?.cancel();
      if (immediate || prefersReducedMotion() || typeof dialog.animate !== 'function') {
        finishClose();
        return;
      }
      const animation = dialog.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: originTransform(), opacity: 0 }
        ],
        { duration: 220, easing: 'cubic-bezier(.4,0,1,1)' }
      );
      animationRef.current = animation;
      animation.finished.then(finishClose).catch(() => {});
    },
    [finishClose, originTransform]
  );

  // Esc e clique no backdrop fecham com a mesma animação do botão.
  const handleCancel = useCallback(
    (event) => {
      event.preventDefault();
      requestClose(false);
    },
    [requestClose]
  );

  const handleBackdropClick = useCallback(
    (event) => {
      const dialog = dialogRef.current;
      if (!dialog || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) requestClose(false);
    },
    [requestClose]
  );

  return {
    dialogProps: { ref: dialogRef, onCancel: handleCancel, onClick: handleBackdropClick },
    requestClose
  };
}
