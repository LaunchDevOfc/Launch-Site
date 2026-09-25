import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { processSteps } from '../data/process.js';
import { useInView } from '../hooks/useInView.js';
import ProcessModal from './ProcessModal.jsx';
import { processIcons } from './icons/ProcessIcons.jsx';

function ProcessConnectionLayer({ layout, drawnCount }) {
  if (!layout) return null;
  return <svg className="process-connection-layer" viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none" aria-hidden="true">
    {layout.paths.map((connection, index) => <g key={index}><m.path d={connection.path} initial={{ pathLength: 0 }} animate={{ pathLength: index < drawnCount ? 1 : 0 }} transition={{ duration: .24, ease: [.16, 1, .3, 1] }} /><m.path className="process-connection-arrow" d={connection.arrow} initial={{ opacity: 0 }} animate={{ opacity: index < drawnCount ? 1 : 0 }} transition={{ duration: .14, delay: .25, ease: 'easeOut' }} /></g>)}
  </svg>;
}

function ProcessStep({ step, index, isActive, revealed, onOpen, cardRef }) {
  const localRef = useRef(null);
  const triggerRef = useRef(null);
  const Icon = processIcons[step.icon];

  return (
    <m.article
      className={`process-step is-expandable${revealed ? ' is-revealed' : ''}`}
      style={{ '--step-modal-color': step.modalColor, pointerEvents: revealed ? 'auto' : 'none' }}
      ref={(node) => { localRef.current = node; cardRef(node); }}
      initial={false}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: .985 }}
      transition={{ duration: .26, ease: [.16, 1, .3, 1] }}
    >
      <div className="process-step-surface theme-dark">
      <div className="process-step-head">
        <span className="process-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <m.span className="process-step-icon" aria-hidden="true" whileHover={{ rotate: -4, scale: 1.04 }}>
          <Icon />
        </m.span>
      </div>
      <h3>{step.title}</h3>
      <p className="process-step-tag">{step.tag}</p>
      <button
        className="btn process-step-open"
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-controls="process-modal"
        aria-expanded={isActive}
        onClick={() => onOpen(step, index, localRef.current, triggerRef.current)}
      >
        Ver detalhes <span aria-hidden="true">→</span>
      </button>
      </div>
    </m.article>
  );
}

export default function Process() {
  const [active, setActive] = useState(null);
  const [flowRef, isVisible] = useInView({ rootMargin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [revealedCount, setRevealedCount] = useState(0);
  const [drawnCount, setDrawnCount] = useState(0);
  const [connectionLayout, setConnectionLayout] = useState(null);
  const cardNodes = useRef([]);
  const refCallbacks = useRef([]);
  const setCardRef = useCallback((index) => {
    refCallbacks.current[index] ??= (node) => { cardNodes.current[index] = node; };
    return refCallbacks.current[index];
  }, []);

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return undefined;
    let frame = 0;
    const update = () => {
      const cards = cardNodes.current.filter(Boolean);
      const flowBox = flow.getBoundingClientRect();
      if (cards.length !== processSteps.length || !flowBox.width || !flowBox.height) return;
      const paths = cards.slice(0, -1).map((card, index) => {
        const from = card.getBoundingClientRect();
        const to = cards[index + 1].getBoundingClientRect();
        const fromCenterX = from.left + from.width / 2 - flowBox.left;
        const fromCenterY = from.top + from.height / 2 - flowBox.top;
        const toCenterX = to.left + to.width / 2 - flowBox.left;
        const toCenterY = to.top + to.height / 2 - flowBox.top;
        const sameRow = Math.abs(toCenterY - fromCenterY) < Math.min(from.height, to.height) * .55;
        const sourceGap = 4;
        const targetGap = 18;
        const arrowDepth = 7;
        if (sameRow) {
          const direction = toCenterX > fromCenterX ? 1 : -1;
          const startX = (direction > 0 ? from.right : from.left) - flowBox.left + direction * sourceGap;
          const targetX = (direction > 0 ? to.left : to.right) - flowBox.left - direction * targetGap;
          const endX = targetX - direction * arrowDepth;
          const bend = Math.max(22, Math.abs(endX - startX) * .34);
          return { path: `M ${startX} ${fromCenterY} C ${startX + direction * bend} ${fromCenterY - 10} ${endX - direction * bend} ${toCenterY + 10} ${endX} ${toCenterY}`, arrow: `M ${endX} ${toCenterY - 5} L ${targetX} ${toCenterY} L ${endX} ${toCenterY + 5}` };
        }

        const isNextRow = toCenterY > fromCenterY;
        const changesColumn = Math.abs(toCenterX - fromCenterX) > Math.min(from.width, to.width) * .25;

        // In a regular grid, the last card in one row connects to the first
        // card in the next. Route that transition through the clear row gap,
        // rather than cutting across the cards on the row below.
        if (isNextRow && changesColumn) {
          const startY = from.bottom - flowBox.top + sourceGap;
          const targetY = to.top - flowBox.top - targetGap;
          const endY = targetY - arrowDepth;
          const gapMiddleY = (startY + endY) / 2;
          const curve = Math.min(30, Math.max(16, (endY - startY) * .38));
          return {
            path: `M ${fromCenterX} ${startY} C ${fromCenterX} ${gapMiddleY - curve} ${toCenterX} ${gapMiddleY + curve} ${toCenterX} ${endY}`,
            arrow: `M ${toCenterX - 5} ${endY} L ${toCenterX} ${targetY} L ${toCenterX + 5} ${endY}`
          };
        }

        const direction = toCenterY > fromCenterY ? 1 : -1;
        const startY = (direction > 0 ? from.bottom : from.top) - flowBox.top + direction * sourceGap;
        const targetY = (direction > 0 ? to.top : to.bottom) - flowBox.top - direction * targetGap;
        const endY = targetY - direction * arrowDepth;
        const bend = Math.max(22, Math.abs(endY - startY) * .34);
        return { path: `M ${fromCenterX} ${startY} C ${fromCenterX - 10} ${startY + direction * bend} ${toCenterX + 10} ${endY - direction * bend} ${toCenterX} ${endY}`, arrow: `M ${toCenterX - 5} ${endY} L ${toCenterX} ${targetY} L ${toCenterX + 5} ${endY}` };
      });
      setConnectionLayout({ width: Math.ceil(flowBox.width), height: Math.ceil(flowBox.height), paths });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(flow);
    cardNodes.current.filter(Boolean).forEach((card) => observer.observe(card));
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', schedule); };
  }, [flowRef]);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (reduceMotion) {
      setRevealedCount(processSteps.length);
      setDrawnCount(processSteps.length - 1);
      return undefined;
    }

    setRevealedCount(1);
    setDrawnCount(0);
    const timers = [];

    for (let index = 1; index < processSteps.length; index += 1) {
      const pathStart = 180 + (index - 1) * 620;
      timers.push(window.setTimeout(() => setDrawnCount(index), pathStart));
      timers.push(window.setTimeout(() => setRevealedCount(index + 1), pathStart + 330));
    }

    return () => timers.forEach(window.clearTimeout);
  }, [isVisible, reduceMotion]);

  const openStep = useCallback(
    (item, index, card, trigger) => setActive({ item, index, card, trigger }),
    []
  );
  const closeStep = useCallback(() => setActive(null), []);

  return (
    <section className="section theme-light" id="processo">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Na prática</div>
            <h2 className="section-title">O que acontece depois que você entra em contato.</h2>
          </div>
        </div>
        <div className={`process-flow${isVisible ? ' is-visible' : ''}`} ref={flowRef}>
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              isActive={active?.item?.id === step.id}
              revealed={index < revealedCount}
              onOpen={openStep}
              cardRef={setCardRef(index)}
            />
          ))}
          <ProcessConnectionLayer layout={connectionLayout} drawnCount={drawnCount} />
        </div>
      </div>

      <ProcessModal active={active} onClose={closeStep} />
    </section>
  );
}
