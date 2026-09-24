import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useImageState } from '../hooks/useImageState.js';
import ContactLink from './ContactLink.jsx';

function ShowcaseVisual({ service }) {
  const { state, imgProps } = useImageState(service.image);
  return <div className={`service-showcase-visual${state === 'loaded' ? ' has-image' : ''}`}><img src={service.image} alt={service.imageAlt} {...imgProps} /><span aria-hidden="true">{service.num}</span></div>;
}

export default function ServiceGallery({ services, activeId, onSelect }) {
  const active = services.find((service) => service.id === activeId) ?? services[0];
  return <div className="service-showcase"><LayoutGroup id="service-selector"><nav className="service-showcase-nav" aria-label="Escolha um serviço">{services.map((service) => { const selected = service.id === active.id; return <motion.button layout className={`service-showcase-option${selected ? ' is-selected' : ''}`} key={service.id} type="button" aria-pressed={selected} onClick={() => onSelect(service.id)} whileHover={{ x: 4 }} whileTap={{ scale: .99 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}><span>{service.num}</span><strong>{service.title}</strong><i aria-hidden="true">↗</i>{selected && <motion.b className="service-showcase-active" layoutId="active-service" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden="true" />}</motion.button>; })}</nav></LayoutGroup><div className="service-showcase-stage" id="service-showcase-stage" aria-live="polite"><AnimatePresence mode="wait"><motion.article className="service-showcase-panel" key={active.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3, ease: [.16, 1, .3, 1] }}><ShowcaseVisual service={active} /><div className="service-showcase-content"><h3>{active.title}</h3><p>{active.detail}</p><ContactLink className="btn service-showcase-cta" subject={active.id}>Falar sobre o projeto <span aria-hidden="true">→</span></ContactLink></div></motion.article></AnimatePresence></div></div>;
}
