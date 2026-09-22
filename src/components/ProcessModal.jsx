import { useFlipDialog } from '../hooks/useFlipDialog.js';
import { scrollToContactForm } from '../lib/motion.js';
import { processIcons } from './icons/ProcessIcons.jsx';

export default function ProcessModal({ active, onClose }) {
  const step = active?.item ?? null;
  const { dialogProps, requestClose } = useFlipDialog({
    active,
    onClose,
    htmlClass: 'process-modal-open',
    openDuration: 380
  });
  const Icon = step ? processIcons[step.icon] : null;

  return (
    <dialog
      className="process-modal"
      id="process-modal"
      aria-labelledby="process-modal-title"
      aria-describedby="process-modal-summary"
      style={step ? { '--step-modal-color': step.modalColor } : undefined}
      {...dialogProps}
    >
      {step && (
        <div className="process-modal-panel">
          <button
            className="process-modal-close"
            type="button"
            aria-label="Fechar detalhes da etapa"
            autoFocus
            onClick={() => requestClose(false)}
          >
            &times;
          </button>
          <span className="process-modal-icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="process-modal-number" aria-hidden="true">
            {`ETAPA ${String(active.index + 1).padStart(2, '0')}`}
          </span>
          <div className="eyebrow">Como funciona</div>
          <h2 id="process-modal-title">{step.title}</h2>
          <p className="process-modal-summary" id="process-modal-summary">
            {step.tag}
          </p>
          <div className="process-modal-body">
            <p>{step.detail}</p>
            <ul className="service-highlights">
              {step.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <a
            className="btn process-modal-contact"
            href="#contato"
            onClick={(event) => {
              event.preventDefault();
              requestClose(true);
              requestAnimationFrame(scrollToContactForm);
            }}
          >
            Conversar sobre meu projeto <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </dialog>
  );
}
