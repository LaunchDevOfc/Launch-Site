import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { metadata, publicUrl } from './scripts/seo.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: 'launch-metadata',
    transformIndexHtml(html) {
      const url = publicUrl(process.env.SITE_URL || loadEnv(mode, process.cwd(), '').SITE_URL || '');
      return html.replace('<!-- launch:metadata -->', () => metadata(url));
    },
  }],
}))
