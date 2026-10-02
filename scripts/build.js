import { readFile, writeFile } from 'node:fs/promises';
import { build, createServer, loadEnv } from 'vite';
import { publicUrl, robots, sitemap } from './seo.js';

const url = publicUrl(process.env.SITE_URL || loadEnv('production', process.cwd(), '').SITE_URL || '');
await build();
// Pré-renderização da mesma árvore React, sem servidor em produção.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile('dist/index.html', 'utf8');
  if (!template.includes('<div id="root"></div>')) throw new Error('Raiz de pré-renderização não encontrada.');
  await writeFile('dist/index.html', template.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`));
  await writeFile('dist/robots.txt', robots(url));
  if (url) await writeFile('dist/sitemap.xml', sitemap(url));
  else console.warn('SEO pendente: configure SITE_URL para gerar canonical, og:url, logo absoluto e sitemap.');
} finally {
  await server.close();
}
