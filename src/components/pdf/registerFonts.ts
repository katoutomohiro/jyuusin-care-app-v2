import { Font } from '@react-pdf/renderer';

/** BASE_URL を使用して確実なフォントパスを生成 */
const base = import.meta.env.BASE_URL || '/';
const fontPath = (filename: string) => `${base}pdf/fonts/${filename}`.replace(/\/+/g, '/');

/** Shippori Mincho (glyf TrueType) だけ登録 */
Font.register({
  family: 'ShipporiMincho',
  fonts: [
    { src: fontPath('ShipporiMincho-Regular.ttf'), fontWeight: 400 },
    { src: fontPath('ShipporiMincho-Bold.ttf'),    fontWeight: 700 }
  ]
});

/** 擬似イタリック（必要なら） */
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ ShipporiMincho glyf版 フォント登録完了 (v24 - BASE_URL対応)');
