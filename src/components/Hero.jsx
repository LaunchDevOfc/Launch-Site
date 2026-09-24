import HeroLogo from './HeroLogo.jsx';
import ContactLink from './ContactLink.jsx';

const stats = [
  { value: '10', label: 'Tipos de serviço' },
  { value: '100%', label: 'Sob medida' },
  { value: '01', label: 'Time, do início ao fim' }
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="eyebrow">Software house</div>
            <h1>
              Tira sua ideia
              <br />
              do papel e coloca
              <br />
              <span className="accent">no ar.</span>
            </h1>
            <p>
              A Launch projeta e desenvolve landing pages, chatbots e sistemas sob medida, do primeiro rascunho até o
              suporte depois de publicado.
            </p>
            <div className="hero-cta">
              <ContactLink className="btn hero-btn" subject="falar-projeto">
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

        <div className="hero-stats">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="n">{stat.value}</div>
              <div className="l">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
