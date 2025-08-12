import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitest 実行環境判定 (dev 実行時の裸の test 参照による ReferenceError 防止)
const isVitest = !!(process?.env && (process.env as Record<string, string | undefined>).VITEST);

// 開発用: HMR を確実に localhost:3005 / WebSocket で固定し SW の影響を排除
export default defineConfig({
  plugins: [
    react(),
    // 追加プラグイン: /__diag.txt を返す dev 専用ミドルウェア（既存UI/ルーティングは不変）
    {
      name: 'diag-route',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__diag.txt') {
            const cp = require('node:child_process');
            const cwd = process.cwd();
            const branch = cp.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
            const head   = cp.execSync('git rev-parse HEAD').toString().trim();
            const commit = cp.execSync('git log -n 1 --pretty=format:"%h %cd %s" --date=iso').toString().trim();
            const body =
`repo_path=${cwd}
branch=${branch}
HEAD=${head}
commit=${commit}
generated=${new Date().toISOString()}
`;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(body);
            return;
          }
          next();
        });
      },
    },
  ],
  server: {
    host: 'localhost',
    port: 3005,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3005,
      clientPort: 3005,
    },
  },
  optimizeDeps: {
    // 古い最適化キャッシュによる 504 / 白画面を避けるため常に再解析
    force: true,
  },
});
// (Optional future use) avoid unused warning by referencing isVitest in a no-op way
isVitest && undefined;
