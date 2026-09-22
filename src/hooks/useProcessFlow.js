import { useCallback, useEffect, useRef, useState } from 'react';

// Setas entre os cards do processo (LeaderLine, carregado no index.html),
// entrada em sequência e a flutuação de 14px de cada card.
// Porte direto do bloco que vivia em js/main.js, agora com cleanup — sem ele o
// StrictMode (e cada hot reload) deixaria SVGs duplicados no body.

const START_COLOR = '#FF6B76';
const END_COLOR = '#FF2436';
const REVEAL_STEP = 130;
const CARD_DURATION = 450;
const FLOAT_DURATION = 10000;

function canAnimateReveal() {
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    'IntersectionObserver' in window
  );
}

export function useProcessFlow(stepCount, { paused = false } = {}) {
  const flowRef = useRef(null);
  const cardsRef = useRef([]);
  const syncFloatingRef = useRef(null);
  const pausedRef = useRef(paused);

  const [revealReady, setRevealReady] = useState(canAnimateReveal);
  const [revealedCount, setRevealedCount] = useState(() => (canAnimateReveal() ? 0 : stepCount));

  // Uma callback estável por índice: assim o React não desanexa/reanexa as refs
  // dos cards a cada render.
  const cardRefCallbacks = useRef([]);
  const setCardRef = useCallback((index) => {
    cardRefCallbacks.current[index] ??= (node) => {
      cardsRef.current[index] = node;
    };
    return cardRefCallbacks.current[index];
  }, []);

  // O modal aberto congela a flutuação (as setas ficariam correndo atrás de cards
  // que ninguém está vendo).
  useEffect(() => {
    pausedRef.current = paused;
    syncFloatingRef.current?.();
  }, [paused]);

  useEffect(() => {
    const flow = flowRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const LeaderLine = window.LeaderLine;
    // Sem as setas não há sequência de entrada: os cards precisam nascer visíveis,
    // senão um bloqueio no script do LeaderLine deixaria a seção vazia.
    if (!flow || cards.length < 2 || typeof LeaderLine === 'undefined') {
      setRevealReady(false);
      setRevealedCount(stepCount);
      return undefined;
    }

    const timers = [];
    const cleanups = [];
    const mobile = window.matchMedia('(max-width: 760px)');
    const narrow = window.matchMedia('(max-width: 1080px)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animateReveal = canAnimateReveal();
    let revealComplete = !animateReveal;
    let frame = 0;
    let hoverFrame = 0;
    let floatFrame = 0;

    LeaderLine.positionByWindowResize = false;

    function columnCount() {
      if (mobile.matches) return 1;
      return narrow.matches ? 2 : 3;
    }

    function connectionOptions(index) {
      const columns = columnCount();
      const vertical = columns === 1 || (index + 1) % columns === 0;
      const right = Math.floor(index / columns) % 2 === 0;
      return {
        size: mobile.matches ? 4 : 6,
        startSocket: vertical ? 'bottom' : right ? 'right' : 'left',
        endSocket: vertical ? 'top' : right ? 'left' : 'right',
        startSocketGravity: mobile.matches ? 28 : 40,
        endSocketGravity: mobile.matches ? 28 : 40
      };
    }

    const lines = cards.slice(0, -1).map(
      (card, index) =>
        new LeaderLine(
          card,
          cards[index + 1],
          Object.assign(
            {
              path: 'fluid',
              color: END_COLOR,
              startPlug: 'behind',
              endPlug: 'arrow3',
              endPlugSize: 1.5,
              startPlugColor: START_COLOR,
              endPlugColor: END_COLOR,
              gradient: true,
              hide: animateReveal
            },
            connectionOptions(index)
          )
        )
    );

    // O LeaderLine injeta os SVGs direto no body; eles são decorativos.
    document.querySelectorAll('body > .leader-line').forEach((svg) => {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    });

    function positionConnections() {
      lines.forEach((line, index) => {
        line.setOptions(connectionOptions(index));
        line.position();
      });
    }

    function scheduleDraw() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(positionConnections);
    }

    // Cada card entra e só então a seta que chega nele é desenhada: o LeaderLine
    // ancora na posição atual, desenhar durante o translate prenderia a linha no
    // lugar errado.
    function revealSequence() {
      cards.forEach((card, index) => {
        timers.push(setTimeout(() => setRevealedCount(index + 1), index * REVEAL_STEP));
      });
      lines.forEach((line, index) => {
        timers.push(
          setTimeout(() => {
            line.position();
            line.show('draw', { duration: 380, timing: 'ease-in-out' });
          }, (index + 1) * REVEAL_STEP + CARD_DURATION)
        );
      });
      timers.push(
        setTimeout(() => {
          setRevealReady(false);
          revealComplete = true;
          syncFloatingRef.current?.();
        }, cards.length * REVEAL_STEP + CARD_DURATION + 420)
      );
    }

    if (animateReveal) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          revealObserver.disconnect();
          revealSequence();
        },
        { threshold: 0.12 }
      );
      revealObserver.observe(flow);
      cleanups.push(() => revealObserver.disconnect());
    }

    // Transform de CSS não dispara ResizeObserver: seguimos o hover na unha.
    function followCardScale() {
      cancelAnimationFrame(hoverFrame);
      const until = performance.now() + 350;
      const update = () => {
        lines.forEach((line) => line.position());
        if (performance.now() < until) hoverFrame = requestAnimationFrame(update);
      };
      hoverFrame = requestAnimationFrame(update);
    }

    cards.forEach((card) => {
      card.addEventListener('mouseenter', followCardScale);
      card.addEventListener('mouseleave', followCardScale);
      cleanups.push(() => {
        card.removeEventListener('mouseenter', followCardScale);
        card.removeEventListener('mouseleave', followCardScale);
      });
    });

    // A flutuação é separada do scale do hover.
    if (typeof cards[0].animate === 'function') {
      const hoveredCards = new Set();
      let flowVisible = false;

      const floats = cards.map((card) => {
        const animation = card.animate(
          [{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }],
          { duration: FLOAT_DURATION, iterations: Infinity, easing: 'ease-in-out' }
        );
        animation.pause();
        animation.currentTime = 0;
        return animation;
      });
      cleanups.push(() => floats.forEach((animation) => animation.cancel()));

      // Enquanto algum card flutua, as pontas das setas são relidas a cada frame.
      function trackFloatingLines() {
        lines.forEach((line) => line.position());
        floatFrame = requestAnimationFrame(trackFloatingLines);
      }

      function syncFloating() {
        cancelAnimationFrame(floatFrame);
        let running = false;
        floats.forEach((animation, index) => {
          // Um clique deixa o foco no card depois que o mouse sai; só foco de
          // teclado deve manter o card parado.
          const interacting =
            hoveredCards.has(cards[index]) || !!cards[index].querySelector(':focus-visible');
          const play =
            revealComplete &&
            flowVisible &&
            !document.hidden &&
            !motionPreference.matches &&
            !pausedRef.current &&
            !interacting;
          if (play) {
            animation.play();
            running = true;
          } else {
            animation.pause();
            if (motionPreference.matches) animation.currentTime = 0;
          }
        });
        if (running) floatFrame = requestAnimationFrame(trackFloatingLines);
        scheduleDraw();
      }

      cards.forEach((card) => {
        const onEnter = (event) => {
          if (event.pointerType === 'touch') return;
          hoveredCards.add(card);
          syncFloating();
        };
        const onLeave = () => {
          hoveredCards.delete(card);
          syncFloating();
        };
        const onFocusChange = () => queueMicrotask(syncFloating);
        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointerleave', onLeave);
        card.addEventListener('pointercancel', onLeave);
        card.addEventListener('focusin', onFocusChange);
        card.addEventListener('focusout', onFocusChange);
        cleanups.push(() => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointerleave', onLeave);
          card.removeEventListener('pointercancel', onLeave);
          card.removeEventListener('focusin', onFocusChange);
          card.removeEventListener('focusout', onFocusChange);
        });
      });

      if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver((entries) => {
          flowVisible = entries[0].isIntersecting;
          syncFloating();
        });
        visibilityObserver.observe(flow);
        cleanups.push(() => visibilityObserver.disconnect());
      } else {
        flowVisible = true;
      }

      syncFloatingRef.current = syncFloating;
      motionPreference.addEventListener('change', syncFloating);
      document.addEventListener('visibilitychange', syncFloating);
      cleanups.push(() => {
        motionPreference.removeEventListener('change', syncFloating);
        document.removeEventListener('visibilitychange', syncFloating);
        syncFloatingRef.current = null;
      });
      syncFloating();
    }

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(scheduleDraw);
      observer.observe(document.body);
      observer.observe(flow);
      cards.forEach((card) => observer.observe(card));
      cleanups.push(() => observer.disconnect());
    }

    window.addEventListener('resize', scheduleDraw);
    window.addEventListener('pageshow', scheduleDraw);
    if (document.fonts) document.fonts.ready.then(scheduleDraw);
    scheduleDraw();

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((cleanup) => cleanup());
      cancelAnimationFrame(frame);
      cancelAnimationFrame(hoverFrame);
      cancelAnimationFrame(floatFrame);
      window.removeEventListener('resize', scheduleDraw);
      window.removeEventListener('pageshow', scheduleDraw);
      lines.forEach((line) => line.remove());
    };
  }, [stepCount]);

  return { flowRef, setCardRef, revealReady, revealedCount };
}
