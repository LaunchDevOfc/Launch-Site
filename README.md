# Launch — versão React

Reescrita do protótipo `Launch/` (HTML + CSS + JS puro) em React com Vite. Mesmo
layout, mesmo CSS e mesmas interações — a diferença é que o conteúdo virou dado e
o comportamento virou componente/hook.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o dist/
```

## Estrutura

```
public/
  launch-logo1.svg        contorno usado pela cena 3D (o SVGLoader busca por URL)
  logo-miniatura.png      favicon
  img/servicos/           imagens dos cards (ainda não existem — ver abaixo)
  vendor/leader-line.*    lib UMD das setas do processo, carregada no index.html
src/
  data/services.js        os 10 serviços (texto, destaque, imagem, highlights)
  data/process.js         as 6 etapas do processo, com a cor do modal de cada uma
  hooks/useFlipDialog.js  abre um <dialog> animando a partir do card (FLIP)
  hooks/useProcessFlow.js setas, entrada em sequência e flutuação dos cards
  hooks/useInView.js      adia o carregamento da seção 3D
  components/             uma pasta por bloco da página
  styles/                 o CSS original, fatiado por seção e na mesma ordem
```

### Por que o CSS continua global

As regras são as mesmas do protótipo, na mesma ordem de cascata, só separadas em
arquivos por seção. Nada foi convertido para CSS Modules porque boa parte dos
seletores é aninhada (`.contact .field input`, `.process-step:nth-child(2)`) e
renomear classes mudaria o resultado visual. `src/index.css` só importa os
arquivos — a ordem ali importa.

### O que virou dado

Adicionar um serviço é adicionar um objeto em `src/data/services.js`; `variant`
decide se ele entra no grid dos quatro destaques (`core`) ou no dos secundários
(`small`). Uma etapa nova do processo é um objeto em `src/data/process.js` — só
lembre que o CSS posiciona as etapas em zigue-zague por `:nth-child`, então mudar
a quantidade pede um ajuste em `src/styles/process.css`.

### Os dois modais

Serviços e processo usam o mesmo `useFlipDialog`: o `<dialog>` nativo é aberto com
`showModal()` e animado a partir do retângulo do card que o abriu, voltando para
lá ao fechar. Esc, clique no backdrop e o botão de fechar passam pelo mesmo
caminho, e o foco volta para o botão de origem.

## Pendências herdadas do protótipo

- **Imagens dos serviços**: `public/img/servicos/` está vazia. Enquanto os
  arquivos não estiverem lá (`landing-pages.jpg`, `chatbots.jpg`, ... com os
  nomes que estão em `src/data/services.js`), cada card cai no gradiente de
  placeholder.
- **Formulário de contato**: `ContactForm` já controla os campos, mas o `submit`
  apenas evita o reload e loga os dados. Falta apontar para o backend ou serviço
  de e-mail.
