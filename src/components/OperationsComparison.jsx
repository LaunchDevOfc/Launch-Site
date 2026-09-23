import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useInView } from '../hooks/useInView.js';
import '../styles/operations-comparison.css';

const transformations = [
  ['Processos manuais', 'Processos automatizados'],
  ['Informações espalhadas', 'Informações centralizadas'],
  ['Planilhas e controles soltos', 'Gestão em um só lugar'],
  ['Tarefas repetitivas', 'Rotinas mais eficientes'],
  ['Dados difíceis de acompanhar', 'Indicadores sempre claros'],
  ['Atendimento sobrecarregado', 'Atendimento mais ágil']
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function StateIcon({ after }) {
  return after ? (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.3 3.1 3.1L15.4 6" /></svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6.3 6.3 7.4 7.4m0-7.4-7.4 7.4" /></svg>
  );
}

function TransformationState({ after }) {
  return (
    <div className={`operations-scene operations-scene-${after ? 'after' : 'before'}`}>
      <span className={`comparison-label comparison-label-${after ? 'after' : 'before'}`}>{after ? 'DEPOIS' : 'ANTES'}</span>
      <div className="state-intro"><span>{after ? 'COM A LAUNCH' : 'ROTINA ATUAL'}</span><strong>{after ? 'A operação fica mais simples de conduzir.' : 'A operação exige esforço em cada detalhe.'}</strong></div>
      <div className="transformation-list">
        {transformations.map(([before, afterText], index) => <div className="transformation-row" key={before}><span className="transformation-icon"><StateIcon after={after} /></span><strong>{after ? afterText : before}</strong><span className="transformation-index">{String(index + 1).padStart(2, '0')}</span></div>)}
      </div>
      <p className="state-caption">{after ? 'Tecnologia sob medida para sua rotina ganhar ritmo e previsibilidade.' : 'Quando tudo depende de acompanhamento manual, crescer fica mais difícil.'}</p>
    </div>
  );
}

export default function OperationsComparison() {
  const [comparisonRef, inView] = useInView({ rootMargin: '-80px' });
  const [position, setPosition] = useState(48);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();
  const surfaceRef = useRef(null);
  const updatePosition = useCallback((clientX) => { const bounds = surfaceRef.current?.getBoundingClientRect(); if (bounds?.width) setPosition(clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100)); }, []);
  const beginDrag = (event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); updatePosition(event.clientX); };
  const endDrag = (event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); };
  const handleKeyDown = (event) => {
    const increment = event.shiftKey ? 10 : 5;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); setPosition((current) => clamp(current - increment, 0, 100)); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); setPosition((current) => clamp(current + increment, 0, 100)); }
    if (event.key === 'Home') { event.preventDefault(); setPosition(0); }
    if (event.key === 'End') { event.preventDefault(); setPosition(100); }
  };

  return <section className="section operations-comparison-section" id="transformacao" ref={comparisonRef}><div className="wrap operations-comparison-layout">
    <motion.div className="operations-comparison-head" initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: .45, ease: [.16, 1, .3, 1] }}><div className="eyebrow">Na operação</div><h2>Menos trabalho manual. Mais controle da operação.</h2><p>Uma solução feita para a sua rotina transforma esforço repetitivo em processos que trabalham a favor do negócio.</p><a className="btn operations-comparison-cta" href="#contato">Falar sobre o projeto <span aria-hidden="true">→</span></a></motion.div>
    <motion.div className="operations-comparison" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: .55, delay: .08, ease: [.16, 1, .3, 1] }}>
      <div className={`comparison-surface${dragging ? ' is-dragging' : ''}`} ref={surfaceRef}>
        <TransformationState after />
        <div className="comparison-before-layer" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><TransformationState /></div>
        <div className={`comparison-divider${position === 0 ? ' is-at-start' : ''}${position === 100 ? ' is-at-end' : ''}`} style={{ left: `${position}%` }}><motion.span className="comparison-handle-motion" animate={!reduceMotion && inView && !dragging ? { x: [0, 5, -4, 0] } : { x: 0 }} transition={{ duration: 1.2, delay: .75, ease: 'easeInOut' }}><span className="comparison-handle" role="slider" tabIndex={0} aria-label="Comparar antes e depois" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} aria-valuetext={`${Math.round(position)}% do cenário anterior visível`} onPointerDown={beginDrag} onPointerMove={(event) => dragging && updatePosition(event.clientX)} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={handleKeyDown}><i /><i /><i /></span></motion.span></div>
      </div>
      <p className="comparison-instruction">Arraste o controle para explorar cada transformação.</p>
    </motion.div>
  </div></section>;
}
