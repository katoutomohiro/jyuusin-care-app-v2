import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 開発用: HMR を確実に localhost:3005 / WebSocket で固定し SW の影響を排除
export default defineConfig({
  plugins: [react()],
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