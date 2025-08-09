import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    // Lightweight dev API to prevent 404 for /api/preview-vault during Vite dev (in-memory only)
    {
      name: 'dev-preview-vault-api',
      configureServer(server) {
        const memory = [] as any[];
        server.middlewares.use('/api/preview-vault', (req, res) => {
          if (!req.url) {
            res.statusCode = 400; res.end('Bad Request'); return;
          }
          if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost');
            const userId = url.searchParams.get('userId');
            const year = url.searchParams.get('year');
            let data = memory;
            if (userId) data = data.filter(v => v.userId === userId);
            if (year) data = data.filter(v => (v.dateKey||'').startsWith(year + '-'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
              try {
                const json = JSON.parse(body || '{}');
                memory.unshift(json);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(json));
              } catch (e) {
                res.statusCode = 400; res.end('Invalid JSON');
              }
            });
            return;
          }
          res.statusCode = 405; res.end('Method Not Allowed');
        });
      }
    },
    // 起動した実URLをリポジトリ直下に書き出す（DEV_SERVER_URL.txt）
    {
      name: 'write-dev-port',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const addr = server.httpServer?.address();
          // @ts-ignore - Node.js AddressInfo
          const port = typeof addr === 'object' && addr ? addr.port : 3005;
          const host = 'localhost';
          const url = `http://${host}:${port}/`;
          const out = path.resolve(process.cwd(), 'DEV_SERVER_URL.txt');
          try {
            fs.writeFileSync(out, url, 'utf-8');
            // eslint-disable-next-line no-console
            console.log(`\nDev server URL: ${url} (also written to DEV_SERVER_URL.txt)\n`);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Failed to write DEV_SERVER_URL.txt', e);
          }
        });
      }
    }
  ],
  define: {
    'process.env.VITE_DISABLE_WEBSOCKET': '"true"',
  },
  resolve: {
    alias: {
  react: 'react',
  'react-dom': 'react-dom',
  '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3005,
    host: '0.0.0.0',
  strictPort: false, // 使用中なら自動で別ポートにスライド（URLはDEV_SERVER_URL.txtで確認）
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