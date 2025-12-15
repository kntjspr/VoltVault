import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['brand_logo.png', 'default_profile.jpg'],
      manifest: {
        name: 'VoltVault Enterprise',
        short_name: 'VoltVault',
        description: 'Eveready Enterprise Password Manager',
        theme_color: '#0F0F0F',
        background_color: '#0F0F0F',
        display: 'standalone',
        icons: [
          {
            src: 'assets/brand_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/brand_logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
