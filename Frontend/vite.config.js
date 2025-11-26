// vite.config.js
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
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],

  // THIS IS THE MAGIC - Expose your custom env vars
  define: {
    // eslint-disable-next-line no-undef
    'import.meta.env.AZURE_OPENAI_KEY': JSON.stringify(process.env.AZURE_OPENAI_KEY),
    // eslint-disable-next-line no-undef
    'import.meta.env.AZURE_OPENAI_ENDPOINT': JSON.stringify(process.env.AZURE_OPENAI_ENDPOINT),
    // eslint-disable-next-line no-undef
    'import.meta.env.AZURE_OPENAI_DEPLOYMENT': JSON.stringify(process.env.AZURE_OPENAI_DEPLOYMENT),
  }
})