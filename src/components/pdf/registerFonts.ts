import { Font } from '@react-pdf/renderer';

/** Shippori Mincho (glyf TrueType) だけ登録 */
Font.register({
  family: 'ShipporiMincho',
  fonts: [
    { src: '/pdf/fonts/ShipporiMincho-Regular.ttf', fontWeight: 400 },
    { src: '/pdf/fonts/ShipporiMincho-Bold.ttf',    fontWeight: 700 }
  ]
});

/** 擬似イタリック（必要なら） */
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ ShipporiMincho glyf版 フォント登録完了 (v22)');
