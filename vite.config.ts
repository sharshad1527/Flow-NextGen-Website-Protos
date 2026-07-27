import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import Sitemap from 'vite-plugin-sitemap'

const dynamicRoutes = ['/', '/pricing', '/guide', '/privacy', '/terms', '/refund']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://flow-nextgen.com',
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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
