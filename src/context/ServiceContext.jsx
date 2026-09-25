import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { services } from '../data/services.js';
import { prefersReducedMotion } from '../lib/motion.js';

const ServiceContext = createContext(null);
const serviceIds = new Set(services.map((service) => service.id));

export function ServiceProvider({ children }) {
  const [activeServiceId, setActiveServiceIdState] = useState(services[0].id);

  const setActiveServiceId = useCallback((id) => {
    if (serviceIds.has(id)) setActiveServiceIdState(id);
  }, []);

  const goToService = useCallback((id) => {
    if (!serviceIds.has(id)) return;
    setActiveServiceIdState(id);
    requestAnimationFrame(() => {
      document.getElementById('servicos')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'start'
      });
    });
  }, []);

  const value = useMemo(
    () => ({ activeServiceId, setActiveServiceId, goToService }),
    [activeServiceId, goToService, setActiveServiceId]
  );

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

export function useServiceSelection() {
  const value = useContext(ServiceContext);
  if (!value) throw new Error('useServiceSelection precisa estar dentro de ServiceProvider.');
  return value;
}
