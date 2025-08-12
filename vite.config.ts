import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3005,
  },
  plugins: [
    react(),
    {
      name: 'dev-diag-middleware',
      apply: 'serve',
      configureServer(server) {
        const cp = require('node:child_process');
        const opts = { timeout: 1000 };
        const safe = (cmd) => {
          try { return cp.execSync(cmd, { ...opts }).toString().trim(); }
          catch { return 'unknown'; }
        };
        server.middlewares.use('/__diag.txt', (_req, res) => {
          const repoPath = process.cwd();
          const branch   = safe('git rev-parse --abbrev-ref HEAD');
          const head     = safe('git rev-parse HEAD');
          const commit   = safe('git log -n 1 --pretty=format:"%h %cd %s" --date=iso');
          const generated = new Date().toISOString();
          const content = `repo_path=${repoPath}
branch=${branch}
HEAD=${head}
commit=${commit}
generated=${generated}`;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(content);
        });
      }
    }
  ],
});
