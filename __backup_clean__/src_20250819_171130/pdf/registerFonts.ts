/**
 * PDF フォント登録スケルトン (初期ドラフト)
 *
 * 目的:
 *  - 日本語 TrueType フォントを 1 回だけ登録するための将来拡張ポイント
 *  - 現在は NO-OP (既存UI / 挙動を一切変更しない)
 *
 * 実装予定（後続タスク）:
 *  - public/fonts/ShipporiMincho-Regular.ttf の遅延 fetch
 *  - jsPDF (または他 PDF ライブラリ) への VFS 登録
 *  - featureFlag (enablePdfFont) によるプリロード制御
 *
 * 注意:
 *  - 依存追加や既存コード改変なし
 *  - 呼び出されなければ一切副作用なし
 *  - 将来 jsPDF を導入する際は dynamic import を用いてバンドル影響を最小化
 *
 * 参照: docs/pdf_font_guide.md
 */


import jsPDF from "jspdf";

export interface PdfFontRegistrationOptions {
  fontUrl?: string;
  fontName?: string;
  silent?: boolean;
}


let fontsRegistered = false;

/**
 * 日本語フォントを 1 回だけ登録する
 * @returns newlyRegistered: true = 今回登録 / false = 既に登録済み or スキップ
 */
export async function ensurePdfFontsRegistered(
  opts: PdfFontRegistrationOptions = {}
): Promise<boolean> {
  if (fontsRegistered) return false;
  const fontUrl = opts.fontUrl || "/fonts/ShipporiMincho-Regular.ttf";
  const fontName = opts.fontName || "ShipporiMincho";
  try {
    const resp = await fetch(fontUrl);
    if (!resp.ok) throw new Error("Font fetch failed: " + fontUrl);
    const buf = await resp.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    // @ts-ignore
    jsPDF.API.addFileToVFS("ShipporiMincho-Regular.ttf", base64);
    // @ts-ignore
    jsPDF.API.addFont("ShipporiMincho-Regular.ttf", fontName, "normal");
    fontsRegistered = true;
    return true;
  } catch (e) {
    if (!opts.silent) throw e;
    return false;
  }
}

/**
 * サンプル PDF 生成（未実装）
 * 後続ステップで jsPDF 等を導入後に実装する。
 */

export async function createSamplePdf(): Promise<any> {
  await ensurePdfFontsRegistered();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("ShipporiMincho", "normal");
  doc.setFontSize(14);
  doc.text("重心ケア 日誌サンプル - 日本語埋め込み確認", 14, 20);
  doc.setFontSize(12);
  doc.text("栄養 / 水分 / 睡眠 / 痙攣 / 吸引 / 経管栄養 OK", 14, 30);
  return doc;
}

/**
 * 状態リセット (テスト / 診断用)
 * 本番利用想定なし。
 */
export function __resetPdfFontRegistrationForTest(): void {
  fontsRegistered = false;
}
