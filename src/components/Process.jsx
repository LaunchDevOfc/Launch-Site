import { useCallback, useRef, useState } from 'react';
import { processSteps } from '../data/process.js';
import { useProcessFlow } from '../hooks/useProcessFlow.js';
import ProcessModal from './ProcessModal.jsx';
import { processIcons } from './icons/ProcessIcons.jsx';

function ProcessStep({ step, index, isActive, cardRef, revealed, onOpen }) {
  const localRef = useRef(null);
  const triggerRef = useRef(null);
  const Icon = processIcons[step.icon];
  const attachCard = useCallback(
    (node) => {
      localRef.current = node;
      cardRef(node);
    },
    [cardRef]
  );

  return (
    <div
      className={`process-step is-expandable${revealed ? ' is-revealed' : ''}`}
      style={{ '--step-modal-color': step.modalColor }}
      ref={attachCard}
    >
      <div className="process-step-head">
        <span className="process-step-icon" aria-hidden="true">
          <Icon />
        </span>
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
    </div>
  );
}

export default function Process() {
  const [active, setActive] = useState(null);
  const { flowRef, setCardRef, revealReady, revealedCount } = useProcessFlow(processSteps.length, {
    paused: Boolean(active)
  });

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
        <div className={`process-flow${revealReady ? ' is-reveal-ready' : ''}`} ref={flowRef}>
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              isActive={active?.item?.id === step.id}
              cardRef={setCardRef(index)}
              revealed={index < revealedCount}
              onOpen={openStep}
            />
          ))}
        </div>
      </div>

      <ProcessModal active={active} onClose={closeStep} />
    </section>
  );
}
