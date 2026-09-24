import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isContactSubject } from '../data/contactSubjects.js';
import { prefersReducedMotion } from '../lib/motion.js';

const ContactContext = createContext(null);

function initialSubject() {
  if (typeof window === 'undefined') return '';
  const value = new URLSearchParams(window.location.search).get('assunto') ?? '';
  return isContactSubject(value) ? value : '';
}

export function ContactProvider({ children }) {
  const [subject, setSubjectState] = useState(initialSubject);

  const setSubject = useCallback((value) => {
    setSubjectState(isContactSubject(value) ? value : '');
  }, []);

  const goToContact = useCallback((value = '') => {
    setSubjectState(isContactSubject(value) ? value : '');
    requestAnimationFrame(() => {
      document.getElementById('contato')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'start'
      });
    });
  }, []);

  const contextValue = useMemo(() => ({ subject, setSubject, goToContact }), [goToContact, setSubject, subject]);
  return <ContactContext.Provider value={contextValue}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const value = useContext(ContactContext);
  if (!value) throw new Error('useContact precisa estar dentro de ContactProvider.');
  return value;
}
