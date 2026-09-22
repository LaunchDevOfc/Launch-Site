import { useEffect, useRef, useState } from 'react';

/**
 * Dispara uma única vez quando o elemento chega perto da viewport. Usado para só
 * baixar o three.js quando a seção 3D está a caminho da tela.
 */
export function useInView({ rootMargin = '400px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setInView(true);
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
