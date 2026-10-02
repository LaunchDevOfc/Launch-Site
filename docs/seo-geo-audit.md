# Auditoria SEO, GEO e AEO — Launch

Data: 01/10/2026. Escopo: código, assets, build de produção e navegação local em Chrome. Não houve publicação, envio de formulário ou consulta a contas de Search Console. Alterações preexistentes no workspace foram preservadas; `tokens.css` não foi editado nesta tarefa.

## Diagnóstico antes das correções

**Alta prioridade:** HTML inicial vazio (`<div id="root"></div>`); apenas a descrição do serviço selecionado no DOM; title limitado a “Launch”; ausência de description, canonical, robots, sitemap, Open Graph, cards sociais e JSON-LD. Domínio e perfis oficiais não configurados. A ausência de robots não constituía bloqueio por si só.

**Média prioridade:** ausência de main; H1 era exclusivamente um slogan; apresentação inicial abstrata; alt genérico e ausência de dimensões na imagem da galeria; links `#` para início. Falta de evidência da hospedagem, de métricas reais e de canais públicos ativos.

**Já adequado:** pt-BR, viewport, navegação por âncoras, um H1, H2 de seções e H3 de subdivisões, seis descrições úteis de serviços, nove perguntas e respostas concretas, labels de formulário, botões nativos, foco visível, diálogos nativos, imagens WebP, fontes com swap/preconnect, recursos de Motion separados e pausa de animações fora da tela.

**Opcional:** imagem social específica, casos reais documentados, respostas adicionais sobre manutenção e tipos de empresa, imagens responsivas em múltiplas resoluções e hospedagem própria de fontes. Manifest/PWA, hreflang e páginas individuais não têm necessidade demonstrada neste projeto.

## Arquitetura e HTML entregue

- React 19 + Vite 8; uma landing page em `/`, sem roteador e sem páginas individuais de serviços. IDs de seção são fragmentos, não URLs adicionais de sitemap.
- `/api/contact` é uma função de envio por Resend; aceita POST e depende de variáveis privadas. Não é página indexável nem foi testada enviando e-mail.
- Head originalmente estático em `index.html`. Agora o plugin em `vite.config.js` injeta os metadados de `src/data/site.js`, usando `scripts/seo.js`, tanto no desenvolvimento quanto no build.
- `npm run build` executa Vite e pré-renderiza a mesma árvore App com React no build. O arquivo `dist/index.html` contém o conteúdo real antes de executar JavaScript. Não exige servidor React em produção nem tratamento diferente por user-agent.
- `src/main.jsx` hidrata o HTML existente; mantém createRoot no desenvolvimento. `useInView` tem estado inicial compatível entre servidor e cliente.
- Galeria mantém seis artigos reais no HTML. O seletor mostra um painel por vez, preservando entrada/saída animada e seleção do assunto de contato. Não há cópia de texto exclusiva para crawlers. Os painéis inativos pertencem à interação, não a uma lista escondida de palavras-chave.
- Sem JavaScript, `public/no-script.css` expande serviços/FAQ e torna as etapas legíveis. O formulário explica que precisa de JavaScript, em vez de permitir um envio inoperante. Os modais de detalhes e envio do formulário continuam sendo recursos interativos; os resumos das etapas já constam do HTML.

## Inventário dos itens solicitados

| Item | Encontrado e decisão |
| --- | --- |
| Title | Alterado para `Launch \| Desenvolvimento de Software Sob Medida`. |
| Description | Adicionada descrição concreta da empresa, público empresarial e soluções. Centralizada, compartilhada com cards e identidade estruturada. |
| Canonical | Gerado apenas quando SITE_URL estiver configurada. Sem domínio presumido, localhost ou URL de preview. |
| Robots | Gerado em dist; permite conteúdo público e impede rastreamento de `/api/`. Regra genérica não bloqueia Googlebot, Bingbot ou crawlers de busca de IA. Robots não é controle de acesso. |
| Sitemap | Gerador com apenas `/`; usa a mesma origem do canonical. Não é emitido sem domínio. Sem lastmod inventado ou âncoras tratadas como páginas. |
| Semântica | Adicionado main envolvendo Hero até Contato; header, nav, sections, articles, footer e botões existentes preservados. Seletor de serviços é grupo de botões, não navegação entre páginas. |
| Headings | Um H1: “Software sob medida para sua empresa.”; mesmas três linhas e classes. H2 nas seções, H3 nos serviços/etapas/FAQ/formulário. Títulos de diálogos são contextuais. |
| Serviços | Descrições existentes mantidas: já explicam oferta, problema e aplicação. Todas incluídas no HTML inicial. Nenhuma expansão artificial de texto. |
| Imagens | Alt reescrito após inspeção visual das seis ilustrações; descreve a cena sem apresentá-la como projeto real. Dimensões intrínsecas adicionadas; lazy e decoding async na galeria, lazy/async no logo do rodapé. Componentes legados ServiceCard/ServiceModal também recebem dimensões. |
| Open Graph | title, description, type website, site_name Launch, locale pt_BR; URL condicionada ao domínio; imagem e alt preparados, condicionados a arquivo aprovado real. |
| Twitter/X | title/description compartilhados; card summary enquanto não houver imagem; summary_large_image e imagem absoluta após configurar domínio e arquivo social. Sem perfil de X inventado. |
| Organization | Novo; nome, descrição e identificador. URL/logo absoluto após SITE_URL. Sem endereço, telefone, CNPJ, fundadores, prêmios ou avaliações inventados. |
| sameAs | Reutiliza Instagram e LinkedIn de `src/data/socialLinks.js`, atualmente vazios. WhatsApp não é usado como perfil de identidade. |
| Logo | Símbolo existente `/favicon.svg` ligado à organização quando houver domínio. Favicon SVG preservado e fallback PNG 64×64 existente adicionado. |
| WebSite | Novo; nome, idioma e publisher ligado à mesma Organization. Sem SearchAction, porque o site não tem busca. |
| Service | Seis objetos novos, derivados da mesma fonte de dados exibida na galeria; provider aponta à organização. Finalidade semântica, sem promessa de rich result. |
| FAQ | Nove perguntas preservadas, respostas renderizadas desde o build. Acordeão com heading/button/aria-controls/aria-expanded; conteúdo sem JS permanece acessível. FAQPage não adicionado. |
| Entidade e conteúdo citável | H1, parágrafo do Hero e Quem Somos identificam a atividade; serviços e FAQ respondem de modo concreto sobre sistemas, IA, painéis, páginas, chatbots e propostas digitais. |
| Confiança | Processo, contexto da empresa e formulário existem. Redes estão desabilitadas por ausência de URLs. Antes/depois ilustra benefícios: não comprova resultados de clientes. Não foram criados números, casos ou avaliações. |
| SEO local | Não há endereço/cidade/área atendida confirmados. Sem LocalBusiness ou localização artificial. Não foi presumido atendimento nacional. |
| Links | Retorno ao início corrigido para #inicio. Âncoras verificadas contra IDs reais; links de contato e serviços mantêm href utilizável. Links sociais externos usam noopener noreferrer quando configurados. |
| Idioma | pt-BR preservado, inLanguage pt-BR no WebSite e og:locale pt_BR. Sem traduções ou hreflang fictícios. |
| Manifest | Ausente, mantido assim: landing page sem requisito de instalação/PWA. Ausência não é falha de indexação. |
| Mobile | Viewport existente; testes de 320, 360, 390, 768 e 1440 px, incluindo todos os serviços. Sem overflow horizontal/corte detectado nesses testes. |
| Acessibilidade | Main, rótulos de painéis e vínculo dos seletores melhorados. Labels, feedback de formulário, foco visível e controles por teclado existentes preservados. Isso não equivale a certificação WCAG ou auditoria completa com leitor de tela. |

## FAQ e confiança: avaliação editorial

As perguntas atuais cobrem oferta, sistemas personalizados, processo, custo, prazo, IA, chatbots, landing pages/dashboards e demandas fora do catálogo. Respondem sem preços ou prazos fabricados. Há alguma repetição entre as duas primeiras, mas ela não justifica substituir automaticamente conteúdo aprovado.

Pode ser útil futuramente responder “Preciso chegar com o escopo definido?” e “Como funcionam manutenção e suporte?”. O processo já indica descoberta e suporte; condições, cobertura, contratos e prazos de atendimento precisam ser confirmados antes de transformar isso em promessa comercial. Não há evidência para incluir depoimentos, projetos concluídos, tempo de mercado ou resultados quantificados.

## Performance

| Recurso | Antes | Depois da implementação |
| --- | --- | --- |
| HTML inicial | 0,75 KB; raiz sem conteúdo | Aproximadamente 78 KB / 14 KB gzip, com conteúdo completo e JSON-LD |
| JavaScript principal | 338,73 KB / 107,75 KB gzip | Aproximadamente 336 KB / 107 KB gzip |
| Chunk de animações | 85,49 KB / 28,08 KB gzip | Aproximadamente 86 KB / 28 KB gzip |
| CSS | 49,53 KB / 10,58 KB gzip | 49,60 KB / 10,60 KB gzip |

Tamanhos do build local; não são bytes transferidos em produção sem confirmar compressão HTTP. O resumo impresso pelo Vite mostra o HTML antes da etapa de pré-renderização; medir o arquivo final em dist.

As seis ilustrações WebP têm 1400 px de largura: landing/automação com 594 px de altura, demais com 596 px. Pesam 54.434–65.766 bytes; o logo escrito tem 324×108 e 5.846 bytes. Os PNGs originais de cerca de 1,7 MB e `logo-miniatura.png` de cerca de 1 MB estão em public, mas não são referenciados pela página atual. Aumentam o pacote publicado, não necessariamente o carregamento da página; não foram apagados.

O hero usa SVG/CSS e texto; não foi aplicado lazy loading a seu elemento principal. Imagens da galeria mantêm espaço por aspect-ratio e agora dimensões explícitas. Fontes ainda vêm de Google Fonts e podem afetar LCP/CLS; não foram trocadas para preservar tipografia. Não há analytics/chat de terceiros carregado pela página atual. Three.js, Logo3D e LeaderLine existem no repositório, mas não fazem parte do caminho de renderização atual do App/bundle; comentários antigos no README estavam desatualizados.

Em uma medição de laboratório local desktop, sem limitação de rede/CPU: LCP ~0,9–1,0 s, CLS ~0,00006. Não representa distribuição de usuários, percentil 75 ou aprovação de Core Web Vitals. INP de campo não foi medido. É necessário medir a URL pública via PageSpeed Insights/CrUX e Search Console quando disponível. Mantidas animações, pausas fora da tela e carregamento separado de Motion.

## Validação e limites

- `npm run build`: passou, incluindo renderização React no build.
- `npm run check:seo`: passou; verifica conteúdo inicial, um H1/main, seis descrições, nove respostas, IDs, âncoras, três tipos de schema e comportamento com/sem domínio. O domínio reservado example.com é somente fixture de teste e não é gravado no site.
- Chrome/Playwright local: hidratação sem erros e recursos sem respostas HTTP de erro; seleção dos seis serviços, assunto no contato, FAQ, menu mobile e modal de processo funcionando. Modal testado com preferência por movimento reduzido para evitar a espera por estabilidade da animação contínua no teste automatizado. Seis painéis, nove respostas e seis etapas legíveis sem JS; dimensões e layout responsivo verificados nas cinco larguras, com os seis serviços em cada uma. Capturas desktop/mobile inspecionadas.
- `git diff --check`: sem erros de whitespace; avisos de conversão LF/CRLF da configuração Git do ambiente.
- JSON-LD parseado e referências internas verificadas localmente. Validação externa no Schema Markup Validator/Rich Results Test da URL publicada continua pendente.
- Sem domínio informado, não foi possível verificar DNS, HTTPS, redirects www/apex, headers X-Robots-Tag, CDN/WAF, cache/compressão, robots realmente servido, indexação ou canonical reconhecido por mecanismos de busca.
- O preview padrão do Vite respondeu 200 com a home em `/nonexistent-audit-page`. Na hospedagem, assegurar 404 verdadeiro para URLs inválidas em vez de fallback indiscriminado (soft 404). Não há necessidade de rotas adicionais para esta página; o comportamento de produção ainda não foi verificado.
- Homologações públicas devem ter política de acesso/indexação própria na hospedagem. Não foi inferido domínio público a partir de variáveis de preview.

## Configuração pendente

1. **Domínio HTTPS definitivo**, incluindo escolha com/sem www: `SITE_URL` no ambiente do build ou `.env.production.local`. Depois executar novamente `npm run build`. Isso ativa canonical, og:url, URL/logo da organização e sitemap; não altera DNS.
2. **URLs oficiais de Instagram e LinkedIn**: `src/data/socialLinks.js`. Ativam menu e sameAs no próximo build.
3. **WhatsApp oficial**, se for oferecido: mesmo arquivo. Nenhum número inferido.
4. **Imagem social aprovada**, preferencialmente PNG/JPG horizontal, e descrição: colocar em public e informar `socialImage`/`socialImageAlt` em `src/data/site.js`. Validação impede referenciar arquivo local inexistente. Até lá não há og:image/twitter:image; prévia com imagem não está concluída.
5. **E-mail público oficial**, caso deva aparecer como contato, e confirmação da operação do formulário. RESEND_API_KEY, CONTACT_TO_EMAIL e CONTACT_FROM_EMAIL pertencem ao ambiente privado da hospedagem; não enviar segredos para o código/frontend. Nenhum contactPoint com dado presumido foi incluído.
6. **Hospedagem/URL de produção** para validar status HTTP, 404, cabeçalhos, redirects, envio real e Core Web Vitals. Endereço/cidade só são necessários se houver intenção real de posicionamento local.

## Base técnica e decisões GEO/AEO

Foi priorizado conteúdo útil e HTML acessível, de acordo com a documentação de [JavaScript SEO do Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) e a implementação de [hidratação do React](https://react.dev/reference/react-dom/client/hydrateRoot). O Vite documenta suporte à [pré-renderização via SSR](https://vite.dev/guide/ssr.html), usado aqui apenas durante o build.

O tipo [Service](https://schema.org/Service) descreve a oferta de serviços; [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) representa a identidade da empresa. Marcação não cria evidência de reputação nem garante resultado especial.

Não foi criado llms.txt, arquivo específico para IA ou schema obscuro. O [guia de recursos de IA do Google](https://developers.google.com/search/docs/appearance/ai-features) orienta aplicar os fundamentos de SEO e não exige arquivos especiais. O [histórico oficial de atualizações](https://developers.google.com/search/updates) de junho de 2026 esclarece que llms.txt não influencia visibilidade/ranking no Google e registra a remoção da documentação de FAQ rich results. Nenhum benefício adicional comprovado para esta landing justifica acrescentar esses arquivos ou prometer destaque da FAQ.

Não foram criadas páginas falsas, conteúdo com keyword stuffing, informação comercial inventada ou promessa de ranking/recomendação por IA.
