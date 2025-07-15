import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,  // 👈 This is key!
    rollupOptions: {
      input: {
        popup: 'index.html',
        dashboard: 'dashboard.html',
      },
    },
    outDir: 'dist',
  },
})
