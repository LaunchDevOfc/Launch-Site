import { useEffect, useState } from 'react';
import ContactInvite from './ContactInvite.jsx';
import logoHeader from '../assets/logo-header.svg';

const navLinks = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Processo' },
  { href: '#sobre', label: 'Equipe' },
  { href: '#contato', label: 'Contato' }
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bellRead, setBellRead] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);

  // Depois de 36px de rolagem o header vira uma pílula flutuante.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  function dismissInvite() {
    setBadgeVisible(false);
    setInviteOpen(false);
  }

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <nav className="nav" aria-label="Navegação principal">
          <a className="logo" href="#" aria-label="Launch — início">
            <img src={logoHeader} alt="" width="48" height="48" />
          </a>
          <div className={`navlinks${menuOpen ? ' open' : ''}`} id="header-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a href="#contato" className="btn nav-contact">
              Vamos conversar
            </a>
            <button
              className={`nav-toggle${menuOpen ? ' active' : ''}`}
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-controls="header-links"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <button
              className={`notification-bell${bellRead ? ' is-read' : ''}`}
              type="button"
              aria-label={
                bellRead ? 'Abrir convite para conversar sobre seu projeto' : 'Uma mensagem para você'
              }
              aria-haspopup="dialog"
              aria-controls="contact-invite"
              onClick={() => {
                setBellRead(true);
                setInviteOpen(true);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
                <path d="M10 21h4" />
              </svg>
              {badgeVisible && (
                <span className="notification-count" aria-hidden="true">
                  1
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>
      <ContactInvite
        open={inviteOpen}
        onDismiss={dismissInvite}
        onSyncClose={() => setInviteOpen(false)}
      />
    </>
  );
}
