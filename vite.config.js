import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png', 
        'favicon.ico',
        'apple-icon-57x57.png',
        'apple-icon-60x60.png',
        'apple-icon-72x72.png',
        'apple-icon-76x76.png',
        'apple-icon-114x114.png',
        'apple-icon-120x120.png',
        'apple-icon-144x144.png',
        'apple-icon-152x152.png',
        'apple-icon-180x180.png',
        'ms-icon-144x144.png'
      ],
      manifest: {
        name: 'Mi Negocio App',
        short_name: 'MiNegocio',
        description: 'Gestión de ventas y productos para tu comercio',
        theme_color: '#8b5cf6',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: 'android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})