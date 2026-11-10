import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import type { ViteSSGOptions } from 'vite-ssg'

// Umami analytics only runs in production: the dev server drops its script from index.html
const noUmamiInDev: Plugin = {
  name: 'no-umami-in-dev',
  apply: 'serve',
  transformIndexHtml: (html) => html.replace(/\s*<script[^>]*umami[^>]*><\/script>/, ''),
}

const ssgOptions: ViteSSGOptions = {
  script: 'async',
  dirStyle: 'nested',
  // Not minified: on the thousands of story pages it took a quarter of the
  // build, for some 350 bytes a page once compressed
  formatting: 'none',
  mock: true,
  beastiesOptions: false,
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    noUmamiInDev,
    vue({ template: { transformAssetUrls } }),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        // ttf: the titles, logo and Arabic fonts, so they are there offline too
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}'],
        globIgnores: [
          // Not the thousands of story pages: every visitor would download them all
          // after each deploy. Offline, a story link opens on the synaxarium page (sw.ts).
          '**/synaxarium/*/index.html',
          // The icon font is used as woff2: not its 1.3 MB ttf fallback
          '**/materialdesignicons-webfont-*.ttf',
        ],
      },
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Katameros',
        short_name: 'Katameros',
        description: 'The Coptic lectionary. Church readings for all Week Days and Feasts.',
        categories: ['books', 'religion'],
        theme_color: '#ffc107',
        background_color: '#000000',
        icons: [
          {
            src: 'img/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ssr: {
    noExternal: ['vuetify', /^vuetify\/.+/],
  },
  ssgOptions,
})
