import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { processSteps } from '../data/process.js';
import { useInView } from '../hooks/useInView.js';
import ProcessModal from './ProcessModal.jsx';
import { processIcons } from './icons/ProcessIcons.jsx';

function ProcessConnector({ isLast }) {
  if (isLast) return null;

  return (
    <span className="process-connector" aria-hidden="true">
      <svg className="process-connector-horizontal" viewBox="0 0 100 24" preserveAspectRatio="none">
        <path d="M0 12H89" />
        <path d="m85 5 11 7-11 7" />
      </svg>
      <svg className="process-connector-vertical" viewBox="0 0 24 100" preserveAspectRatio="none">
        <path d="M12 0v89" />
        <path d="m5 85 7 11 7-11" />
      </svg>
    </span>
  );
}

function ProcessStep({ step, index, isActive, revealed, onOpen, isLast }) {
  const localRef = useRef(null);
  const triggerRef = useRef(null);
  const Icon = processIcons[step.icon];

  return (
    <motion.article
      className="process-step is-expandable"
      style={{ '--step-modal-color': step.modalColor }}
      ref={localRef}
      initial={false}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: .45, delay: revealed ? Math.min(index * .04, .2) : 0, ease: [.16, 1, .3, 1] }}
    >
      <div className="process-step-head">
        <span className="process-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <motion.span className="process-step-icon" aria-hidden="true" whileHover={{ rotate: -4, scale: 1.04 }}>
          <Icon />
        </motion.span>
      </div>
      <h3>{step.title}</h3>
      <p className="process-step-tag">{step.tag}</p>
      <span className="process-step-hint" aria-hidden="true">
        Ver detalhes <span className="process-step-info">i</span>
      </span>
      <button
        className="process-step-open"
        type="button"
        ref={triggerRef}
        aria-label={`Ver detalhes: ${step.title}`}
        aria-haspopup="dialog"
        aria-controls="process-modal"
        aria-expanded={isActive}
        onClick={() => onOpen(step, index, localRef.current, triggerRef.current)}
      />
      <ProcessConnector isLast={isLast} />
    </motion.article>
  );
}

export default function Process() {
  const [active, setActive] = useState(null);
  const [flowRef, isVisible] = useInView({ rootMargin: '-80px' });

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
        <div className="process-flow" ref={flowRef}>
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              isActive={active?.item?.id === step.id}
              revealed={isVisible}
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
