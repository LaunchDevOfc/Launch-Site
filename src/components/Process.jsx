import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { processSteps } from '../data/process.js';
import { useInView } from '../hooks/useInView.js';
import ProcessModal from './ProcessModal.jsx';
import { processIcons } from './icons/ProcessIcons.jsx';

function ProcessConnector({ isLast, drawn }) {
  if (isLast) return null;

  const transition = {
    duration: 0.24,
    ease: [.16, 1, .3, 1]
  };

  return (
    <span className="process-connector" aria-hidden="true">
      <svg className="process-connector-horizontal" viewBox="0 0 100 24" preserveAspectRatio="none">
        <motion.path d="M0 12C29 4 68 20 91 12" initial={{ pathLength: 0 }} animate={{ pathLength: drawn ? 1 : 0 }} transition={transition} />
        <motion.path className="process-connector-direction" d="M88 6C94 8 97 10 100 12C97 14 94 16 88 18" initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }} transition={{ duration: 0.16, delay: 0.25, ease: 'easeOut' }} />
      </svg>
      <svg className="process-connector-vertical" viewBox="0 0 24 100" preserveAspectRatio="none">
        <motion.path d="M12 0C5 30 19 68 12 91" initial={{ pathLength: 0 }} animate={{ pathLength: drawn ? 1 : 0 }} transition={transition} />
        <motion.path className="process-connector-direction" d="M6 88C8 94 10 97 12 100C14 97 16 94 18 88" initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }} transition={{ duration: 0.16, delay: 0.25, ease: 'easeOut' }} />
      </svg>
    </span>
  );
}

function ProcessStep({ step, index, isActive, revealed, connectorDrawn, onOpen, isLast }) {
  const localRef = useRef(null);
  const triggerRef = useRef(null);
  const Icon = processIcons[step.icon];

  return (
    <motion.article
      className={`process-step is-expandable${revealed ? ' is-revealed' : ''}`}
      style={{ '--step-modal-color': step.modalColor, pointerEvents: revealed ? 'auto' : 'none' }}
      ref={localRef}
      initial={false}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: .985 }}
      transition={{ duration: .26, ease: [.16, 1, .3, 1] }}
    >
      <div className="process-step-head">
        <span className="process-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <motion.span className="process-step-icon" aria-hidden="true" whileHover={{ rotate: -4, scale: 1.04 }}>
          <Icon />
        </motion.span>
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
      <ProcessConnector isLast={isLast} drawn={connectorDrawn} />
    </motion.article>
  );
}

export default function Process() {
  const [active, setActive] = useState(null);
  const [flowRef, isVisible] = useInView({ rootMargin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [revealedCount, setRevealedCount] = useState(0);
  const [drawnCount, setDrawnCount] = useState(0);

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
    <section className="section" id="processo">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Na prática</div>
            <h2>O que acontece depois que você entra em contato.</h2>
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
              connectorDrawn={index < drawnCount}
              onOpen={openStep}
              isLast={index === processSteps.length - 1}
            />
          ))}
        </div>
      </div>

      <ProcessModal active={active} onClose={closeStep} />
    </section>
  );
}
