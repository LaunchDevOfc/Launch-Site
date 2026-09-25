import { services } from '../data/services.js';
import { useServiceSelection } from '../context/ServiceContext.jsx';
import ContactLink from './ContactLink.jsx';

const compactServiceLabels = {
  'landing-pages': 'Landing Pages',
  'sistemas-personalizados': 'Sistemas',
  'automacao-inteligente': 'Automação com IA',
  'dashboards-gestao': 'Dashboards',
  'atendimento-ia': 'Atendimento com IA',
  'orcamentos-digitais': 'Orçamentos Digitais'
};

const launchLinks = [
  { href: '#processo', label: 'Processo' },
  { href: '#transformacao', label: 'Resultados' },
  { href: '#sobre', label: 'Quem Somos' },
  { href: '#perguntas-frequentes', label: 'FAQ' },
  { href: '#contato', label: 'Contato', contact: true }
];

function FooterServiceLink({ service }) {
  const { goToService } = useServiceSelection();
  return (
    <a href="#servicos" onClick={(event) => { event.preventDefault(); goToService(service.id); }}>
      {compactServiceLabels[service.id] ?? service.title}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <a className="site-footer-logo" href="#" aria-label="Launch — voltar ao início">
              <img src="/img/servicos/LogoEscrita.webp" alt="Launch" width="162" height="54" />
            </a>
            <p>Soluções digitais pensadas para as necessidades do seu negócio.</p>
          </div>

          <nav className="site-footer-group" aria-labelledby="footer-services-title">
            <h2 id="footer-services-title">Serviços</h2>
            <div className="site-footer-links site-footer-service-links">
              {services.map((service) => (
                <FooterServiceLink service={service} key={service.id} />
              ))}
            </div>
          </nav>

          <nav className="site-footer-group" aria-labelledby="footer-launch-title">
            <h2 id="footer-launch-title">Launch</h2>
            <div className="site-footer-links">
              {launchLinks.map((link) => link.contact ? (
                <ContactLink key={link.href}>{link.label}</ContactLink>
              ) : (
                <a href={link.href} key={link.href}>{link.label}</a>
              ))}
            </div>
          </nav>
        </div>

        <div className="site-footer-bottom">© {year} Launch. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
