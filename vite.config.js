import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy : le frontend appelle /api et /ws en same-origin (localhost:5173),
// Vite redirige vers le backend Express/WebSocket sur le port 3001.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/ws': { target: 'http://localhost:3001', ws: true, changeOrigin: true },
    },
  },
})
