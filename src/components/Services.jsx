import { useCallback } from 'react';
import { services } from '../data/services.js';
import { useInView } from '../hooks/useInView.js';
import { useServiceSelection } from '../context/ServiceContext.jsx';
import ServiceGallery from './ServiceGallery.jsx';

export default function Services() {
  const { activeServiceId, setActiveServiceId } = useServiceSelection();
  const [sectionRef, isVisible] = useInView({ rootMargin: '-60px' });
  const selectService = useCallback((id) => { setActiveServiceId(id); if (window.matchMedia('(max-width: 650px)').matches) requestAnimationFrame(() => document.getElementById('service-showcase-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); }, [setActiveServiceId]);
  return <section className="section services-section" id="servicos" aria-labelledby="services-title"><div className="wrap" ref={sectionRef}><div className="section-head services-heading"><div><div className="eyebrow">Soluções digitais</div><h2 id="services-title">Seis formas de tornar o seu negócio mais simples de operar.</h2></div><p>Escolha uma solução para entender como ela funciona na prática.</p></div><div className={`services-gallery-wrap${isVisible ? ' is-visible' : ''}`}><ServiceGallery services={services} activeId={activeServiceId} onSelect={selectService} /></div></div></section>;
}
