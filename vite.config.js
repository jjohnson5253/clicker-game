import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000, // or any other port you prefer
    watch: {
      usePolling: true
    }
  },
  css: {
    postcss: false,
  },
})
