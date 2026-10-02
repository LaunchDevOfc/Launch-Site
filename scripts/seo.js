import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { site } from '../src/data/site.js';
import { socialLinks } from '../src/data/socialLinks.js';
import { services } from '../src/data/services.js';

export function publicUrl(value = '') {
  if (!value.trim()) return '';
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.hostname === 'localhost') {
    throw new Error('SITE_URL deve ser a origem HTTPS definitiva, sem caminho, credenciais, query ou fragmento.');
  }
  return url.href;
}

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function metadata(url) {
  const tags = [`<title>${escape(site.title)}</title>`];
  const meta = (key, value, property = false) => tags.push(`<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}">`);
  meta('description', site.description);
  for (const [key, value] of Object.entries({ title: site.title, description: site.description, type: 'website', site_name: site.name, locale: 'pt_BR' })) meta(`og:${key}`, value, true);
  meta('twitter:title', site.title);
  meta('twitter:description', site.description);
  if (url) {
    tags.push(`<link rel="canonical" href="${escape(url)}">`);
    meta('og:url', url, true);
  }
  if (site.socialImage) {
    if (!/^\/[\w/-]+\.(png|jpe?g)$/i.test(site.socialImage) || !existsSync(resolve('public', site.socialImage.slice(1))) || !site.socialImageAlt) {
      throw new Error('Configure uma imagem social PNG/JPG existente em public/ e seu texto alternativo.');
    }
    if (url) {
      const image = new URL(site.socialImage, url).href;
      meta('og:image', image, true);
      meta('og:image:alt', site.socialImageAlt, true);
      meta('twitter:image', image);
      meta('twitter:image:alt', site.socialImageAlt);
    }
  }
  meta('twitter:card', url && site.socialImage ? 'summary_large_image' : 'summary');
  const id = (fragment) => `${url}#${fragment}`;
  const sameAs = ['instagram', 'linkedin'].map((key) => socialLinks[key].url).filter(Boolean);
  for (const profile of sameAs) {
    if (new URL(profile).protocol !== 'https:') throw new Error('Perfis oficiais devem usar HTTPS.');
  }
  const graph = [
    { '@type': 'Organization', '@id': id('organization'), name: site.name, description: site.description,
      ...(url && { url, logo: new URL(site.logo, url).href }), ...(sameAs.length && { sameAs }) },
    { '@type': 'WebSite', '@id': id('website'), name: site.name, inLanguage: 'pt-BR', publisher: { '@id': id('organization') }, ...(url && { url }) },
    ...services.map((service) => ({ '@type': 'Service', '@id': id(`service-${service.id}`), name: service.title, description: service.detail, provider: { '@id': id('organization') }, ...(url && { url: `${url}#servicos` }) })),
  ];
  tags.push(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n  ');
}

export function robots(url) {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n${url ? `\nSitemap: ${url}sitemap.xml\n` : ''}`;
}

export function sitemap(url) {
  if (!url) return '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(url)}</loc></url></urlset>\n`;
}
