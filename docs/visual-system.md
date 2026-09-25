# Sistema visual da Launch

Fonte de verdade: `src/styles/tokens.css`. Fundamentos de tipografia, botões,
containers e foco: `src/styles/base.css`. Cada seção mantém seu layout no CSS
correspondente. Conteúdo e comportamento permanecem nos componentes existentes.

## Cores por função

- `--red` / `--action`: vermelho original `#D2001C`, usado nos CTAs e seleção.
- `--action-hover` / `--action-active`: estados dos mesmos CTAs.
- `--accent-on-dark`: tom claro de vermelho já presente na seção Processo,
  reservado a texto/ícones ativos e foco sobre superfícies escuras. Não substitui
  o vermelho principal em fundos de botões.
- `--background-dark` / `--background-dark-secondary`: base e variação de seção.
- `--surface-dark` / `--surface-dark-elevated`: cards, modais e controles internos.
- `--background-light` / `--surface-light`: trecho editorial Quem Somos + FAQ,
  Header e cenário Antes do comparador. A diferença do Antes/Depois é intencional.
- `--text-*-primary`, `--text-*-secondary`, `--text-*-muted`: títulos, leitura e
  informações auxiliares; usar a família correspondente ao fundo.
- `--border-*`: divisórias e cards; `--border-*-hover`: interação.
- `--field-border-dark`: contorno dos campos, com contraste maior que divisórias.
- `--success` / `--error`: feedback do formulário, sem alterar sua lógica.

Os efeitos da logo 3D e os detalhes gráficos existentes têm cores próprias de
iluminação. Não devem ser convertidos indiscriminadamente em cores de interface.

## Tipografia e ritmo

Inter para leitura e controles; Space Grotesk para títulos; JetBrains Mono para
labels. H2 de seção compartilha escala de 32–44 px, peso 700 e entrelinha 1,08.
Hero, títulos de card, títulos de modal e labels do Footer têm funções distintas.

Container de 1120 px; margens internas de 32 px, reduzidas a 20 px até 650 px.
O espaçamento vertical das seções varia de 72 a 104 px pelo mesmo token.
Hero e Footer mantêm proporções próprias. Os grids e breakpoints existentes
continuam responsáveis pela disposição dos componentes.

## Controles e superfícies

- Primary: `.btn` e `.contact-submit`, vermelho e texto branco.
- Secondary: `.about-cta` / `.btn-outline`, contorno neutro.
- Text: links de navegação e `.hero-link`, sem superfície de CTA.
- Icon: sino/menu, fechamento de modal e menu social; círculo quando sua forma
  tem função no componente, como o efeito Gooey.

Controles: raio 6 px. Cards: 12 px. Modais e Header flutuante: 16 px.
CTAs compactos: altura mínima 44 px. Hero e envio do formulário: 48 px.
Sombras: somente `--shadow-card`, `--shadow-overlay` e `--shadow-header` nas
superfícies de interface. Transições curtas usam os tokens de interação;
animações de entrada, flutuação, conexões e Gooey mantêm sua implementação.

## Contraste dos tokens

Razões calculadas pela luminância relativa sRGB:

| Par | Contraste |
| --- | --- |
| Branco / CTA vermelho | 5,59:1 |
| Texto secundário / card escuro | 8,71:1 |
| Texto auxiliar / superfície escura elevada | 5,41:1 |
| Acento claro / superfície escura elevada | 6,05:1 |
| Texto secundário / fundo claro | 6,03:1 |
| Texto auxiliar / fundo claro | 4,88:1 |
| Borda de campo / fundo do campo | 4,00:1 |

Essas medidas cobrem os pares de tokens, não equivalem a uma certificação de
acessibilidade da página inteira ou de textos sobre imagens.
