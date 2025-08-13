import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

function devDiagPlugin() {
  return {
    name: 'dev-diag',
    apply: (config, env) => env.command === 'serve',
    configureServer(server) {
      server.middlewares.use('/__diag.txt', (req, res, next) => {
        res.setHeader('Content-Type', 'text/plain');
        res.end('diagnostic info: dev only');
      });
      // ファイル書き込みは全面停止
    }
  };
}

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3005,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      port: 3005,
      clientPort: 3005,
    },
    watch: {
      ignored: ['**/dev-diag-latest.txt', '**/*.log']
    }
  },
  optimizeDeps: {
    force: false,
  },
  plugins: [
    react(),
    devDiagPlugin(),
  ],
});
