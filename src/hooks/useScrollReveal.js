import { useLayoutEffect } from 'react';

/** One observer for the explicitly marked content groups, never per scroll. */
export function useScrollReveal() {
  useLayoutEffect(() => {
    const nodes = [...document.querySelectorAll('[data-reveal]')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Content is visible by default, including without enhancement support.
    if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return undefined;

    const mobile = window.matchMedia('(max-width: 760px)');
    const animations = new Map();
    const reveal = (node, immediate = false) => {
      observer.unobserve(node);
      if (immediate) {
        animations.get(node)?.cancel();
        animations.delete(node);
        node.removeAttribute('data-reveal-pending');
        return;
      }
      if (!node.hasAttribute('data-reveal-pending')) return;
      try {
        const delay = Math.min(Number(node.dataset.revealDelay) || 0, mobile.matches ? 40 : 80);
        const animation = node.animate([
          { opacity: 0, transform: `translateY(${mobile.matches ? 14 : 22}px)` },
          { opacity: 1, transform: 'none' }
        ], {
          duration: mobile.matches ? 480 : 520,
          delay,
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'backwards'
        });
        animations.set(node, animation);
        animation.finished.then(() => animations.delete(node)).catch(() => {});
      } catch {
        // A failed animation must never prevent this or later groups showing.
      } finally {
        // No persistent hidden state or filled transform after the animation.
        node.removeAttribute('data-reveal-pending');
      }
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });

    // Batch reads before writes. Runs before the first paint, not on scrolling.
    const positions = nodes.map((node) => node.getBoundingClientRect());
    nodes.forEach((node, index) => {
      if (positions[index].bottom <= 0) return;
      node.setAttribute('data-reveal-pending', '');
      observer.observe(node);
    });

    const showAll = () => {
      observer.disconnect();
      nodes.forEach((node) => reveal(node, true));
    };
    const onPreferenceChange = () => { if (reduced.matches) showAll(); };
    // Keyboard navigation/CTA focus must never land in an invisible group.
    const onFocus = (event) => {
      const node = event.target.closest?.('[data-reveal]');
      if (node) reveal(node, true);
    };
    reduced.addEventListener('change', onPreferenceChange);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('beforeprint', showAll);
    return () => {
      showAll();
      reduced.removeEventListener('change', onPreferenceChange);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('beforeprint', showAll);
    };
  }, []);
}
