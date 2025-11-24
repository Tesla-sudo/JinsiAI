import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: "JinsiAI",
        short_name: "JinsiAI",
        description: "Msaidizi wa kilimo mahiri kwa lugha yako",
        theme_color: "#22c55e",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { "src": "/pwa-192.png", "sizes": "192x192", "type": "image/png" },
          { "src": "/pwa-512.png", "sizes": "512x512", "type": "image/png" }
        ]
      }
    })
  ]
})