import { Font } from '@react-pdf/renderer';

/* TrueType only  –  OTF は使わない */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/pdf/fonts/NotoSansJP-Regular.ttf', fontWeight: 400 },
    { src: '/pdf/fonts/NotoSansJP-Bold.ttf',    fontWeight: 700 }
  ]
});

/* faux italic (必要なら style に追加して使う) */
export const fauxItalic = { transform: 'skewX(-8deg)' };

console.debug('✅ NotoSansJP TTF フォント登録完了 (fonts.ts)');
