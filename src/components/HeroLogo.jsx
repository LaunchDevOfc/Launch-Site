import { usePointerTilt } from '../hooks/usePointerTilt.js';
import LaunchMark from './icons/LaunchMark.jsx';

// A profundidade é feita de cópias do símbolo empilhadas no eixo Z, cada uma um
// pouco mais escura: é o que dá o volume quando a peça está girada. Nenhuma
// biblioteca 3D envolvida — o three.js continua só na seção do rodapé.
// Deitada, a espessura aparece inteira na borda da frente — por isso a peça
// ganhou mais camadas que na versão em pé.
const DEPTH_LAYERS = 13;
const LAYER_STEP = 2.6;

function mixHex(from, to, t) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const channel = (a, b) => Math.round(a + (b - a) * t);
  return `rgb(${channel(r1, r2)} ${channel(g1, g2)} ${channel(b1, b2)})`;
}

const layers = Array.from({ length: DEPTH_LAYERS }, (_, index) => {
  const t = (index + 1) / DEPTH_LAYERS;
  return {
    depth: -(index + 1) * LAYER_STEP,
    color: mixHex('#C20020', '#3E000B', t)
  };
});

export default function HeroLogo() {
  const { stageRef, targetRef } = usePointerTilt();

  // O palco ocupa a coluna inteira: o cursor não precisa acertar a logo para ela reagir.
  return (
    <div className="hero-logo-stage" ref={stageRef}>
      <div className="hero-logo">
        {/* O vermelho da página se concentra aqui: brilho, anéis e feixes atrás da peça. */}
        <span className="hero-logo-halo" aria-hidden="true" />
        <span className="hero-logo-rings" aria-hidden="true" />
        <span className="hero-logo-beams" aria-hidden="true" />

        <div className="hero-logo-float">
          <div className="hero-logo-scene" ref={targetRef}>
            <div className="hero-logo-solid">
              {/* Cópia desfocada do próprio símbolo: o brilho segue o contorno, não um círculo. */}
              <LaunchMark className="hero-logo-bloom" />
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
