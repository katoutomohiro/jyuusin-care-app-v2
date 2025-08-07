import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_DISABLE_WEBSOCKET': '"true"',
  },
  server: {
    port: 3005,
    host: '0.0.0.0',
    hmr: false,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**'],
    }
  },
  build: {
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  },
  esbuild: {
    jsx: 'automatic'
  }
})