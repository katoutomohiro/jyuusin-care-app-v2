// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,       // ← 一時的に3005（3003,3004が使用中のため）
    strictPort: true, // ← ポート3005厳守
    host: '0.0.0.0'   // ← 外部アクセス対応
  }
});
