import HeroLogo from './HeroLogo.jsx';
import ContactLink from './ContactLink.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="eyebrow">Software house</div>
            <h1>
              Software sob
              <br />
              medida para
              <br />
              <span className="accent">sua empresa.</span>
            </h1>
            <p>
              A Launch desenvolve software sob medida para empresas: sistemas personalizados e soluções digitais
              que organizam processos e acompanham o crescimento do negócio.
            </p>
            <div className="hero-cta">
              <ContactLink className="btn btn-lg hero-btn" subject="falar-projeto">
                Solicitar orçamento
              </ContactLink>
              <a href="#servicos" className="hero-link">
                Ver serviços <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <HeroLogo />
          </div>
        </div>

      </div>
    </section>
  );
}
