import { useRef } from 'react';
import { usePointerTilt } from '../hooks/usePointerTilt.js';
import LaunchMark from './icons/LaunchMark.jsx';

// A profundidade é feita de cópias do símbolo empilhadas no eixo Z, cada uma um
// pouco mais escura: é o que dá o volume quando a peça está girada. Nenhuma
// biblioteca 3D envolvida — o three.js continua só na seção do rodapé.
// Deitada, a espessura aparece inteira na borda da frente — por isso a peça
// ganhou mais camadas que na versão em pé.
const DEPTH_LAYERS = 13;
const LAYER_STEP = 2.6;

const layers = Array.from({ length: DEPTH_LAYERS }, (_, index) => {
  const t = (index + 1) / DEPTH_LAYERS;
  return {
    depth: -(index + 1) * LAYER_STEP,
    color: `color-mix(in srgb, var(--brand-depth-front), var(--brand-depth-back) ${t * 100}%)`
  };
});

// Inclinação máxima (graus) que o cursor soma à pose de repouso da peça.
const TILT_X = 9;
const TILT_Y = 14;

export default function HeroLogo() {
  const haloRef = useRef(null);
  const ringsRef = useRef(null);
  const beamsRef = useRef(null);
  const bloomRef = useRef(null);
  const sceneRef = useRef(null);

  // Mesmas fórmulas que o CSS usava com --pointer-*, agora escritas direto em
  // cada elemento: só eles são recalculados, não as 15 camadas da peça.
  const stageRef = usePointerTilt({
    render(state) {
      const nodes = [haloRef.current, ringsRef.current, beamsRef.current, bloomRef.current, sceneRef.current];
      if (nodes.some((node) => !node)) return;
      const [halo, rings, beams, bloom, scene] = nodes;
      if (!state) {
        for (const node of nodes) { node.style.removeProperty('transform'); node.style.removeProperty('opacity'); }
        return;
      }
      const { x, y, active } = state;
      halo.style.transform = `translate(calc(-50% + ${x * 18}px), calc(-50% + ${y * 13}px))`;
      halo.style.opacity = Math.min(1, 0.76 + active * 0.22);
      rings.style.transform = `translate(calc(-50% - ${x * 9}px), calc(-50% - ${y * 7}px))`;
      rings.style.opacity = Math.min(1, 0.8 + active * 0.4);
      beams.style.transform = `translate(calc(-50% + ${x * 11}px), calc(-50% + ${y * 8}px))`;
      beams.style.opacity = Math.min(1, 0.75 + active * 0.4);
      bloom.style.opacity = Math.min(1, 0.43 + active * 0.2);
      scene.style.transform = `rotateX(${46 - y * TILT_X}deg) rotateY(${16 + x * TILT_Y}deg) rotateZ(-12deg) scale(${1 + active * 0.04})`;
    }
  });

  // O palco ocupa a coluna inteira: o cursor não precisa acertar a logo para ela reagir.
  return (
    <div className="hero-logo-stage" ref={stageRef}>
      <div className="hero-logo">
        {/* Iluminação neutra preserva os anéis e feixes atrás da peça. */}
        <span className="hero-logo-halo" aria-hidden="true" ref={haloRef} />
        <span className="hero-logo-rings" aria-hidden="true" ref={ringsRef} />
        <span className="hero-logo-beams" aria-hidden="true" ref={beamsRef} />

        <div className="hero-logo-float">
          <div className="hero-logo-scene" ref={sceneRef}>
            <div className="hero-logo-solid">
              {/* Cópia desfocada do próprio símbolo: o brilho segue o contorno, não um círculo. */}
              <LaunchMark className="hero-logo-bloom" ref={bloomRef} />
              {layers.map((layer) => (
                <LaunchMark
                  key={layer.depth}
                  className="hero-logo-layer"
                  style={{ transform: `translateZ(${layer.depth}px)`, color: layer.color }}
                />
              ))}
              <LaunchMark className="hero-logo-face" variant="lit" idPrefix="hero-mark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
