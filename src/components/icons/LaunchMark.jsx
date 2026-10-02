// O símbolo da Launch como SVG inline: assim cada cópia empilhada do Hero pode
// receber a própria cor (a extrusão em CSS 3D é feita de várias cópias).
// Geometria idêntica à de public/launch-logo1.svg.

const PATHS = [
  'M3565 11426 l-1560 -1553 -3 -1147 -2 -1147 33 23 c75 52 783 602 1117 867 80 64 217 172 305 241 87 69 314 249 504 400 190 152 409 325 485 385 77 61 176 139 220 174 45 36 166 131 269 213 l189 148 106 -82 c159 -122 829 -656 1071 -852 67 -56 142 -114 165 -131 24 -16 58 -43 77 -60 30 -27 350 -279 854 -675 347 -272 747 -582 815 -630 l30 -21 0 1143 0 1143 -282 285 c-594 600 -2822 2830 -2827 2830 -3 0 -708 -699 -1566 -1554z',
  'M4190 8222 c-359 -241 -773 -523 -1015 -692 -99 -69 -296 -206 -437 -304 l-258 -178 0 -1484 c0 -1005 3 -1508 11 -1560 37 -270 206 -553 496 -835 l118 -114 6 205 c6 183 9 215 33 294 15 50 48 131 74 180 46 91 48 92 659 702 l613 610 0 1687 c0 928 -1 1687 -2 1687 -2 0 -136 -89 -298 -198z',
  'M5750 6736 l0 -1683 585 -584 c322 -321 606 -610 630 -642 54 -71 97 -161 131 -275 24 -77 27 -111 33 -291 l6 -204 113 108 c263 252 418 490 489 755 16 60 18 175 20 1596 l3 1531 -120 84 c-66 46 -155 108 -198 138 -115 81 -716 497 -802 556 -193 132 -753 507 -817 548 l-73 47 0 -1684z'
];

// O arquivo original vem do traçado com o eixo Y invertido.
const FLIP = 'translate(0.000000,1536.000000) scale(0.100000,-0.100000)';

/**
 * @param {'flat'|'lit'} variant  'flat' pinta com currentColor (camadas de
 *   profundidade); 'lit' aplica o degradê de luz e o brilho especular (face).
 */
export default function LaunchMark({ variant = 'flat', idPrefix = 'launch-mark', ...props }) {
  const faceId = `${idPrefix}-face`;
  const sheenId = `${idPrefix}-sheen`;
  const lit = variant === 'lit';

  return (
    <svg viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" {...props}>
      {lit && (
        <defs>
          {/* Luz principal vindo do alto à esquerda, como na cena 3D do rodapé. */}
          <linearGradient id={faceId} x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="var(--brand-metal-highlight)" />
            <stop offset="0.24" stopColor="var(--brand-metal-mid)" />
            <stop offset="0.52" stopColor="var(--brand)" />
            <stop offset="1" stopColor="var(--brand-metal-shadow)" />
          </linearGradient>
          <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="var(--color-white)" stopOpacity="0.3" />
            <stop offset="0.34" stopColor="var(--color-white)" stopOpacity="0.055" />
            <stop offset="0.62" stopColor="var(--color-white)" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      <g transform={FLIP} fill={lit ? `url(#${faceId})` : 'currentColor'} stroke="none">
        {PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      {lit && (
        <g transform={FLIP} fill={`url(#${sheenId})`} stroke="none">
          {PATHS.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}
