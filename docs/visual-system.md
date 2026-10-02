# Sistema visual da Launch — experimento Cobalto

## Fonte de verdade

`src/styles/tokens.css`, importado antes de `base.css`, concentra a paleta.
Antes desta migração, esse arquivo não era carregado; as cores ativas estavam
em `base.css`, com exceções em CSS, SVG e JavaScript.
`base.css` mantém tipografia, espaçamento, controles e reset existentes.

- `--color-brand`: #2563EB; preenchimento dos CTAs e estados ativos.
- `--color-background`: #09090B; fundo principal.
- `--color-white`: #FAFAFA; texto de alto contraste e superfícies claras.
- `--color-surface` / `--color-surface-elevated`: #161618 / #1D1D20.
- `--brand-hover` / `--brand-active`: misturas com preto, sem neon.
- `--brand-text`: mistura com branco em fundo escuro; cobalto em fundo claro.
- `--focus`: acompanha a variante acessível da marca no contexto.
- `--text`, `--text-2`, `--text-3`, `--text-muted`: hierarquia de leitura.
- `--border-*`: contornos neutros. A marca fica reservada à interação.
- `--error` e `--success`: feedback independente da identidade.

`.theme-light` preserva Processo e FAQ claros; `.theme-dark` restaura as
superfícies escuras dentro deles. Nenhum seletor de tema foi adicionado.

## Logo e efeitos

Header e Quem Somos usam o mesmo traçado SVG de `LaunchMark` com `currentColor`.
As 13 camadas da logo do Hero e os gradientes metálicos derivam dos tokens de
marca. Geometria, inclinação, animações e interação com o mouse permanecem iguais.
O componente Three.js, atualmente fora da página, também lê a paleta do CSS.
Anéis, feixes e sombras existentes usam iluminação neutra discreta.

O wordmark raster do Footer mantém o arquivo, transparência e proporções.
Um filtro CSS controlado por `--brand-artwork-hue: 224deg` adapta seu vermelho
original à família cobalto, preservando as letras brancas. Por ser uma imagem
raster, essa reprodução é aproximada, não uma aplicação exata de #2563EB.
As imagens dos serviços foram preservadas, inclusive cores dentro dos mockups.
O favicon usa o traçado original em branco sobre preto, sem identidade vermelha.

## Experimentar outra paleta

Altere `--color-brand` em `tokens.css`; preenchimentos, estados, textos e
materiais SVG acompanham automaticamente. Revalide contraste ao mudar a marca.
Para o wordmark raster do Footer, ajuste também `--brand-artwork-hue` nesse
mesmo arquivo (0deg recupera seu vermelho). Não é necessário editar componentes.
O favicon monocromático independe da cor de marca.

## Verificação desta migração

Build de produção: `npm run build`.
Chromium/Edge headless: comparação com a versão anterior nas larguras
1920, 1600, 1440, 1366, 1280, 1200, 1100, 1024, 960, 900, 820, 768, 600, 430,
390 e 360 px. Posições e dimensões das seções e textos idênticos, sem overflow
horizontal nem erros JavaScript. Comparação geométrica com movimento reduzido;
revisão visual em desktop e mobile.

Interações verificadas: convite do Header, seleção de serviço, seis modais do
Processo, teclado do Antes/Depois, FAQ, validação de e-mail, botão desabilitado,
menu social e navegação mobile. Nenhuma mensagem de formulário foi enviada.

Contrastes medidos a partir das cores renderizadas:

| Uso | Contraste |
| --- | --- |
| #FAFAFA sobre #2563EB | 4,95:1 |
| Cobalto principal sobre preto (elementos gráficos) | 3,85:1 |
| Texto de marca sobre superfície elevada | 6,45:1 |
| Texto secundário sobre superfície elevada | 6,54:1 |
| Texto muted/desabilitado sobre superfície elevada | 5,87:1 |
| Texto de erro sobre superfície | 6,55:1 |

O cobalto principal não é usado como texto pequeno sobre preto; esse contexto
usa `--brand-text`. Legendas e índices do cenário Antes foram escurecidos para
melhorar contraste sem alterar estrutura. Estes checks não constituem auditoria
completa de acessibilidade nem validação em todos os navegadores.
