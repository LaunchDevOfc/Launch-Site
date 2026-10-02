import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { services } from '../src/data/services.js';
import { publicUrl, metadata, robots, sitemap } from './seo.js';

const html = await readFile('dist/index.html', 'utf8');
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
assert.equal((html.match(/<main[\s>]/g) || []).length, 1);
assert.match(html, /<html lang="pt-BR">/);
assert.match(html, /<meta name="description"/);
assert.doesNotMatch(html, /<div id="root"><\/div>/);
assert.doesNotMatch(html, /href="#"/);
assert.doesNotMatch(html, /noindex/);
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Âncora ausente: ${match[1]}`);
for (const service of services) {
  assert(html.includes(service.detail), `Descrição ausente: ${service.id}`);
  assert(ids.includes(`service-panel-${service.id}`));
  await access(`public${service.image}`);
}
assert.equal((html.match(/id="faq-answer-/g) || []).length, 9);
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
assert.equal(graph.filter((item) => item['@type'] === 'Organization').length, 1);
assert.equal(graph.filter((item) => item['@type'] === 'Service').length, 6);
assert.equal(graph.filter((item) => item['@type'] === 'WebSite').length, 1);
// Domínio reservado exclusivamente para testes; nunca gravado no build.
const fixtureUrl = publicUrl('https://example.com');
assert.equal(fixtureUrl, 'https://example.com/');
assert.match(metadata(fixtureUrl), /rel="canonical" href="https:\/\/example.com\/"/);
assert.doesNotMatch(metadata(''), /rel="canonical"|property="og:url"/);
assert.equal(sitemap(''), '');
assert.equal((sitemap(fixtureUrl).match(/<loc>/g) || []).length, 1);
assert.match(robots(fixtureUrl), /Disallow: \/api\//);
assert.match(robots(fixtureUrl), /Sitemap: https:\/\/example.com\/sitemap.xml/);
for (const invalid of ['http://example.com', 'https://example.com/path', 'https://example.com/?query=1', 'https://user:pass@example.com', 'https://localhost']) {
  assert.throws(() => publicUrl(invalid));
}
console.log('SEO: HTML pré-renderizado, serviços, FAQ, âncoras, schemas e configuração de URLs validados.');
