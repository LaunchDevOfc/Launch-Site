import { useInView } from '../hooks/useInView.js';
import ContactLink from './ContactLink.jsx';

export default function About() {
  const [sectionRef, isVisible] = useInView({ rootMargin: '-80px' });

  return <section className={`section about-section${isVisible ? ' is-visible' : ''}`} id="sobre" ref={sectionRef}>
    <div className="wrap about">
      <div className="about-visual" aria-hidden="true">
        <div className="about-visual-orbit about-visual-orbit-one" />
        <div className="about-visual-orbit about-visual-orbit-two" />
        <img className="about-visual-logo" src="/launch-logo1.svg" alt="" />
      </div>
      <div className="about-copy">
        <div className="eyebrow">Quem somos</div>
        <h2 className="section-title">Software sob medida, com clareza do primeiro rascunho ao próximo passo.</h2>
        <p className="about-lead">A Launch é uma software house pequena para empresas que precisam transformar uma operação real em uma solução que funciona de verdade.</p>
        <p>Entendemos o contexto, desenhamos o caminho e construímos perto de quem vai usar. Sem camadas desnecessárias e sem entregar um sistema para desaparecer depois.</p>
        <div className="about-points">
          <div><strong>01</strong><span>Conversa direta com quem constrói.</span></div>
          <div><strong>02</strong><span>Decisões técnicas explicadas com clareza.</span></div>
          <div><strong>03</strong><span>Suporte para o produto continuar evoluindo.</span></div>
        </div>
        <ContactLink className="btn about-cta" subject="falar-projeto">Conhecer nosso jeito de trabalhar <span aria-hidden="true">→</span></ContactLink>
      </div>
    </div>
  </section>;
}
