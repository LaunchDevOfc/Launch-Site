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
    const visible = new Map(nodes.map((node) => [node, true]));
    // Observe only the existing dialogs' open attribute, not the page subtree.
    // A still background can be reused by the modal's backdrop blur.
    const dialogs = [...document.querySelectorAll('dialog')];
    const refresh = () => {
      const covered = document.hidden || dialogs.some((dialog) => dialog.open);
      nodes.forEach((node) => node.classList.toggle('is-paused', covered || !visible.get(node)));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
        refresh();
      },
      { rootMargin: '100px' }
    );
    const dialogObserver = new MutationObserver(refresh);
    dialogs.forEach((dialog) => dialogObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
    document.addEventListener('visibilitychange', refresh);
    nodes.forEach((node) => observer.observe(node));
    refresh();
    return () => {
      observer.disconnect();
      dialogObserver.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      nodes.forEach((node) => node.classList.remove('is-paused'));
    };
  }, [selectors]);
}
