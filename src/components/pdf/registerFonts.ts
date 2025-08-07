import { Font } from '@react-pdf/renderer';
import path from 'path';

const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '/'); // 末尾スラッシュ 1 個に整理
const font = (file: string) => path.join(base, 'pdf/fonts', file);

Font.register({
  family: 'NotoSansJP',
  fonts : [
    { src: font('ShipporiMincho-Regular.ttf'), fontWeight: 400 },
    { src: font('ShipporiMincho-Bold.ttf'),    fontWeight: 700 }
  ]
});

// italic は fontkit が解析できないため fauxItalic をエクスポート
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ NotoSansJP (ShipporiMincho TTF) フォント登録完了 (v25 - BASE_URL対応)');
