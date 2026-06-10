import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api/fd → https://api.football-data.org/v4
      // This avoids CORS issues when calling the API from the browser
      '/api/fd': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fd/, ''),
        secure: true,
      },
    },
  },
})

