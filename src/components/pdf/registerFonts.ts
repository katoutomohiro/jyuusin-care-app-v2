import { Font } from '@react-pdf/renderer';

// Vite/Next（Vite駆動）で public 配下の静的アセットを確実に配信させるため、?url で取り込む
// これによりバンドラがファイルを追跡し、実在 URL（ハッシュ付きパス等）を返す
// ※ /public/fonts/* に実体が必須
import regularUrl from '/fonts/ShipporiMincho-Regular.ttf?url';
import boldUrl    from '/fonts/ShipporiMincho-Bold.ttf?url';

const FAMILY = 'Shippori Mincho';
let registered = false;

/**
 * PDF 用フォント登録（glyf 付き TTF 限定）
 * - italic は登録しない（斜体は fauxItalic で表現）
 * - weight は 400 / 700 のみ
 * - 直に import した実在 URL を登録（HTMLへのフォールバックを回避）
 */
export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: FAMILY,
    fonts: [
      { src: regularUrl as unknown as string, fontWeight: 400 },
      { src: boldUrl    as unknown as string, fontWeight: 700 },
    ],
  });

  registered = true;
}

export const pdfFamily = FAMILY;

/**
 * 疑似イタリック（react-pdf 用スタイル）
 */
export const fauxItalic = { transform: 'skewX(-8deg)' } as const;
