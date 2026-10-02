import { useRef } from 'react';
import { useImageState } from '../hooks/useImageState.js';
import { resetSpotlight, trackSpotlight } from '../lib/spotlight.js';

export default function ServiceCard({ service, index, isActive, onOpen }) {
  const cardRef = useRef(null); const triggerRef = useRef(null); const { state, imgProps } = useImageState(service.image); const featured = service.tier === 'principal';
  return <article className={`service-card${featured ? ' is-featured' : ''}`} ref={cardRef} style={{ '--i': index }} onPointerMove={trackSpotlight} onPointerLeave={resetSpotlight}><div className={`service-card-media${state === 'loaded' ? ' has-image' : ''}`}><img src={service.image} alt={service.imageAlt} width={service.imageWidth} height={service.imageHeight} loading="lazy" decoding="async" {...imgProps} /><div className="service-card-media-meta" aria-hidden="true"><span>{service.num}</span><span>{service.mediaLabel}</span></div></div><div className="service-card-body"><div className="service-card-title-row"><h3>{service.title}</h3>{featured && <span className="service-priority">Essencial</span>}</div><p className="service-card-summary">{service.summary}</p><span className="service-card-cue" aria-hidden="true">Ver detalhes <span>↗</span></span></div><button className="service-card-trigger" type="button" ref={triggerRef} aria-label={`Ver detalhes: ${service.title}`} aria-haspopup="dialog" aria-controls="service-modal" aria-expanded={isActive} onClick={() => onOpen(service, cardRef.current, triggerRef.current)} /></article>;
}
