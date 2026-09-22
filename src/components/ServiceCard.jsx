import { useRef } from 'react';
import { useImageState } from '../hooks/useImageState.js';
import { resetSpotlight, trackSpotlight } from '../lib/spotlight.js';

// Um único card para os oito serviços. Os quatro principais recebem a classe
// is-featured, que muda só detalhes: número vermelho, fio no topo do painel,
// painel de imagem mais iluminado e um hover um pouco mais firme. Mesma escala,
// mesma estrutura, mesma coleção.
export default function ServiceCard({ service, index, isActive, onOpen }) {
  const cardRef = useRef(null);
  const triggerRef = useRef(null);
  const { state, imgProps } = useImageState(service.image);
  const featured = service.tier === 'principal';

  return (
    <article
      className={`service-card${featured ? ' is-featured' : ''}`}
      ref={cardRef}
      style={{ '--i': index }}
      onPointerMove={trackSpotlight}
      onPointerLeave={resetSpotlight}
    >
      <div className={`service-card-media${state === 'loaded' ? ' has-image' : ''}`}>
        <img
          src={service.image}
          alt={service.imageAlt}
          loading="lazy"
          decoding="async"
          {...imgProps}
        />
        <span className="service-card-num" aria-hidden="true">
          {service.num}
        </span>
      </div>

      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p className="service-card-summary">{service.summary}</p>
        <span className="service-card-cue" aria-hidden="true">
          Ver detalhes
          <span className="service-card-cue-icon">↗</span>
        </span>
      </div>

      <button
        className="service-card-trigger"
        type="button"
        ref={triggerRef}
        aria-label={`Ver detalhes: ${service.title}`}
        aria-haspopup="dialog"
        aria-controls="service-modal"
        aria-expanded={isActive}
        onClick={() => onOpen(service, cardRef.current, triggerRef.current)}
      />
    </article>
  );
}
