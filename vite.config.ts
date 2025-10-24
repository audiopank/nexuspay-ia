import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

// Configuração otimizada para React + Tailwind + Vercel + PWA
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg"],
      manifest: {
        name: "NexusPay",
        short_name: "NexusPay",
        description:
          "A complete and fully functional global payment platform with a robust affiliate system, powerful integrations, webhook system, and a comprehensive API for developers. Features a modern dark UI with real-time analytics.",
        theme_color: "#0f172a",
        background_color: "#020617",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/vite.svg",
            sizes: "192x192",
            type: "image/svg+xml"
          },
          {
            src: "/vite.svg",
            sizes: "512x512",
            type: "image/svg+xml"
          },
          {
            src: "/vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  build: {
    outDir: "dist",
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173
  }
})
