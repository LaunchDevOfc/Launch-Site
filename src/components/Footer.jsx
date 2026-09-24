import logoHeader from '../assets/logo-header.svg';
import ContactLink from './ContactLink.jsx';

const footerLinks = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Processo' },
  { href: '#sobre', label: 'Equipe' },
  { href: '#contato', label: 'Contato', contact: true }
];

function FooterLink({ link }) {
  return link.contact ? <ContactLink>{link.label}</ContactLink> : <a href={link.href}>{link.label}</a>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="site-footer-main">
          <a className="site-footer-logo" href="#" aria-label="Launch — voltar ao início">
            <img src={logoHeader} alt="" width="44" height="44" />
            <span>LAUNCH</span>
          </a>

          <nav className="site-footer-nav" aria-label="Navegação do rodapé">
            {footerLinks.map((link) => <FooterLink link={link} key={link.href} />)}
          </nav>
        </div>

        <div className="site-footer-bottom">© {year} Launch. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
