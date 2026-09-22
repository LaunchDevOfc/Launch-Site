import { useEffect, useRef } from 'react';

const SETTLED = 0.002;

/**
 * Faz a peça reagir ao cursor. Escreve, já suavizado:
 *   no alvo  → `--tilt-x` / `--tilt-y` (graus), somados à inclinação de repouso;
 *   no palco → `--pointer-x` / `--pointer-y` (-1 a 1) e `--pointer-active` (0 a 1),
 *              que o CSS usa para deslocar o brilho e dar o leve avanço da peça.
 *
 * O palco é a área que responde ao mouse — ele é maior que a logo de propósito,
 * para a reação começar antes de o cursor encostar nela. Só age em ponteiro fino
 * e fora do modo de movimento reduzido, e o loop para sozinho quando assenta.
 */
export function usePointerTilt({ tiltX = 9, tiltY = 14, ease = 0.11 } = {}) {
  const stageRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const target = targetRef.current;
    if (!stage || !target) return undefined;

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
      target.style.setProperty('--tilt-x', `${(current.y * -tiltX).toFixed(3)}deg`);
      target.style.setProperty('--tilt-y', `${(current.x * tiltY).toFixed(3)}deg`);
      stage.style.setProperty('--pointer-x', current.x.toFixed(4));
      stage.style.setProperty('--pointer-y', current.y.toFixed(4));
      stage.style.setProperty('--pointer-active', current.active.toFixed(4));
      frame = moving ? requestAnimationFrame(step) : 0;
    }

    function run() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    function onPointerMove(event) {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
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

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointercancel', onLeave);
      reduced.removeEventListener('change', onLeave);
      target.style.removeProperty('--tilt-x');
      target.style.removeProperty('--tilt-y');
      for (const name of ['--pointer-x', '--pointer-y', '--pointer-active']) {
        stage.style.removeProperty(name);
      }
    };
  }, [tiltX, tiltY, ease]);

  return { stageRef, targetRef };
}
