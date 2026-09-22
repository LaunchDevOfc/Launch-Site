import { useCallback, useState } from 'react';
import { services } from '../data/services.js';
import { useInView } from '../hooks/useInView.js';
import ServiceCard from './ServiceCard.jsx';
import ServiceModal from './ServiceModal.jsx';

export default function Services() {
  // `card` alimenta a animação FLIP e `trigger` recebe o foco de volta.
  const [active, setActive] = useState(null);
  const openService = useCallback((item, card, trigger) => setActive({ item, card, trigger }), []);
  const closeService = useCallback(() => setActive(null), []);
  const [gridRef, gridVisible] = useInView({ rootMargin: '-60px' });

  return (
    <section className="section services-section" id="servicos">
      <div className="services-mesh" aria-hidden="true" />
      <div className="services-glow" aria-hidden="true" />

      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">O que fazemos</div>
            <h2>As soluções que a Launch desenvolve.</h2>
          </div>
          <p>Clique em qualquer serviço para ver o que entregamos na prática.</p>
        </div>

        <div className={`services-grid${gridVisible ? ' is-visible' : ''}`} ref={gridRef}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isActive={active?.item?.id === service.id}
              onOpen={openService}
            />
          ))}
        </div>
      </div>

      <ServiceModal active={active} onClose={closeService} />
    </section>
  );
}
