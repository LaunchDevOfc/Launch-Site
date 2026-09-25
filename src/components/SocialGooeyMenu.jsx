import { useEffect, useId, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { socialLinks } from '../data/socialLinks.js';

const actions = [
  {
    key: 'whatsapp',
    Icon: FaWhatsapp,
    accessibleLabel: 'Falar com a Launch pelo WhatsApp',
    x: -18,
    y: -166
  },
  {
    key: 'instagram',
    Icon: FaInstagram,
    accessibleLabel: 'Instagram da Launch',
    x: -76,
    y: -112
  },
  {
    key: 'linkedin',
    Icon: FaLinkedinIn,
    accessibleLabel: 'LinkedIn da Launch',
    x: -136,
    y: -52
  }
];

function getSocialUrl(key, config) {
  if (!config.url) return '';
  if (key !== 'whatsapp' || !config.message) return config.url;
  const separator = config.url.includes('?') ? '&' : '?';
  return `${config.url}${separator}text=${encodeURIComponent(config.message)}`;
}

function SocialAction({ action, index, isOpen, onSelect }) {
  const config = socialLinks[action.key];
  const href = getSocialUrl(action.key, config);
  const style = { '--social-x': `${action.x}px`, '--social-y': `${action.y}px`, '--social-index': index };
  const content = <action.Icon aria-hidden="true" />;

  if (!href) {
    return (
      <button
        className="social-gooey-action is-unconfigured"
        type="button"
        style={style}
        aria-label={`${action.accessibleLabel} — link ainda não configurado`}
        aria-disabled="true"
        data-tooltip={`${config.label} — link pendente`}
        tabIndex={isOpen ? 0 : -1}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      className="social-gooey-action"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      aria-label={action.accessibleLabel}
      data-tooltip={config.label}
      tabIndex={isOpen ? 0 : -1}
      onClick={onSelect}
    >
      {content}
    </a>
  );
}

export default function SocialGooeyMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const reactId = useId();
  const filterId = `social-goo-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      className={`social-gooey${isOpen ? ' is-open' : ''}`}
      ref={rootRef}
      data-open={isOpen}
    >
      <svg className="social-gooey-liquid" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} x="-45%" y="-45%" width="190%" height="190%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" result="shape" />
            <feDropShadow in="shape" dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity=".24" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {actions.map((action, index) => (
            <circle
              className="social-gooey-blob"
              cx="210"
              cy="210"
              r="25"
              key={action.key}
              style={{ '--social-x': `${action.x}px`, '--social-y': `${action.y}px`, '--social-index': index }}
            />
          ))}
          <circle className="social-gooey-blob social-gooey-blob-main" cx="210" cy="210" r="27" />
        </g>
      </svg>

      <nav className="social-gooey-actions" aria-label="Redes sociais da Launch" aria-hidden={!isOpen}>
        {actions.map((action, index) => (
          <SocialAction action={action} index={index} isOpen={isOpen} key={action.key} onSelect={() => setIsOpen(false)} />
        ))}
      </nav>

      <button
        className="social-gooey-toggle"
        type="button"
        ref={toggleRef}
        aria-label={isOpen ? 'Fechar menu de redes sociais' : 'Abrir menu de redes sociais'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <FiPlus aria-hidden="true" />
      </button>
    </div>
  );
}
