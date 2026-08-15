import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://viklangsevaserver.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://viklangsevaserver.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
