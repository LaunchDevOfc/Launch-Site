# Launch — React + Vite

Landing page da Launch com seis serviços, processo, comparativo ilustrativo,
Quem Somos, FAQ e formulário de contato. Uma URL pública (`/`) com navegação
por âncoras; nenhuma página artificial de serviço.

## Desenvolvimento e build

```bash
npm install
npm run dev
npm run build
npm run check:seo
npm run preview
```

O build gera `dist/` com HTML pré-renderizado da mesma árvore React e hidratação
no navegador. Publique usando **npm run build**, não apenas `vite build`, que
pularia a pré-renderização e a geração de robots/sitemap. Não há servidor React
para manter em produção. O endpoint de contato precisa de hospedagem compatível
com a função serverless em `api/contact.js`.

## Identidade e SEO

- `SITE_URL`: origem HTTPS definitiva no ambiente do build ou `.env.production.local`.
  Sem ela, canonical, og:url e sitemap não são emitidos; o build informa a pendência.
- `src/data/site.js`: title, description, logo e caminho/alt da imagem social aprovada.
- `src/data/socialLinks.js`: URLs reais de Instagram, LinkedIn e WhatsApp.
- `src/data/services.js`: fonte única das seis descrições, imagens e Service Schema.
- `scripts/seo.js`: metadados e grafo Organization/WebSite/Service.
- `scripts/build.js`: pré-renderização, robots e sitemap com somente a home.
- `public/no-script.css`: leitura dos painéis e FAQ sem JavaScript.

A configuração exige um novo build para atualizar o HTML público. Nunca usar um
endereço de preview como canonical. Sem imagem social aprovada, og:image permanece
pendente. Sem os perfis oficiais, sameAs é omitido.

O relatório completo, as prioridades, limitações e verificações de publicação
estão em [docs/seo-geo-audit.md](docs/seo-geo-audit.md).

## Estrutura

- `src/App.jsx`: composição das seções.
- `src/components/`: componentes e interações.
- `src/data/`: serviços, etapas, assuntos e identidade.
- `src/hooks/`: observadores de visibilidade, animação, foco e estado das imagens.
- `src/styles/`: CSS global organizado por seção; `tokens.css` concentra os tokens.
- `public/img/servicos/`: ilustrações WebP usadas pelo site e originais PNG.
- `src/entry-server.jsx`: renderização no build; `src/main.jsx`: hidratação.

Logo3D/Three.js, ServiceCard/ServiceModal e LeaderLine são recursos legados fora
da árvore atual do App. O hero atual usa SVG/CSS; a galeria usa painéis selecionáveis.

## Formulário de contato

`api/contact.js` envia mensagens via Resend. Configure `RESEND_API_KEY`,
`CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL` exclusivamente no ambiente privado da
hospedagem, conforme `.env.example`. O remetente precisa de domínio verificado.
Para testar a função localmente, use ambiente compatível como `vercel dev`;
`vite preview` serve somente o frontend. Sem JavaScript o formulário apresenta
uma orientação, e o conteúdo informativo continua disponível.

Na publicação, verificar HTTPS, redirects da origem escolhida, 404 para caminhos
inexistentes, headers de indexação, compressão/cache, envio do formulário e dados
reais de Core Web Vitals. Essas verificações dependem da hospedagem definitiva.
