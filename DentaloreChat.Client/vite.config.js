import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enables clear source mapping for debugging
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5123', // Update with your actual .NET port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
