import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: { transformMixedEsModules: true }
  },  
  server: {
    proxy: {
      '/api': 'http://localhost:3002',
    },
    port: 6139
  },
  
})
