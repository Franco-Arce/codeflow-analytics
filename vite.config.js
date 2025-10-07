import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png', 
        'favicon-32x32.png',
        'favicon-96x96.png',
        'apple-icon-180x180.png',
        'apple-icon-precomposed.png'
      ],
      manifest: {
        name: 'Codeflow Systems',
        short_name: 'Codeflow',
        description: 'Aplicación de gestión para tu negocio',
        theme_color: '#7c3aed',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: 'android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: 'apple-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'apple-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'apple-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'apple-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png'
          },
          {
            src: 'apple-icon-114x114.png',
            sizes: '114x114',
            type: 'image/png'
          },
          {
            src: 'apple-icon-76x76.png',
            sizes: '76x76',
            type: 'image/png'
          },
          {
            src: 'apple-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'apple-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png'
          },
          {
            src: 'apple-icon-57x57.png',
            sizes: '57x57',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // Habilita PWA en desarrollo
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})