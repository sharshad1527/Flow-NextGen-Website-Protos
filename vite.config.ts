import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import Sitemap from 'vite-plugin-sitemap'
import { VitePWA } from 'vite-plugin-pwa'

const dynamicRoutes = ['/pricing', '/guide', '/privacy', '/terms', '/refund']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://flownextgen.netlify.app',
      dynamicRoutes,
      exclude: ['/bg-playground'],
      changefreq: 'weekly',
      priority: 0.7,
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/bg-playground',
        },
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.webp'],
      manifest: {
        name: 'Flow NextGen',
        short_name: 'Flow NextGen',
        description: 'Bulk AI generation queue for Google Flow',
        theme_color: '#0D0D0D',
        background_color: '#0D0D0D',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,jpg,png,svg}'],
        navigateFallbackDenylist: [/^\/pay\.html/, /^\/success\.html/, /^\/google.*\.html/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
