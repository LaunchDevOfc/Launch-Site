import { useLayoutEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

// Measure only when crossing the threshold. Layout reaches its final state
// once; the surface and content then travel there with compositor transforms.
export function useCompactHeader() {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const nodes = [...header.querySelectorAll('.nav-surface, .logo, .navlinks, .nav-actions')];
    let compact = window.scrollY > 36;
    let animations = [];
    header.classList.toggle('is-scrolled', compact);
    const cancel = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
    };
    const update = () => {
      const next = window.scrollY > 36;
      if (next === compact) return;
      compact = next;
      const animate = !prefersReducedMotion() && typeof header.animate === 'function';
      const before = animate ? nodes.map((node) => node.getBoundingClientRect()) : [];
      cancel();
      header.classList.toggle('is-scrolled', compact);
      if (!animate) return;
      const after = nodes.map((node) => node.getBoundingClientRect());
      animations = nodes.flatMap((node, index) => {
        const from = before[index];
        const to = after[index];
        if (!from.width || !to.width || !to.height) return [];
        const scale = node.matches('.nav-surface, .logo');
        return [node.animate([
          { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scale ? from.width / to.width : 1}, ${scale ? from.height / to.height : 1})` },
          { transform: 'none' }
        ], { duration: 350, easing: 'ease' })];
      });
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', cancel);
    reduced.addEventListener('change', cancel);
    return () => {
      cancel();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', cancel);
      reduced.removeEventListener('change', cancel);
    };
  }, []);

  return headerRef;
}
