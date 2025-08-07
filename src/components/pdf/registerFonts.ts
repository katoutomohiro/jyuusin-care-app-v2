import { Font } from '@react-pdf/renderer';

/**
 * ブラウザ互換のパス生成。 `new URL()` で絶対パスに変換してから
 * `.href` を返せば Node の path.join を使わずに済む。
 */
const fontPath = (name: string, weight: string) =>
  new URL(`/pdf/fonts/${name}-${weight}.ttf`, window.location.origin).href;

Font.register({
  family: 'NotoSansJP',
  fonts : [
    { src: fontPath('ShipporiMincho', 'Regular'), fontWeight: 400 },
    { src: fontPath('ShipporiMincho', 'Bold'),    fontWeight: 700 }
  ]
});

// italic は fontkit が解析できないため fauxItalic をエクスポート
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ NotoSansJP (ShipporiMincho TTF) フォント登録完了 (v26 - ブラウザ互換)');
