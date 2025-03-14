import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // Fix: Use relative path, not 'frontend/dist'
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
