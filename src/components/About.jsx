import LaunchMark from './icons/LaunchMark.jsx';
import ContactLink from './ContactLink.jsx';

export default function About() {
  return <section className="section about-section" id="sobre">
    <div className="wrap about">
      <div className="about-visual" aria-hidden="true" data-reveal>
        <div className="about-visual-orbit about-visual-orbit-one" />
        <div className="about-visual-orbit about-visual-orbit-two" />
        <LaunchMark className="about-visual-logo" />
      </div>
      <div className="about-copy" data-reveal data-reveal-delay="60">
        <div className="eyebrow">Quem somos</div>
        <h2 className="section-title">Software sob medida, com clareza do primeiro rascunho ao próximo passo.</h2>
        <p className="about-lead">A Launch é uma empresa de desenvolvimento de software sob medida para negócios que precisam transformar uma operação real em uma solução que funciona de verdade.</p>
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
