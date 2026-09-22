import { useFlipDialog } from '../hooks/useFlipDialog.js';
import { useImageState } from '../hooks/useImageState.js';
import { scrollToContactForm } from '../lib/motion.js';

// O detalhe do serviço abre a partir do próprio card (FLIP) e fecha de volta
// nele, então o visitante nunca perde o lugar na seção.
export default function ServiceModal({ active, onClose }) {
  const service = active?.item ?? null;
  const { dialogProps, requestClose } = useFlipDialog({
    active,
    onClose,
    htmlClass: 'service-modal-open'
  });
  const { state, imgProps } = useImageState(service?.image);

  return (
    <dialog
      className="service-modal"
      id="service-modal"
      aria-labelledby="service-modal-title"
      aria-describedby="service-modal-summary"
      {...dialogProps}
    >
      {service && (
        <div className="service-modal-panel">
          <button
            className="service-modal-close"
            type="button"
            aria-label="Fechar detalhes do serviço"
            autoFocus
            onClick={() => requestClose(false)}
          >
            &times;
          </button>

          <div className={`service-modal-media${state === 'loaded' ? ' has-image' : ''}`}>
            <img src={service.image} alt={service.imageAlt} {...imgProps} />
            <span className="service-modal-number" aria-hidden="true">
              {service.num}
            </span>
          </div>

          <div className="service-modal-content">
            <div className="eyebrow">Serviço Launch</div>
            <h2 className="service-modal-title" id="service-modal-title">
              {service.title}
            </h2>
            <p className="service-modal-summary" id="service-modal-summary">
              {service.summary}
            </p>

            <div className="service-modal-body">
              <p>{service.detail}</p>
              <h3 className="service-modal-subtitle">O que entra nesse serviço</h3>
              <ul className="service-highlights">
                {service.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="service-modal-cta">
              <a
                className="btn service-modal-contact"
                href="#contato"
                onClick={(event) => {
                  event.preventDefault();
                  requestClose(true);
                  requestAnimationFrame(scrollToContactForm);
                }}
              >
                Vamos conversar sobre seu projeto <span aria-hidden="true">↗</span>
              </a>
              <span className="service-modal-note">
                A primeira conversa é só para entender o que você precisa, sem compromisso.
              </span>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
