import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function apiOriginFromEnv(env) {
  return String(env.VITE_API_BASE_URL || 'http://localhost:5000')
    .trim()
    .replace(/\/$/, '')
    .replace(/\/api$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiOrigin = apiOriginFromEnv(env)

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
