import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import type { ViteSSGOptions } from 'vite-ssg'

const ssgOptions: ViteSSGOptions = {
  script: 'async',
  dirStyle: 'nested',
  formatting: 'minify',
  mock: true,
  beastiesOptions: false,
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
