// src/components/pdf/registerFonts.ts

// 将来の挙動切替用フラグ。featureFlags が無い環境でも壊さない。
let flags: { pdfSafeMode?: boolean } = { pdfSafeMode: true };
(async () => {
  try {
    // 動的 import：存在しなければ無視（型/ビルドを壊さない）
  // NOTE: 拡張子無しで動的import（Vite推奨）。型解決失敗時は安全に null。
  const mod = await import('../../config/featureFlags').catch(() => null as unknown as { featureFlags?: { pdfSafeMode?: boolean } });
    if (mod?.featureFlags) flags = mod.featureFlags;
  } catch {
    // ignore
  }
})();

// フォント探索：マッチ0件でも Vite は空オブジェクトを返すため安全
// Vite の import.meta.glob 型宣言が無い場合へのフォールバック (最小限)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fontUrls = (import.meta as any).glob('./fonts/*.ttf', {
  eager: true,
  // Vite 5 の as:'url'。型の都合で any キャスト。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: 'url' as any,
}) as Record<string, string>;

let registered = false;

/**
 * PDFフォントを「存在する時だけ」安全に登録する。
 * - @react-pdf/renderer が未導入なら即 no-op
 * - フォントファイルが無ければ即 no-op
 * - 例外はログのみで UI/ビルドを壊さない
 */
export async function ensurePdfFontsRegistered(): Promise<void> {
  if (registered) return;
  if (!flags.pdfSafeMode) return;

  // 動的 import（依存未導入でも壊さない）
  let Font: any | undefined;
  try {
    const pdfMod = await import('@react-pdf/renderer').catch(() => null as unknown as { Font?: any });
    Font = pdfMod?.Font;
  } catch {
    Font = undefined;
  }
  if (!Font) {
    // @react-pdf/renderer 未導入：安全にスキップ
    // console.info('[PDF FONT] @react-pdf/renderer not available, skip');
    return;
  }

  try {
    const entries = Object.entries(fontUrls);
    if (entries.length === 0) {
      // フォント未同梱：安全にスキップ
      // console.info('[PDF FONT] no TTF fonts found, skip registration');
      return;
    }

    // "Regular"/"Bold" を優先。無ければ1件目をRegular扱いで登録。
    const pick = (kw: string): string | undefined =>
      entries.find(([p]) => p.toLowerCase().includes(kw))?.[1];

    const regular = pick('regular') ?? entries[0][1];
    const bold = pick('bold');

    const fonts: Array<{ src: string; fontStyle: 'normal'; fontWeight: number }> = [
      { src: regular, fontStyle: 'normal', fontWeight: 400 },
    ];
    if (bold) fonts.push({ src: bold, fontStyle: 'normal', fontWeight: 700 });

    Font.register({ family: 'ShipporiMincho', fonts });
    registered = true;
  } catch (e) {
    console.error('[PDF FONT] register failed (no-op):', e);
    // 失敗してもUIを落とさない
  }
}

// CFF/CFF2禁止。イタリックはfaux対応（必要時のみ）
export const fauxItalic = { transform: 'skewX(-8deg)' } as const;
