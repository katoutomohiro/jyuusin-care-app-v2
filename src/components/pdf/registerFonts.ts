import { Font } from '@react-pdf/renderer';

/** glyf 版 TrueType だけ登録（italic は登録しない） */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/pdf/fonts/NotoSansJP-glyf-Regular.ttf', fontWeight: 400 },
    { src: '/pdf/fonts/NotoSansJP-glyf-Bold.ttf',    fontWeight: 700 }
  ]
});

/** 擬似イタリック用ユーティリティ */
export const fauxItalic = { transform: 'skewX(-8deg)' };

if (import.meta.env.DEV) console.debug('✅ NotoSansJP glyf版 フォント登録完了 (v21)');
