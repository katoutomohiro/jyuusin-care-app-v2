import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

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
      // 生成物やViteの一時ファイルを監視から除外（リロードループ防止）
      ignored: [
        '**/dev-diag-latest.txt',
        '**/*.timestamp-*.mjs',
        '**/.vite/**'
      ]
    }
  },
  optimizeDeps: {
    force: false,
  },
  plugins: [
    react(),
    {
      name: 'dev-diag-middleware',
      apply: 'serve',
      configureServer(server) {
        const safe = (cmd) => {
          try {
            return execSync(cmd, { timeout: 1000 }).toString().trim();
          } catch {
            return 'unknown';
          }
        };
        const makeContent = () => {
          const repoPath = process.cwd();
          const branch   = safe('git rev-parse --abbrev-ref HEAD');
          const head     = safe('git rev-parse HEAD');
          const commit   = safe('git log -n 1 --pretty=format:"%h %cd %s" --date=iso');
          const generated = new Date().toISOString();
          return `repo_path=${repoPath}
branch=${branch}
HEAD=${head}
commit=${commit}
generated=${generated}`;
        };

        // 起動時に一度だけコンソールとファイルへ出力（PowerShell不要）
        server.httpServer?.once('listening', () => {
          const c = makeContent();
          console.log('[dev-diag]', c.replace(/\n/g, ' | '));
          try { fs.writeFileSync('dev-diag-latest.txt', c, 'utf8'); } catch {}
        });

        // 既存の __diag.txt ルート
        server.middlewares.use('/__diag.txt', (_req, res) => {
          const c = makeContent();
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(c);
        });
      },
    },
  ],
});
