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
              O próximo
              <br />
              lançamento pode
              <br />
              <span className="accent">ser o seu.</span>
            </h1>
            <p>
              Transformamos necessidades reais em soluções digitais sob medida, pensadas para colocar projetos em
              movimento e acompanhar o próximo passo de cada negócio.
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
