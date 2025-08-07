import { Font } from '@react-pdf/renderer';

/** TrueType only – italic は faux 値で吸収する */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/pdf/fonts/NotoSansJP-Regular.ttf', fontWeight: 400 },
    { src: '/pdf/fonts/NotoSansJP-Bold.ttf',    fontWeight: 700 }
  ]
});

/** 擬似イタリックを使いたい時にだけ import して style に展開 */
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ NotoSansJP 真のTTF フォント登録完了 (v20)');
