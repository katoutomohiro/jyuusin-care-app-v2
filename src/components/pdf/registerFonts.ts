import { Font } from '@react-pdf/renderer';

/* TTF only –  italic 未登録 */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/pdf/fonts/NotoSansJP-Regular.ttf', fontWeight: 400 },
    { src: '/pdf/fonts/NotoSansJP-Bold.ttf',    fontWeight: 700 }
  ]
});

/* faux italic – 使う場合は {...fauxItalic} を style に混ぜる */
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ NotoSansJP TTF フォント登録完了 (registerFonts.ts)');
