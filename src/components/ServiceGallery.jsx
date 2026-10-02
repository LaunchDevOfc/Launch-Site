import { LayoutGroup, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { useImageState } from '../hooks/useImageState.js';
import ContactLink from './ContactLink.jsx';

function ShowcaseVisual({ service }) {
  const { state, imgProps } = useImageState(service.image);
  return <div className={`service-showcase-visual${state === 'loaded' ? ' has-image' : ''}`}><img src={service.image} alt={service.imageAlt} width={service.imageWidth} height={service.imageHeight} loading="lazy" decoding="async" {...imgProps} /><span aria-hidden="true">{service.num}</span></div>;
}

export default function ServiceGallery({ services, activeId, onSelect }) {
  const active = services.find((service) => service.id === activeId) ?? services[0];
  const [displayedId, setDisplayedId] = useState(active.id);
  useEffect(() => {
    if (displayedId === active.id) return undefined;
    const timer = window.setTimeout(() => setDisplayedId(active.id), 300);
    return () => window.clearTimeout(timer);
  }, [active.id, displayedId]);
  return (
    <div className="service-showcase">
      <LayoutGroup id="service-selector">
        <div className="service-showcase-nav" role="group" aria-label="Escolha um serviço">
          {services.map((service) => {
            const selected = service.id === active.id;
            return <m.button layout className={`service-showcase-option${selected ? ' is-selected' : ''}`} key={service.id} type="button" aria-pressed={selected} aria-controls={`service-panel-${service.id}`} onClick={() => onSelect(service.id)} whileHover={{ x: 4 }} whileTap={{ scale: .99 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}><span>{service.num}</span><strong>{service.title}</strong><i aria-hidden="true">↗</i>{selected && <m.b className="service-showcase-active" layoutId="active-service" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden="true" />}</m.button>;
          })}
        </div>
      </LayoutGroup>
      <div className="service-showcase-stage" id="service-showcase-stage" aria-live="polite">
        {/* Painéis reais da interação presentes no HTML, sem cópia para robôs. */}
        {services.map((service) => {
          const selected = service.id === displayedId;
          return (
            <m.article className="service-showcase-panel" key={service.id} id={`service-panel-${service.id}`} aria-labelledby={`service-title-${service.id}`} hidden={!selected} initial={false} animate={{ opacity: selected && active.id === displayedId ? 1 : 0, y: selected ? (active.id === displayedId ? 0 : -8) : 10 }} transition={{ duration: .3, ease: [.16, 1, .3, 1] }}>
              <ShowcaseVisual service={service} />
              <div className="service-showcase-content">
                <h3 id={`service-title-${service.id}`}>{service.title}</h3>
                <p>{service.detail}</p>
                <ContactLink className="btn btn-sm service-showcase-cta" subject={service.id}>Falar sobre o projeto <span aria-hidden="true">→</span></ContactLink>
              </div>
            </m.article>
          );
        })}
      </div>
    </div>
  );
}
