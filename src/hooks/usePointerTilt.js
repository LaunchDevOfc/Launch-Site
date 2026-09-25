import { useEffect, useRef } from 'react';

const SETTLED = 0.002;

/**
 * Faz a peça reagir ao cursor. A cada frame chama `render({ x, y, active })`,
 * já suavizado: x/y de -1 a 1 (posição do cursor no palco) e active de 0 a 1
 * (o cursor está por perto). Quem usa escreve transform/opacity direto nos
 * elementos — nada de variáveis CSS herdadas, que obrigariam o navegador a
 * recalcular o estilo da árvore inteira a cada movimento do mouse.
 *
 * O palco é a área que responde ao mouse — ele é maior que a logo de propósito,
 * para a reação começar antes de o cursor encostar nela. Só age em ponteiro fino
 * e fora do modo de movimento reduzido, e o loop para sozinho quando assenta.
 * No desmonte, `render(null)` pede para limpar os estilos aplicados.
 */
export function usePointerTilt({ render, ease = 0.11 }) {
  const stageRef = useRef(null);
  const renderRef = useRef(render);
  renderRef.current = render;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    const desired = { x: 0, y: 0, active: 0 };
    const current = { x: 0, y: 0, active: 0 };
    let frame = 0;

    function step() {
      let moving = false;
      for (const key of ['x', 'y', 'active']) {
        current[key] += (desired[key] - current[key]) * ease;
        if (Math.abs(desired[key] - current[key]) > SETTLED) moving = true;
        else current[key] = desired[key];
      }
      renderRef.current(current);
      frame = moving ? requestAnimationFrame(step) : 0;
    }

    function run() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    // O retângulo do palco só muda com scroll/resize: medir a cada pointermove
    // força layout síncrono à toa.
    let rect = null;
    const invalidate = () => { rect = null; };

    function onPointerMove(event) {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      rect ??= stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      desired.x = Math.max(-1, Math.min(1, x));
      desired.y = Math.max(-1, Math.min(1, y));
      desired.active = 1;
      run();
    }

    function onLeave() {
      desired.x = 0;
      desired.y = 0;
      desired.active = 0;
      run();
    }

    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointercancel', onLeave);
    reduced.addEventListener('change', onLeave);
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointercancel', onLeave);
      reduced.removeEventListener('change', onLeave);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      renderRef.current(null);
    };
  }, [ease]);

  return stageRef;
}
