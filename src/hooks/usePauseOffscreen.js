import { useEffect } from 'react';

/**
 * Pausa as animações infinitas (respiro da logo, flutuação dos cards, varredura
 * de luz) enquanto a seção está fora da tela. Em máquinas fracas, animação
 * rodando sem ninguém ver é só custo de GPU. O CSS lê a classe `is-paused`.
 */
export function usePauseOffscreen(selectors) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const nodes = selectors.flatMap((selector) => [...document.querySelectorAll(selector)]);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting)),
      { rootMargin: '100px' }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [selectors]);
}
