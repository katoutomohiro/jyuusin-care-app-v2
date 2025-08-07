import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_DISABLE_WEBSOCKET': '"true"',
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom'
    }
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
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          pdf: ['@react-pdf/renderer']
        }
      }
    },
    reportCompressedSize: false,
    assetsInlineLimit: 2048
  },
  esbuild: {
    jsx: 'automatic'
  }
})