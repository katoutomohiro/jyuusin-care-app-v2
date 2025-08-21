import { Font } from '@react-pdf/renderer';

// src 配下に置いた TTF を相対 import（?url）で取り込む。
// これにより Vite がアセットとして確実にバンドル・配信する。
import regularUrl from './fonts/ShipporiMincho-Regular.ttf?url';
import boldUrl    from './fonts/ShipporiMincho-Bold.ttf?url';

const FAMILY = 'Shippori Mincho';
let registered = false;

/**
 * PDF 用フォント登録（glyf 付き TTF 限定）
 * - italic は登録しない（斜体は fauxItalic で表現）
 * - weight は 400 / 700 のみ
 * - import で解決された実在 URL を直接登録（SPA フォールバックで HTML を拾う事故を回避）
 */
export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: FAMILY,
    fonts: [
      { src: (regularUrl as unknown as string), fontWeight: 400 },
      { src: (boldUrl    as unknown as string), fontWeight: 700 },
    ],
  });

  registered = true;
}

export const pdfFamily = FAMILY;

/**
 * 疑似イタリック（react-pdf 用スタイル）
 */
export const fauxItalic = { transform: 'skewX(-8deg)' } as const;
