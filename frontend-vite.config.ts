import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './client/src/assets'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@shared': path.resolve(__dirname, './shared')
    },
  },
  // Enable CORS handling for API requests
  server: {
    port: 3000,
    cors: true
  },
  // Ensure that build output is optimized for deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})