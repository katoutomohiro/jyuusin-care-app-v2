/**
 * PDFフォント導入テスト用コンソールユーティリティ
 *
 * 目的:
 *  - createSamplePdf() を devtools/console から直接呼び出せるようにする
 *  - UI改変なしで PDF埋め込み検証が可能
 *
 * 使い方:
 *  1. npm run dev でアプリ起動
 *  2. ブラウザの devtools で window.pdfTest() を実行
 *  3. PDFがダウンロードされ、日本語埋め込みが確認できる
 */
import { createSamplePdf } from "./registerFonts";

// window へテスト関数を登録
if (typeof window !== "undefined") {
  (window as any).pdfTest = async function () {
    try {
      const pdf = await createSamplePdf();
      if (pdf && typeof (pdf as any).save === "function") {
        (pdf as any).save("pdf-font-test.pdf");
        console.log("[PDF] ダウンロード完了: pdf-font-test.pdf");
      } else {
        console.warn("[PDF] PDFオブジェクトが不正です", pdf);
      }
    } catch (e) {
      console.error("[PDF] 生成失敗", e);
    }
  };
  console.log("window.pdfTest() でPDFフォントテスト可能");
}
